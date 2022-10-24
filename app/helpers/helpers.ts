import type { RpcError } from 'wagmi';
import { DEFAULT_TOKEN_PAIRS, GasPriceType, SupportedNetworks } from '~/constants';

export const isServer = typeof window === 'undefined';

export const openNewWindow = (url: string): void => {
  window.open(url, '_blank', 'noopener');
};

export const compactAddress = (val: string, count = 4): string => {
  return val.slice(0, count + 2) + '...' + val.slice(-count);
};

export const truncateDecimals = (val: string, decimals: number) => {
  const index = val.search(/\.|,/gi);

  if (index === -1) {
    return val;
  }

  if (decimals === 0) {
    return val.split('.')[0];
  }

  return val.slice(0, index + decimals + 1);
};

export const countDecimals = (val: string, digits = 5): number => {
  if (isNaN(Number(val))) {
    throw new Error(`It is not a number ${val}`);
  }

  const [intPart, floatPart] = val.split('.');

  const floatAllZeros = floatPart?.split('').every((elem) => elem === '0');

  if (!floatPart?.length || floatAllZeros) {
    return 0;
  }

  let decimals;

  if (intPart === '0') {
    decimals = floatPart.length > digits ? digits : floatPart.length;

    // e.g. 0.000000000321
    const isAllZeros = [...Array(decimals).keys()].every(
      (elemIndex) => floatPart[elemIndex] === '0'
    );

    if (isAllZeros) {
      const indexFirstNumber = [...floatPart].findIndex((number) => number !== '0');

      //get two meaningful numbers
      decimals = indexFirstNumber >= digits ? indexFirstNumber + 2 : 0;
    }
  } else {
    decimals = digits - intPart.length;
  }

  // cut extra zeros in the end
  if (decimals > 0) {
    const endZeros = floatPart.slice(0, decimals).match(/0+$/);
    let cuttedZeros = 0;

    if (endZeros && endZeros[0].length > 0) {
      cuttedZeros = endZeros[0].length;
    }

    return decimals - cuttedZeros;
  }

  return 0;
};

export const formatNumber = (val: string | number, digits = 5, thousandsSeparator = ' ') => {
  if (isNaN(Number(val))) {
    throw new Error(`It is not a number ${val}`);
  }

  const value = String(val);

  const [intPart, floatPart] = value.split('.');

  let formattedIntPart = intPart;

  // separate integer part with thousands separator
  if (thousandsSeparator !== '' && intPart !== '0') {
    formattedIntPart = intPart
      .split('')
      .reverse()
      .reduce((acc, cur, index, arr) => {
        const isThirdElem = (index + 1) % 3 === 0;
        const isLastElem = index === arr.length - 1;

        if (isThirdElem && !isLastElem) {
          return [...acc, cur, thousandsSeparator];
        }
        return [...acc, cur];
      }, [] as string[])
      .reverse()
      .join('');
  }

  //there is no float part, return integer
  if (!floatPart?.length) {
    return formattedIntPart;
  }

  // cut float part with digits and remove extra zeros
  const cuttedFloatPart = floatPart.slice(0, countDecimals(String(value), digits));

  return `${formattedIntPart}${cuttedFloatPart.length > 0 ? '.' + cuttedFloatPart : ''}`;
};

export const isUpperCase = (str: string) => str === str.toUpperCase();

export const replaceChainIdUrl = (chainId: SupportedNetworks) => {
  return `/${chainId}/exchange/${DEFAULT_TOKEN_PAIRS[chainId][0]}/${DEFAULT_TOKEN_PAIRS[chainId][1]}`;
};

export function isSupportedNetwork(chainId: string): chainId is SupportedNetworks {
  return Object.values(SupportedNetworks).includes(chainId as SupportedNetworks);
}

export function isNetworkWithConstantGasPrice(chainId: SupportedNetworks) {
  return chainId === SupportedNetworks.Avalanche || chainId === SupportedNetworks.Optimism;
}

export function firstLetterToUppercase(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function replaceUnderscore(str: string) {
  if (str) {
    return str.replace('_', ' ');
  }
}

export function checkGasPriceType(type: string): GasPriceType {
  if (type in GasPriceType) {
    return type as GasPriceType;
  }
  return GasPriceType.FAST;
}

export function isRpcError(error?: Error | RpcError | null): error is RpcError {
  return (error as RpcError)?.code !== undefined;
}
