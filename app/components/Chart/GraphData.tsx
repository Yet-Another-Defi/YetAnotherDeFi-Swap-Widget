import React, { useMemo } from 'react';
import clsx from 'clsx';
import type { BarData, LineData } from 'lightweight-charts';
import styled from 'styled-components';

import type { GraphType } from '~/routes/api/graph.$chainId.$from.$to.$duration';
import {
  CandlestickGraphDuration,
  isCandlestickData,
  isSeriesData,
} from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { SeriesGraphDuration } from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { Durations } from '~/components/Chart/Durations';
import { formatNumber } from '~/helpers/helpers';
import { SeriesIcon } from '../Icon/SeriesIcon';
import { CandleStickIcon } from '../Icon/CandlestickIcon';
import { FixedNumber } from 'ethers';

interface Props {
  data?: LineData[] | BarData[];
  changeDuration: (duration: SeriesGraphDuration | CandlestickGraphDuration) => void;
  duration: SeriesGraphDuration | CandlestickGraphDuration;
  isLoading: boolean;
  currentPrice: number;
  graphType: GraphType;
  setGraphType: (graphTypw: GraphType) => void;
  changePercent?: number;
}

const graphDurationPastText: Record<SeriesGraphDuration | CandlestickGraphDuration, string> = {
  [CandlestickGraphDuration.THIRTY_MIN]: 'Past day',
  [CandlestickGraphDuration.HOUR]: 'Past 2 days',
  [CandlestickGraphDuration.FOUR_HOURS]: 'Past week',
  [CandlestickGraphDuration.DAY]: 'Past month',
  [CandlestickGraphDuration.FOUR_DAYS]: 'Past six months',
  [SeriesGraphDuration.DAY]: 'Past day',
  [SeriesGraphDuration.WEEK]: 'Past week',
  [SeriesGraphDuration.MONTH]: 'Past month',
  [SeriesGraphDuration.SIX_MONTH]: 'Past six month',
  [SeriesGraphDuration.YEAR]: 'Past year',
  [SeriesGraphDuration.ALL]: '',
};

const StyledDurations = styled(Durations)`
  display: flex;
  margin-left: auto;

  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

export const GraphData = React.memo(function GraphData({
  data,
  duration,
  changeDuration,
  isLoading,
  currentPrice,
  graphType,
  setGraphType,
  changePercent,
}: Props) {
  const lastValue = useMemo(() => {
    if (isLoading || !data) {
      return 'Loading...';
    }

    if (currentPrice > 0) {
      return formatNumber(currentPrice.toFixed(20));
    }

    if (data?.length > 0 && isSeriesData(data)) {
      return formatNumber(data[data.length - 1].value.toFixed(20));
    }

    if (data?.length > 0 && isCandlestickData(data)) {
      return formatNumber(data[data.length - 1].open.toFixed(20));
    }

    return 'No data for currency pair';
  }, [isLoading, currentPrice, data]);

  const onSwapGraph = () => {
    if (graphType === 'series') {
      setGraphType('candlestick');
      changeDuration(CandlestickGraphDuration.HOUR);
      return;
    }
    setGraphType('series');
    changeDuration(SeriesGraphDuration.MONTH);
  };

  return (
    <div className="flex items-end">
      <div className="mt-3">
        <span className="text-2xl">{lastValue}</span>
        {changePercent && (
          <span className={clsx('ml-3 text-sm', changePercent > 0 ? 'text-green' : 'text-orange')}>
            {formatNumber(String(changePercent), 4)}%
            {graphDurationPastText[duration] && ` (${graphDurationPastText[duration]})`}
          </span>
        )}
      </div>
      <div className="ml-auto flex items-center">
        <StyledDurations
          changeDuration={changeDuration}
          duration={duration}
          graphType={graphType}
        />
        <button
          onClick={onSwapGraph}
          className={clsx(
            'ml-2.5 flex h-[24px] w-[24px] outline-none items-center justify-center rounded bg-black/20 text-black transition-colors duration-200 hover:bg-gray',
            'dark:bg-white/20 dark:text-white'
          )}
        >
          {graphType === 'series' ? <CandleStickIcon /> : <SeriesIcon />}
        </button>
      </div>
    </div>
  );
});
