import type { Time } from 'lightweight-charts';
import { json } from '@remix-run/node';

import type { LoaderFunctionArgs } from '~/types/loader';
import type { SupportedNetworks } from '~/constants';
import { NATIVE_TOKEN_ADDRESS, NATIVE_TOKEN_TO_WRAPPED } from '~/constants';
import { isSupportedNetwork } from '~/helpers/helpers';

export type GraphType = 'series' | 'candlestick';

export enum SeriesGraphDuration {
  DAY = '24H',
  WEEK = '1W',
  MONTH = '1M',
  SIX_MONTH = '6M',
  YEAR = '1Y',
  ALL = 'AllTime',
}

export enum CandlestickGraphDuration {
  THIRTY_MIN = '30m',
  HOUR = '1h',
  FOUR_HOURS = '4h',
  DAY = '24h',
  FOUR_DAYS = '4d',
}

interface Series {
  time: Time;
  value: number;
}

export type SeriesResponse = Series[];

interface Candlestick {
  close: number;
  high: number;
  low: number;
  open: number;
  time: Time;
}

export type CandlestickResponse = Candlestick[];

export type GraphResponse = SeriesResponse | CandlestickResponse;

interface SeriesMarketData {
  prices: [number, number];
}

export const SERIES_DURATIONS: SeriesGraphDuration[] = [
  SeriesGraphDuration.DAY,
  SeriesGraphDuration.WEEK,
  SeriesGraphDuration.MONTH,
  SeriesGraphDuration.YEAR,
  SeriesGraphDuration.ALL,
];

export const CANDLE_STICK_DURATIONS: CandlestickGraphDuration[] = [
  CandlestickGraphDuration.THIRTY_MIN,
  CandlestickGraphDuration.HOUR,
  CandlestickGraphDuration.FOUR_HOURS,
  CandlestickGraphDuration.DAY,
  CandlestickGraphDuration.FOUR_DAYS,
];

const SERIES_DURATION_TO_COINGECKO_TIME = {
  [SeriesGraphDuration.DAY]: '1',
  [SeriesGraphDuration.WEEK]: '7',
  [SeriesGraphDuration.MONTH]: '30',
  [SeriesGraphDuration.SIX_MONTH]: '180',
  [SeriesGraphDuration.YEAR]: '360',
  [SeriesGraphDuration.ALL]: 'max',
};

// Data up to number of days ago (1/7/14/30/90/180/365/max)
const CANDLE_DURATION_TO_COINGECKO_TIME = {
  [CandlestickGraphDuration.THIRTY_MIN]: '1',
  [CandlestickGraphDuration.HOUR]: '1',
  [CandlestickGraphDuration.FOUR_HOURS]: '7',
  [CandlestickGraphDuration.DAY]: '30',
  [CandlestickGraphDuration.FOUR_DAYS]: '180',
};

// Candle's body coingecko:
// 1 - 2 days: 30 minutes
// 3 - 30 days: 4 hours
// 31 days and beyond: 4 days
const CANDLE_RATE_MULTIPLIER = {
  [CandlestickGraphDuration.THIRTY_MIN]: 1,
  [CandlestickGraphDuration.HOUR]: 2,
  [CandlestickGraphDuration.FOUR_HOURS]: 1,
  [CandlestickGraphDuration.DAY]: 6,
  [CandlestickGraphDuration.FOUR_DAYS]: 1,
};

// Typeguards
export const isSeriesDuration = (value: string | undefined): value is SeriesGraphDuration => {
  return !!value && SERIES_DURATIONS.includes(value as SeriesGraphDuration);
};

export const isCandleStickDuration = (
  value: string | undefined
): value is CandlestickGraphDuration => {
  return !!value && CANDLE_STICK_DURATIONS.includes(value as CandlestickGraphDuration);
};

export const isCandlestickData = (
  data: CandlestickResponse | SeriesResponse
): data is CandlestickResponse => {
  const dataTmp = data as CandlestickResponse;
  return dataTmp?.length > 0 && dataTmp[0].high !== undefined;
};

export const isSeriesData = (
  data: CandlestickResponse | SeriesResponse
): data is SeriesResponse => {
  const dataTmp = data as SeriesResponse;
  return dataTmp?.length > 0 && dataTmp[0].value !== undefined;
};
//end Typeguards

// calc median price for candle in the period depends on multiplier, get last time from candle
const calcMedianPricesForPeriod = (pricesArray: number[][]): number[] =>
  pricesArray.reduce(
    // @ts-ignore
    ([_, __, prevHigh, prevLow]: number[][], [___, ____, high, low]: number[], index: number) => {
      if (index === 0) {
        return [pricesArray[pricesArray.length - 1][0], null, [high], [low], null];
      }
      if (index !== pricesArray.length - 1) {
        return [
          pricesArray[pricesArray.length - 1][0],
          null,
          [...prevHigh, high],
          [...prevLow, low],
          null,
        ];
      }

      // if last element get max or min values
      return [
        pricesArray[pricesArray.length - 1][0],
        pricesArray[0][1],
        Math.max(...prevHigh, high),
        Math.min(...prevLow, low),
        pricesArray[pricesArray.length - 1][4],
      ];
    },
    []
  );

export const loader = async ({
  params,
  context: { logger },
  request,
}: LoaderFunctionArgs): Promise<GraphResponse | Response> => {
  const { from, to, duration, chainId } = params;

  if (!chainId || (chainId && !isSupportedNetwork(chainId))) {
    return json('Does not have required param CHAIN_ID', { status: 400 });
  }

  if (!isSeriesDuration(duration) && !isCandleStickDuration(duration)) {
    return json('Does not have required param DURATION', { status: 400 });
  }

  //if native token change to wrap version
  const coingeckoIdLinks = [
    `${process.env.BACKEND_API_URL}/v1/${chainId}/coin?address=${
      from === NATIVE_TOKEN_ADDRESS ? NATIVE_TOKEN_TO_WRAPPED[chainId as SupportedNetworks] : from
    }`,
    `${process.env.BACKEND_API_URL}/v1/${chainId}/coin?address=${
      to === NATIVE_TOKEN_ADDRESS && chainId
        ? NATIVE_TOKEN_TO_WRAPPED[chainId as SupportedNetworks]
        : to
    }`,
  ];

  const currentPrice = (coingeckoTokenId: string) =>
    `https://pro-api.coingecko.com/api/v3/simple/price?ids=${coingeckoTokenId}&vs_currencies=usd&x_cg_pro_api_key=${process.env.COINGECKO_KEY}`;
  const marketDataSeries = (coingeckoTokenId: string, duration: string): string =>
    `https://pro-api.coingecko.com/api/v3/coins/${coingeckoTokenId}/market_chart?vs_currency=usd&days=${duration}&x_cg_pro_api_key=${process.env.COINGECKO_KEY}`;
  const marketDataCandle = (coingeckoTokenId: string, duration: CandlestickGraphDuration): string =>
    `https://pro-api.coingecko.com/api/v3/coins/${coingeckoTokenId}/ohlc?vs_currency=usd&days=${CANDLE_DURATION_TO_COINGECKO_TIME[duration]}&x_cg_pro_api_key=${process.env.COINGECKO_KEY}`;

  let marketGraphData = [];

  try {
    const [coingeckoIdFrom, coingeckoIdTo] = await Promise.all([
      fetch(coingeckoIdLinks[0]),
      fetch(coingeckoIdLinks[1]),
    ])
      .then(async ([responseFrom, responseTo]) => {
        const idFrom = await responseFrom.json();
        const idTo = await responseTo.json();

        if (responseFrom.status === 200 && responseTo.status === 200) {
          logger.info('', {
            response_code: responseFrom.status,
            request: coingeckoIdLinks[0],
            original_url: request.url,
          });
          logger.info('', {
            response_code: responseTo.status,
            request: coingeckoIdLinks[1],
            original_url: request.url,
          });
        }

        return [idFrom.coin_id, idTo.coin_id];
      })
      .catch((error) => {
        logger.error(`Failed to get coingecko ids. Error:${error}`, {
          response_code: 500,
          original_url: request.url,
        });
        return [null, null];
      });

    // series data
    if (isSeriesDuration(duration)) {
      const [marketDataFromResult, marketDataToResult, currentPriceFrom, currentPriceTo] =
        await Promise.all([
          fetch(marketDataSeries(coingeckoIdFrom, SERIES_DURATION_TO_COINGECKO_TIME[duration])),
          fetch(marketDataSeries(coingeckoIdTo, SERIES_DURATION_TO_COINGECKO_TIME[duration])),
          fetch(currentPrice(coingeckoIdFrom)),
          fetch(currentPrice(coingeckoIdTo)),
        ])
          .then(
            async ([
              responseFrom,
              responseTo,
              responseFromCurrentPrice,
              responseToCurrentPrice,
            ]) => {
              const marketDataFrom: SeriesMarketData = await responseFrom.json();
              const marketDataTo: SeriesMarketData = await responseTo.json();
              const currentPriceFrom = await responseFromCurrentPrice.json();
              const currentPriceTo = await responseToCurrentPrice.json();

              if (responseFrom.status === 200 && responseTo.status === 200) {
                logger.info('', {
                  response_code: responseFrom.status,
                  request: marketDataSeries(
                    coingeckoIdFrom,
                    SERIES_DURATION_TO_COINGECKO_TIME[duration]
                  ),
                  original_url: request.url,
                });
                logger.info('', {
                  response_code: responseTo.status,
                  request: marketDataSeries(coingeckoIdTo, duration),
                  original_url: request.url,
                });
              }

              let maxLength = Math.min(marketDataFrom.prices.length, marketDataTo.prices.length);

              return [
                marketDataFrom.prices.slice(-maxLength),
                marketDataTo.prices.slice(-maxLength),
                currentPriceFrom[coingeckoIdFrom].usd,
                currentPriceTo[coingeckoIdTo].usd,
              ];
            }
          )
          .catch((error) => {
            logger.error(`Failed to get marketData from Coingecko Error:${error}`, {
              response_code: 500,
              request: marketDataSeries(coingeckoIdTo, duration),
              original_url: request.url,
            });
            return [null, null];
          });

      marketGraphData = marketDataFromResult.map(
        ([fromTime, fromValue]: [number, number], index: number) => ({
          time: fromTime / 1000,
          value: fromValue / marketDataToResult[index][1],
        })
      );

      //add actual price
      marketGraphData.push({
        time: Date.now() / 1000,
        value: currentPriceFrom / currentPriceTo,
      });
      //candle stick data
    } else {
      const [marketDataFromResult, marketDataToResult] = await Promise.all([
        fetch(marketDataCandle(coingeckoIdFrom, duration)),
        fetch(marketDataCandle(coingeckoIdTo, duration)),
      ]).then(async ([responseFrom, responseTo]) => {
        const marketDataFrom = await responseFrom.json();
        const marketDataTo = await responseTo.json();

        if (responseFrom.status === 200 && responseTo.status === 200) {
          logger.info('', {
            response_code: responseFrom.status,
            request: marketDataCandle(coingeckoIdFrom, duration),
            original_url: request.url,
          });
          logger.info('', {
            response_code: responseTo.status,
            request: marketDataCandle(coingeckoIdTo, duration),
            original_url: request.url,
          });
        }

        let maxLength = Math.min(marketDataFrom.length, marketDataTo.length);

        return [marketDataFrom.slice(-maxLength), marketDataTo.slice(-maxLength)];
      });

      let mergedFrom: number[][] = [];
      let mergedTo: number[][] = [];

      // if not 1 we need to merge candles in one
      if (CANDLE_RATE_MULTIPLIER[duration] !== 1) {
        for (let i = 0; i < marketDataFromResult.length; i += CANDLE_RATE_MULTIPLIER[duration]) {
          const currentPartFrom = marketDataFromResult.slice(
            i,
            i + CANDLE_RATE_MULTIPLIER[duration]
          );
          const currentPartTo = marketDataToResult.slice(i, i + CANDLE_RATE_MULTIPLIER[duration]);

          const medianPricesFrom = calcMedianPricesForPeriod(currentPartFrom);
          const medianPriceTo = calcMedianPricesForPeriod(currentPartTo);

          mergedFrom.push(medianPricesFrom);
          mergedTo.push(medianPriceTo);
        }
      } else {
        mergedFrom = marketDataFromResult;
        mergedTo = marketDataToResult;
      }

      marketGraphData = mergedFrom
        .filter((data) => data.every((value) => value !== null))
        .map(([time, open, high, low, close]: number[], index: number) => ({
          time: time / 1000,
          open: open / mergedTo[index][1],
          close: close / mergedTo[index][2],
          low: low / mergedTo[index][3],
          high: high / mergedTo[index][4],
        }));
    }
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      original_url: request.url,
    });
  }

  return marketGraphData;
};
