import { useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { observer } from 'mobx-react';
import { now } from 'mobx-utils';
import { throttle } from 'lodash';
import type { MouseEventParams } from 'lightweight-charts';

import { GraphData } from '~/components/Chart/GraphData';
import type { GraphResponse, GraphType } from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { isCandlestickData, isSeriesData } from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { CandlestickGraphDuration } from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { SeriesGraphDuration } from '~/routes/api/graph.$chainId.$from.$to.$duration';
import { useRootStore } from '~/store/rootStore';
import { Durations } from '~/components/Chart/Durations';
import { Graph } from './Graph';
import { TokensPair } from './TokensPair';

interface Props {
  className?: string;
}

export const Chart: React.FC<Props> = observer(({ className }) => {
  const fetcher = useFetcher<GraphResponse>();
  const ref = useRef<HTMLDivElement>(null);
  const {
    appStore: { chainId, from, to, toggleDirection },
  } = useRootStore();

  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [graphType, setGraphType] = useState<GraphType>('series');
  const [duration, setDuration] = useState<SeriesGraphDuration | CandlestickGraphDuration>(
    graphType === 'series' ? SeriesGraphDuration.MONTH : CandlestickGraphDuration.HOUR
  );

  const graphData = fetcher.data;

  const toggleDirectionThrottled = useMemo(() => throttle(toggleDirection, 300), [toggleDirection]);

  const onMoveThrottled = useMemo(
    () =>
      throttle((e: MouseEventParams) => {
        if (e.seriesPrices.size > 0) {
          //open = bar, value = series
          setCurrentPrice(
            e.seriesPrices.values().next().value.open
              ? e.seriesPrices.values().next().value.open
              : e.seriesPrices.values().next().value
          );
          return;
        }
        setCurrentPrice(0);
      }, 100),
    []
  );

  useEffect(() => {
    if (from && to) {
      fetcher.load(`/api/graph/${chainId}/${from.address}/${to.address}/${duration}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, from, to, graphType, chainId, now(60000)]);

  const changePercent = useMemo<number | undefined>(() => {
    if (graphData && graphData?.length > 1 && isSeriesData(graphData)) {
      return 100 - (graphData[0].value * 100) / graphData[graphData.length - 1].value;
    } else if (graphData && graphData?.length > 1 && isCandlestickData(graphData)) {
      return 100 - (graphData[0].open * 100) / graphData[graphData.length - 1].open;
    }
  }, [graphData]);

  return (
    <div ref={ref} className={className}>
      <h5 className="text-[26px] leading-8">Exchange Rates</h5>
      {from && to && (
        <TokensPair
          from={from}
          to={to}
          toggleDirection={toggleDirectionThrottled}
          chainId={chainId}
        />
      )}
      <GraphData
        data={graphData}
        duration={duration}
        currentPrice={currentPrice}
        changeDuration={setDuration}
        changePercent={changePercent}
        graphType={graphType}
        setGraphType={setGraphType}
        isLoading={fetcher.state === 'loading'}
      />
      <Graph
        changePercent={changePercent}
        graphType={graphType}
        onMove={onMoveThrottled}
        duration={duration}
        isLoading={fetcher.state === 'loading'}
        data={graphData}
      />
      <div className="text-center">
        <Durations
          className="mt-10 inline-flex lg:hidden"
          duration={duration}
          changeDuration={setDuration}
          graphType={graphType}
        />
      </div>
    </div>
  );
});
