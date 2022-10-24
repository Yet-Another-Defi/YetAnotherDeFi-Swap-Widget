import type { BarData, LineData, PriceFormat } from 'lightweight-charts';
import { formatNumber } from '~/helpers/helpers';
import { isCandlestickData, isSeriesData } from '~/routes/api/graph.$chainId.$from.$to.$duration';

const PRICE_STEPS_COUNT = 6;

const minStep = (number: number): number => {
  const string = number.toString();
  let result;

  if (number < 1) {
    let [_, a] = number
      .toFixed(20)
      .matchAll(/^(0.0*)(\d)\d*/gi)
      .next().value;
    result = a + '1';
  } else {
    let [_, __, b] = string.matchAll(/^(\d)(\d*)(.?\d*)/gi).next().value;
    result = 1 + b.replace(/\d/gi, 0);
  }
  return parseFloat(result);
};

const formatter = (number: number): string => {
  let string = number.toFixed(20);
  let result = string;

  if (number >= 1) {
    let [_, a, b] = string.matchAll(/(^\d*)(\.?[1-9]?)/gi).next().value;
    result = a ? a + (b?.length > 1 ? b : '') : string;
  } else if (number !== 0) {
    let value = string.matchAll(/^(0\.0*[1-9]+)/gi).next().value;

    result = value?.[0] || '0';
  } else {
    return '0';
  }

  return formatNumber(result);
};

export const getPriceFormatter = (data: LineData[] | BarData[]): PriceFormat => {
  let max = 0;
  let min = 0;

  if (isSeriesData(data)) {
    max = Math.max(...data.map((item) => Number(item.value)));
    min = Math.min(...data.map((item) => Number(item.value)));
  } else if (isCandlestickData(data)) {
    max = Math.max(...data.map((item) => Number(item.open)));
    min = Math.min(...data.map((item) => Number(item.open)));
  }

  return {
    type: 'custom',
    formatter,
    minMove: minStep((max - min) / PRICE_STEPS_COUNT),
  };
};
