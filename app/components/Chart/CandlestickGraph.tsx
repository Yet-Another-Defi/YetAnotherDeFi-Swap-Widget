import React, { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  BarData,
  MouseEventParams,
  BarPrices,
} from 'lightweight-charts';
import { DateTime } from 'luxon';
import { css } from 'styled-components';

import { CandlestickGraphDuration } from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { useWindowResize, useWindowScroll } from '~/hooks';
import { getPriceFormatter } from './graph.helpers';
import { formatNumber } from '~/helpers/helpers';
import { useUiSettings } from '~/UiProvider';

const chartOptions = (isLightTheme: boolean): DeepPartial<ChartOptions> => ({
  layout: {
    backgroundColor: 'transparent',
    textColor: isLightTheme ? '#000' : '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat',
  },
  localization: {
    locale: 'en',
    dateFormat: 'MM/dd/yyyy',
  },
  timeScale: {
    borderVisible: false,
    timeVisible: true,
  },
  rightPriceScale: {
    borderVisible: false,
    drawTicks: false,
  },
  crosshair: {
    vertLine: {
      color: isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
      style: 3,
      labelBackgroundColor: isLightTheme ? '#000' : '#fff',
      width: 1,
      labelVisible: false,
    },
    horzLine: {
      color: isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
      style: 3,
      labelBackgroundColor: isLightTheme ? '#000' : '#fff',
      width: 1,
      labelVisible: false,
    },
  },
  grid: {
    vertLines: {
      color: isLightTheme ? 'rgba(0,0,0x,0.6)' : 'rgba(255, 255, 255, 0.1)',
    },
    horzLines: {
      visible: false,
    },
  },
  handleScale: false,
  handleScroll: false,
});

interface Props {
  data: BarData[];
  duration: CandlestickGraphDuration;
  onMove: (e: MouseEventParams) => void;
  className?: string;
}

const TOOLTIP_WIDTH = 140;
const TOOLTIP_HEIGHT = 70;
const CHART_RIGHT_PADDING = 60;
const CHART_BOTTOM_PADDING = 26;

const Tooltip = css`
  width: 140px;
  height: 70px;
  position: absolute;
  flex-direction: column;
  justify-content: space-between;
  display: none;
  padding: 8px;
  box-sizing: border-box;
  font-size: 12px;
  backdrop-filter: blur(4px);
  text-align: left;
  z-index: 3;
  pointer-events: none;
  border-radius: 10px;
`;

const LightTooltip = css`
  color: #000;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const DarkTooltip = css`
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 2px 10px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

export const CandleStickGraph: React.FC<Props> = React.memo(function Graph({
  data,
  duration,
  className,
  onMove,
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const refTooltip = useRef<HTMLDivElement | null>(null);

  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candleStick, setCandlestick] = useState<ISeriesApi<'Candlestick'> | null>(null);
  const [containerBounds, setContainerBounds] = useState({ x: 0, y: 0, height: 0, width: 0 });

  const { isLightTheme } = useUiSettings();

  const updateContainerBounds = useCallback(() => {
    if (ref.current) {
      setContainerBounds({
        x: ref.current.getBoundingClientRect().x,
        y: ref.current.getBoundingClientRect().y,
        height: ref.current.getBoundingClientRect().height,
        width: ref.current.getBoundingClientRect().width,
      });
    }
  }, [ref]);

  const onResize = useCallback(() => {
    if (chart && ref.current) {
      chart.applyOptions({ width: ref.current.offsetWidth });
      chart.timeScale().fitContent();
      updateContainerBounds();
    }
  }, [chart, ref, updateContainerBounds]);

  const renderTooltip = useCallback(
    (param: MouseEventParams) => {
      if (
        !refTooltip.current ||
        !param.point ||
        !candleStick ||
        !param.time ||
        !param.seriesPrices.get(candleStick)
      ) {
        return;
      }

      const isHidden =
        !param.time ||
        param.point.x <= 10 ||
        param.point.y <= 20 ||
        param.point.x + 10 > containerBounds.width - CHART_RIGHT_PADDING ||
        param.point.y + 20 > containerBounds.height - CHART_BOTTOM_PADDING;

      if (isHidden) {
        refTooltip.current.style.display = 'none';
        return;
      }

      refTooltip.current.style.display = 'flex';

      const currentData = param.seriesPrices.get(candleStick) as BarPrices;
      const openPrice = currentData.open;
      const closePrice = currentData.close;
      const date = DateTime.fromSeconds(Number(param.time));
      const isGreen = openPrice < closePrice;

      refTooltip.current.innerHTML = `<div class="flex items-center"><div class="w-3 h-3 rounded-full inline-block mr-1 ${
        isGreen ? 'bg-green' : 'bg-orange'
      }"></div>${date.toUTC().toFormat('dd/MM/yyyy HH:mm')}</div>
        <div class="text-center">Open: ${formatNumber(
          Number(openPrice).toFixed(20)
        )}</div><div class="text-center">Close: ${formatNumber(
        Number(closePrice).toFixed(20)
      )}</div></div>`;

      let left = +param.point.x;

      if (left > containerBounds.width - TOOLTIP_WIDTH - CHART_RIGHT_PADDING) {
        left = param.point.x - TOOLTIP_WIDTH;
      }

      let top = +param.point.y;

      if (top > containerBounds.height - TOOLTIP_HEIGHT - CHART_BOTTOM_PADDING) {
        top = param.point.y - TOOLTIP_HEIGHT;
      }

      refTooltip.current.style.left = left + 'px';
      refTooltip.current.style.top = top + 'px';
    },
    [candleStick, containerBounds.height, containerBounds.width]
  );

  useWindowResize(onResize);
  useWindowScroll(() => {
    if (refTooltip.current) {
      refTooltip.current.style.display = 'none';
    }
  });

  //create chart
  useEffect(() => {
    const element = ref.current;

    if (element) {
      import('lightweight-charts').then(({ createChart }) => {
        setChart(createChart(element, chartOptions(isLightTheme)));
      });
    }
  }, [ref, isLightTheme]);

  //add settings
  useEffect(() => {
    if (chart && ref.current) {
      const candleStick = chart.addCandlestickSeries({
        priceLineVisible: true,
        upColor: '#00633A',
        downColor: '#FB5400',
        borderVisible: false,
        wickUpColor: '#00633A',
        wickDownColor: '#FB5400',
      });
      updateContainerBounds();
      setCandlestick(candleStick);

      return () => chart?.remove();
    }
  }, [chart, updateContainerBounds]);

  //mount tooltip in node
  useEffect(() => {
    const containerNode = ref.current;

    if (containerNode) {
      refTooltip.current = document.createElement('div');
      containerNode.appendChild(refTooltip.current);

      const styles =
        Tooltip.toString() + `${isLightTheme ? LightTooltip.toString() : DarkTooltip.toString()}`;

      //@ts-ignore
      refTooltip.current.style = styles;
    }

    return () => {
      if (refTooltip.current && containerNode) {
        containerNode.removeChild(refTooltip.current);
      }
    };
  }, [refTooltip, updateContainerBounds, isLightTheme, ref]);

  // subscribe and resize update
  useEffect(() => {
    if (candleStick && chart && data) {
      candleStick.applyOptions({
        priceFormat: getPriceFormatter(data),
      });
      candleStick.setData(data);
      chart.timeScale().fitContent();
      chart.timeScale().applyOptions({
        timeVisible: duration === CandlestickGraphDuration.HOUR,
      });
      chart.subscribeCrosshairMove(function (param) {
        onMove(param);
        renderTooltip(param);
      });
    }
  }, [candleStick, chart, duration, data, onMove, containerBounds, renderTooltip]);

  return (
    <div className={className}>
      <div ref={ref} className="absolute inset-0 z-[1]" />
    </div>
  );
});
