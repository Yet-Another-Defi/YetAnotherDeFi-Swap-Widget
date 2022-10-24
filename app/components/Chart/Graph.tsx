import type { MouseEventParams } from 'lightweight-charts';
import type { DebouncedFunc } from 'lodash';

import type {
  CandlestickGraphDuration,
  GraphResponse,
  GraphType,
  SeriesGraphDuration,
} from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { isCandlestickData, isSeriesData } from '~/routes/api/graph.$chainId.$from.$to.$duration';
import {
  isCandleStickDuration,
  isSeriesDuration,
} from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { GraphPending } from './GraphPending';
import { CandleStickGraph } from './CandlestickGraph';
import { SeriesGraph } from './SeriesGraph';
import { useIsMounted } from '~/hooks';

interface Props {
  graphType: GraphType;
  duration: CandlestickGraphDuration | SeriesGraphDuration;
  onMove: DebouncedFunc<(e: MouseEventParams) => void>;
  isLoading: boolean;
  data?: GraphResponse;
  changePercent?: number;
}

export function Graph({
  graphType,
  duration,
  onMove,
  isLoading,
  data,
  changePercent,
}: Props): JSX.Element | null {
  const isDataReceived = !!data && !!data.length && !isLoading;
  const isSeriesGraph = isDataReceived && graphType === 'series';
  const isCandleStickGraph = isDataReceived && graphType === 'candlestick';

  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  if (isSeriesGraph && isSeriesDuration(duration) && isSeriesData(data)) {
    return (
      <SeriesGraph
        className="relative my-5 h-80"
        data={data}
        duration={duration}
        onMove={onMove}
        changePercent={changePercent}
      />
    );
  }

  if (isCandleStickGraph && isCandleStickDuration(duration) && isCandlestickData(data)) {
    return (
      <CandleStickGraph
        className="relative my-5 h-80"
        data={data}
        duration={duration}
        onMove={onMove}
      />
    );
  }

  return (
    <div className="relative my-5 h-80 overflow-hidden">
      <GraphPending className="absolute inset-x-0 bottom-0" isSeries={graphType === 'series'} />
    </div>
  );
}
