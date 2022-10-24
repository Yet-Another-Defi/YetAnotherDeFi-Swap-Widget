import React, { useMemo, useCallback } from 'react';
import { throttle } from 'lodash';
import { Link } from '@remix-run/react';
import { observer } from 'mobx-react';
import type { NumberFormatValues, SourceInfo } from 'react-number-format/types/types';

import { SwapButton } from './SwapButton';
import { CurrencySelect } from './CurrencySelect';
import { SwitchIcon } from '~/components/Icon/SwitchIcon';
import { countDecimals } from '~/helpers/helpers';
import { useRootStore } from '~/store/rootStore';
import { calcTotalTokenPrice } from './helper';
import clsx from 'clsx';

interface Props {
  openSelectToken: (isFromToken: boolean) => void;
  tokenFromPriceUSD: string;
  tokenToPriceUSD: string;
  tokenBalance: {
    balance: string;
    nativeTokenBalanceWithoutTxFee?: string;
  };
  isLoadingSwapParams: boolean;
  validNetwork: boolean;
}

export const OpposedTokens: React.FC<Props> = observer(
  ({
    openSelectToken,
    tokenFromPriceUSD,
    tokenToPriceUSD,
    tokenBalance,
    isLoadingSwapParams,
    validNetwork,
  }) => {
    const { appStore } = useRootStore();

    const { from, to, fromValue, toValue, toggleDirection, setFromValueLocked } = appStore;

    const onChangeFrom = useCallback(
      (values: NumberFormatValues, sourceInfo: SourceInfo) => {
        appStore.setFromValue(String(values.value ?? '0'));

        if (sourceInfo.source === 'event') {
          setFromValueLocked(String(values.value) ?? '0');
        }
      },
      [appStore, setFromValueLocked]
    );

    const toggleDirectionThrottled = useMemo(
      () => throttle(toggleDirection, 300),
      [toggleDirection]
    );

    const tokenFromTotalPriceUSD = useMemo(() => {
      return calcTotalTokenPrice({
        token: from,
        tokenPriceUSD: tokenFromPriceUSD,
        nativeTokenPriceUSD: appStore.nativeTokenPrice,
        tokenValue: fromValue,
      });
    }, [appStore.nativeTokenPrice, from, fromValue, tokenFromPriceUSD]);

    const tokenToTotalPriceUSD = useMemo(() => {
      return +fromValue > 0
        ? calcTotalTokenPrice({
            token: to,
            tokenPriceUSD: tokenToPriceUSD,
            nativeTokenPriceUSD: appStore.nativeTokenPrice,
            tokenValue: toValue,
          })
        : '0';
    }, [appStore.nativeTokenPrice, fromValue, to, toValue, tokenToPriceUSD]);

    return (
      <>
        <CurrencySelect
          title="Pay"
          token={from}
          value={fromValue}
          decimals={(from?.decimals ?? 0) < 10 ? from?.decimals : 10}
          onChange={onChangeFrom}
          tokenBalance={tokenBalance}
          openSelectToken={() => {
            openSelectToken(true);
          }}
          setMaxAmountFrom={appStore.setFromValue}
          tokenPriceUSD={tokenFromTotalPriceUSD}
        />
        <div className="my-2 flex justify-center">
          <Link
            onClick={toggleDirectionThrottled}
            className="group relative rounded-full p-2"
            to={`/${appStore.chainId}/exchange/${to?.symbol}/${from?.symbol}`}
          >
            <SwitchIcon
              className={clsx(
                'h-[14px] w-[14px] transition-transform duration-300 group-hover:rotate-[-180deg] text-black',
                'dark:text-white'
              )}
            />
          </Link>
        </div>
        <CurrencySelect
          title="Receive"
          token={to}
          value={parseFloat(fromValue) === 0 ? '0' : toValue}
          decimals={countDecimals(toValue)}
          isLoading={isLoadingSwapParams}
          tokenPriceUSD={tokenToTotalPriceUSD}
          openSelectToken={() => {
            openSelectToken(false);
          }}
          disabled
        />
        <div className="mt-7 mb-5">
          <SwapButton validNetwork={validNetwork} />
        </div>
      </>
    );
  }
);
