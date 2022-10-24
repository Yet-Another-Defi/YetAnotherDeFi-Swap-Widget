import clsx from 'clsx';
import { memo } from 'react';
import {
  TRANSACTION_CONFIRMATION_TIMES,
  TRANSACTION_UNIT_NETWORKS,
  SupportedNetworks,
} from '~/constants';
import { firstLetterToUppercase, checkGasPriceType } from '~/helpers/helpers';
import type { SettingItem } from '~/store/SwapStore';

interface Props {
  gasPriceItem: SettingItem;
  chainId: SupportedNetworks;
  isActive: boolean;
  isConstantGasPrice: boolean;
}

export const GasPriceSelectBarElement = memo(
  ({ gasPriceItem, chainId, isConstantGasPrice, isActive }: Props) => {
    const time = TRANSACTION_CONFIRMATION_TIMES[chainId][checkGasPriceType(gasPriceItem?.type)];

    const gasPriceType = isConstantGasPrice ? 'Gas Price' : gasPriceItem.type;

    const isChainWithStableTime = chainId === SupportedNetworks.Optimism;

    return (
      <>
        <div className="text-sm">{firstLetterToUppercase(gasPriceType)}</div>
        <div className="flex items-center">
          {!isChainWithStableTime && (
            <div
              className={clsx(
                'text-xs text-gray mr-2',
                'dark:text-graySecondary',
                isActive && 'dark:!text-[#953200]'
              )}
            >
              ~ {time} sec
            </div>
          )}
          <div className="text-sm text-right w-[75px]">{`${gasPriceItem.value}\u00A0${TRANSACTION_UNIT_NETWORKS[chainId]}`}</div>
        </div>
      </>
    );
  }
);

GasPriceSelectBarElement.displayName = 'GasPriceSelectBarElement';
