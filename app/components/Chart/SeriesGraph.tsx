import React, { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  LineData,
  MouseEventParams,
  BarPrices,
} from 'lightweight-charts';
import { DateTime } from 'luxon';
import { css } from 'styled-components';

import { getPriceFormatter } from '~/components/Chart/graph.helpers';
import { SeriesGraphDuration } from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { formatNumber } from '~/helpers/helpers';
import { useWindowResize, useWindowScroll } from '~/hooks';
import { useUiSettings } from '~/UiProvider';

const Tooltip = css`
  width: 125px;
  height: 48px;
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
  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

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
      color: isLightTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
      style: 3,
      labelVisible: false,
      width: 1,
    },
    horzLine: {
      color: isLightTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
      style: 3,
      labelVisible: false,
      width: 1,
    },
  },
  grid: {
    vertLines: {
      color: isLightTheme ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
    },
    horzLines: {
      visible: false,
    },
  },
  handleScale: false,
  handleScroll: false,
});

const TOOLTIP_WIDTH = 125;
const TOOLTIP_HEIGHT = 48;
const CHART_RIGHT_PADDING = 60;
const CHART_BOTTOM_PADDING = 26;

interface Props {
  data: LineData[];
  duration: SeriesGraphDuration;
  onMove: (e: MouseEventParams) => void;
  className?: string;
  changePercent?: number;
}

export const SeriesGraph: React.FC<Props> = React.memo(function Graph({
  data,
  duration,
  className,
  onMove,
  changePercent = 1,
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const refTooltip = useRef<HTMLDivElement | null>(null);

  const [chart, setChart] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<'Line'> | null>(null);
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

  const renderTooltip = useCallback(
    (param: MouseEventParams) => {
      if (
        !refTooltip.current ||
        !param.point ||
        !series ||
        !param.time ||
        !param.seriesPrices.get(series)
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

      const price = param.seriesPrices.get(series);
      const date = DateTime.fromSeconds(Number(param.time));

      refTooltip.current.innerHTML = `<div>
    </div>
      ${date.toUTC().toFormat('dd/MM/yyyy HH:mm')}
    </div>
    <div class="text-center">${formatNumber(Number(price).toFixed(20))}</div></div>`;

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
    [series, containerBounds.height, containerBounds.width]
  );

  const onResize = useCallback(() => {
    if (chart && ref.current) {
      chart.applyOptions({ width: ref.current.offsetWidth });
      chart.timeScale().fitContent();
      updateContainerBounds();
    }
  }, [chart, ref, updateContainerBounds]);

  useWindowResize(onResize);
  useWindowScroll(() => {
    if (refTooltip.current) {
      refTooltip.current.style.display = 'none';
    }
  });

  useEffect(() => {
    const element = ref.current;
    if (element) {
      import('lightweight-charts').then(({ createChart }) => {
        setChart(createChart(element, chartOptions(isLightTheme)));
      });
    }
  }, [ref, isLightTheme]);

  useEffect(() => {
    if (chart) {
      const series = chart.addLineSeries({
        color: isLightTheme ? '#000' : '#fff',
        lineWidth: 1,
        priceLineVisible: true,
        priceLineColor: changePercent > 0 ? '#00633A' : '#FB5400',
        priceLineStyle: 3,
        crosshairMarkerVisible: false,
      });
      updateContainerBounds();
      setSeries(series);
    }
  }, [chart, changePercent, updateContainerBounds, isLightTheme]);

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

  useEffect(() => {
    if (series && chart && data) {
      series.applyOptions({
        priceFormat: getPriceFormatter(data),
      });
      series.setData(data);
      chart.timeScale().fitContent();
      chart.timeScale().applyOptions({
        timeVisible: duration === SeriesGraphDuration.DAY,
      });
      chart.subscribeCrosshairMove(function (param) {
        onMove(param);
        renderTooltip(param);
      });
    }
  }, [series, chart, duration, data, onMove, renderTooltip]);

  useEffect(() => {
    if (chart) {
      return () => chart?.remove();
    }
  }, [chart]);

  return (
    <div className={className}>
      <div ref={ref} className="absolute inset-0 z-[1]" />
    </div>
  );
});
