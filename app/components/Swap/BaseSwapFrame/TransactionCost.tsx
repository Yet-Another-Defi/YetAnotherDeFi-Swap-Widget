import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { ethers } from 'ethers';
import clsx from 'clsx';

import { useRootStore } from '~/store/rootStore';
import { formatNumber } from '~/helpers/helpers';
import { NETWORKS } from '~/constants';

export const TransactionCost: React.FC = observer(() => {
  const { appStore, swapStore } = useRootStore();

  useEffect(() => {
    if (!swapStore || appStore.routes.length === 0) {
      return;
    }
    swapStore.estimateGas();
  }, [swapStore, swapStore?.isApproved, appStore.routes]);

  const nativeTokenName = NETWORKS.find((network) => network.id === appStore.chainId)?.nativeToken;

  return (
    <div className="flex items-center justify-between mb-1">
      <div className={clsx('text-sm text-black/40', 'dark:text-white/40')}>Transaction cost</div>
      {!appStore.isSwapParamsLoading && (
        <div className="flex">
          <div className="text-sm text-black/40 dark:text-white/40">
            ~$
            {appStore.fromValueBig.isZero() || !swapStore?.transactionPrice
              ? '0'
              : formatNumber(swapStore?.transactionPrice)}
          </div>
          <span className={clsx('ml-2.5 text-sm text-black/80', 'dark:text-white/40')}>
            {appStore.fromValueBig.isZero() || !swapStore?.transactionNativeTokenPrice
              ? '0'
              : formatNumber(ethers.utils.formatEther(swapStore.transactionNativeTokenPrice))}{' '}
            {nativeTokenName}
          </span>
        </div>
      )}
    </div>
  );
});
