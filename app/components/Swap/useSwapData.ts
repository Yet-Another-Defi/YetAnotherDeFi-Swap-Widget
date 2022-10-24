import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { BigNumber, ethers } from 'ethers';
import { now } from 'mobx-utils';

import type { RatesResponse } from '~/routes/api/rates.$chainId.$tokenFromAddress.$tokenToAddress';
import type { RoutesResponse } from '~/routes/api/route.$chainId.$from.$to';
import { useRootStore } from '~/store/rootStore';
import type { SwapStore } from '~/store/SwapStore';
import {
  calculateGasLimit,
  getRate,
  getTokenValueBigInt,
  getTokenValueStr,
} from '~/helpers/exchange.helpers';
import { formatNumber } from '~/helpers/helpers';
import type { GasPricesResponse } from '~/routes/api/gasprices.$chainId';
import { NATIVE_TOKEN_ADDRESS } from '~/constants';

export interface SwapDataResult {
  tokenBalance: {
    balance: string;
    nativeTokenBalanceWithoutTxFee?: string;
  };
  rate: string;
  tokenFromPriceUSD: string;
  tokenToPriceUSD: string;
  isLoadingSwapParams: boolean;
}

export function useSwapData(swapStore: SwapStore | null): SwapDataResult {
  const rs = useRootStore();
  const { appStore, settingsStore, web3Store } = rs;
  const { from, to, fromValue, toValue, fromValueBig } = appStore;
  const { validSlippage, gasPrice } = settingsStore;

  const ratesFetcher = useFetcher<RatesResponse>();
  const swapParamsFetcher = useFetcher<RoutesResponse>();
  const gasPricesFetcher = useFetcher<GasPricesResponse>();

  const [tokenFromPriceUSD, setTokenFromPriceUSD] = useState(0);
  const [tokenToPriceUSD, setTokenToPriceUSD] = useState(0);

  useEffect(() => {
    const isCanRefetchRates =
      from &&
      to &&
      from?.address &&
      to?.address &&
      +from?.chainId === +appStore.chainId &&
      +to?.chainId === +appStore.chainId;

    if (isCanRefetchRates) {
      ratesFetcher.load(`/api/rates/${appStore.chainId}/${from?.address}/${to?.address}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now(30000), from, to, appStore.chainId]);

  useEffect(() => {
    gasPricesFetcher.load(`/api/gasprices/${appStore.chainId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now(3000), appStore.chainId]);

  useEffect(() => {
    const isCanRefetchRoute =
      from &&
      to &&
      +from?.chainId === +appStore.chainId &&
      +to?.chainId === +appStore.chainId &&
      validSlippage.value &&
      gasPrice.value > 0;

    if (isCanRefetchRoute) {
      appStore.setIsSwapParamsLoading(true);
      const fromValueNotNull = fromValueBig.isZero()
        ? getTokenValueBigInt(from, '1')
        : fromValueBig;
      const gasPriceWei = ethers.utils.parseUnits(`${gasPrice.value}`, 'gwei').toString();

      swapParamsFetcher.load(
        `/api/route/${appStore.chainId}/${from.address}/${to.address}?amount=${fromValueNotNull}&slippage=${validSlippage.value}&gasPrice=${gasPriceWei}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, fromValueBig, validSlippage, gasPrice, appStore.chainId]);

  useEffect(() => {
    if (ratesFetcher.data) {
      appStore.setNativeTokenPrice(ratesFetcher.data.nativeTokenPriceUSD);
      setTokenFromPriceUSD(ratesFetcher.data.tokenFromPriceUSD);
      setTokenToPriceUSD(ratesFetcher.data.tokenToPriceUSD);
    }
  }, [ratesFetcher.data, appStore, settingsStore]);

  useEffect(() => {
    if (gasPricesFetcher.data) {
      settingsStore.setGasPrices(gasPricesFetcher.data.gasPrices);
    }
  }, [gasPricesFetcher.data, settingsStore]);

  useEffect(() => {
    if (swapParamsFetcher.data) {
      appStore.setSwapParams(swapParamsFetcher.data);
      appStore.setIsSwapParamsLoading(false);
    }
  }, [swapParamsFetcher.data, appStore]);

  const rate = useMemo(() => {
    if (from && to) {
      const rate = getRate({
        from,
        to,
        fromValue: fromValueBig.isZero() ? '1' : fromValue,
        toValue,
      });

      return rate;
    }

    return 0;
  }, [from, to, fromValueBig, fromValue, toValue]);

  const [balance, nativeTokenBalanceWithoutTxFee] = useMemo(() => {
    if (from && swapStore?.tokenBalance && from.address !== NATIVE_TOKEN_ADDRESS) {
      const tokenBalanceStr = getTokenValueStr(from, swapStore.tokenBalance);
      return [formatNumber(tokenBalanceStr)];
    }

    if (
      from &&
      from.address == NATIVE_TOKEN_ADDRESS &&
      swapStore?.transactionNativeTokenPrice &&
      web3Store.accountBalance
    ) {
      const nativeTokenBalance = web3Store.accountBalance;
      const strNativeTokenBalance = getTokenValueStr(from, nativeTokenBalance);
      const balanceWithoutTxCost = nativeTokenBalance.sub(
        calculateGasLimit(swapStore.transactionNativeTokenPrice)
      );

      const txCostLargerThanBalance = balanceWithoutTxCost.gt(BigNumber.from('0'));

      return [
        formatNumber(strNativeTokenBalance),
        txCostLargerThanBalance ? getTokenValueStr(from, balanceWithoutTxCost) : '0',
      ];
    }

    return ['0'];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    from,
    swapStore?.tokenBalance,
    swapStore?.transactionNativeTokenPrice,
    web3Store.accountBalance,
    appStore.chainId,
  ]);

  return {
    tokenBalance: {
      nativeTokenBalanceWithoutTxFee,
      balance,
    },
    rate: rate.toFixed(15),
    tokenFromPriceUSD: tokenFromPriceUSD.toFixed(15),
    tokenToPriceUSD: tokenToPriceUSD.toFixed(15),
    isLoadingSwapParams: swapParamsFetcher.state === 'loading',
  };
}
