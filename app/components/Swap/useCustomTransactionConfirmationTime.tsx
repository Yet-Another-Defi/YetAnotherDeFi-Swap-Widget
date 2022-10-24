import { useMemo } from 'react';
import { useRootStore } from '~/store/rootStore';
import {
  type TransactionConfirmationTimes,
  SupportedNetworks,
  CUSTOM_TRANSACTION_CONFIRMATION_TIMES,
} from '~/constants';

type ReturnTimeType = [string, string];

function getTransactionConfirmationTimeByCustomValue({
  gasCustomValue,
  reducedGasPrices: { FAST, MEDIUM, LOW },
  chainId,
}: {
  gasCustomValue?: number;
  reducedGasPrices: TransactionConfirmationTimes;
  chainId: SupportedNetworks;
}): ReturnTimeType {
  let time = '';
  let error = '';

  const times = CUSTOM_TRANSACTION_CONFIRMATION_TIMES?.[chainId];

  if (!gasCustomValue || !FAST || !MEDIUM || !LOW || !times) {
    return [time, error];
  }

  const value = +gasCustomValue;

  if (value >= FAST) {
    time = times.fastest;
  }

  if (value >= MEDIUM && value < FAST) {
    time = times.betweenMediumAndFast;
  }

  if (value < MEDIUM && value >= LOW) {
    time = times.betweenLowAndMedium;
  }

  if (value < LOW) {
    time = times.slowest;
  }

  if (chainId === SupportedNetworks.Ethereum && value < LOW - 1) {
    time = '';
    error = 'Gas is too low';
  }

  return [time, error];
}

export function useCustomTransactionConfirmationTime() {
  const {
    appStore: { chainId },
    settingsStore: { gasPrices, gasCustomValue },
  } = useRootStore();

  const reducedGasPrices = useMemo(
    () => gasPrices.reduce((acc, price) => ({ ...acc, [price.type]: price.value }), {}),
    [gasPrices]
  );

  return getTransactionConfirmationTimeByCustomValue({ gasCustomValue, reducedGasPrices, chainId });
}
