import { useMemo } from 'react';
import { NumericFormat } from 'react-number-format';
import type { NumberFormatValues, SourceInfo } from 'react-number-format/types/types';
import { observer } from 'mobx-react';
import { useAccount } from 'wagmi';
import clsx from 'clsx';

import type { Token } from '~/objects/tokens';
import { ArrowIcon } from '~/components/Icon/ArrowIcon';
import { Skeleton } from '../../Skeleton';
import { Tooltip } from '../../Tooltip';
import { formatNumber } from '~/helpers/helpers';
import { useWindowSize } from '~/hooks';
import { useUiSettings } from '~/UiProvider';
import { NATIVE_TOKEN_ADDRESS, ScreenSize } from '~/constants';
import { TokenImageWithFallback } from '~/components/TokenImageWithFallback';
import { MaxAmountTooltip } from './MaxAmountTooltip';

interface Props {
  className?: string;
  title: string;
  token: Token | null;
  value: string;
  decimals?: number;
  rate?: string;
  tokenBalance?: {
    balance: string;
    nativeTokenBalanceWithoutTxFee?: string;
  };
  tokenPriceUSD: string;
  best?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onChange?: (values: NumberFormatValues, sourceInfo: SourceInfo) => void;
  openSelectToken: () => void;
  setMaxAmountFrom?: (value: string) => void;
}

export const CurrencySelect: React.FC<Props> = observer(
  ({
    title,
    token,
    decimals,
    rate,
    tokenBalance,
    tokenPriceUSD,
    value,
    best,
    isLoading,
    disabled,
    className,
    onChange,
    openSelectToken,
    setMaxAmountFrom,
  }) => {
    const { isLightTheme } = useUiSettings();

    const { isConnected } = useAccount();

    const maxAmountFrom = useMemo(() => {
      if (tokenBalance?.balance) {
        return tokenBalance.nativeTokenBalanceWithoutTxFee
          ? tokenBalance.nativeTokenBalanceWithoutTxFee.replace(/ /g, '')
          : tokenBalance.balance.replace(/ /g, '');
      }
      return '0';
    }, [tokenBalance]);

    const onSetMaxAmount = () => {
      if (setMaxAmountFrom && tokenBalance?.balance) {
        setMaxAmountFrom(maxAmountFrom);
      }
    };

    const { width } = useWindowSize();

    const isMobile = width < ScreenSize.md;

    const isNativeToken = token?.address === NATIVE_TOKEN_ADDRESS;

    const isSetMaxAmountFrom =
      isConnected && tokenBalance && parseFloat(tokenBalance.balance) > 0 && setMaxAmountFrom;

    const isNativeBalanceWithoutFeePositive =
      tokenBalance?.nativeTokenBalanceWithoutTxFee &&
      +tokenBalance.nativeTokenBalanceWithoutTxFee > 0;

    return (
      <div className={className}>
        <div className="mb-2 -mt-7 flex h-6 w-full items-center justify-between">
          <div className={clsx('text-sm text-black/40', 'dark:text-white/40')}>{title}</div>
          {isSetMaxAmountFrom && (
            <div className="flex items-center">
              <span className={clsx('mr-2.5 text-sm text-black/40', 'dark:text-white/50')}>
                Balance: {tokenBalance.balance}
              </span>

              <Tooltip
                position={isMobile ? 'left' : 'right'}
                arrowPosition={isMobile ? 'center' : 'right'}
                appearanceDelay={0.4}
                themeColor={isLightTheme ? 'white' : 'black'}
                disabled={!isNativeToken}
                content={
                  <MaxAmountTooltip
                    amount={maxAmountFrom}
                    token={token}
                    isNativeBalanceWithoutFeePositive={!!isNativeBalanceWithoutFeePositive}
                  />
                }
              >
                <button
                  className={clsx('text-sm text-black', 'dark:text-white')}
                  onClick={onSetMaxAmount}
                >
                  MAX
                </button>
              </Tooltip>
            </div>
          )}
        </div>
        <div
          className={clsx(
            'relative rounded-2xl border border-black/5 bg-white px-4 py-2.5 shadow',
            'dark:bg-black dark:border-lightBlack'
          )}
        >
          <div className={'mb-2.5 flex items-center justify-between'}>
            <button
              className={clsx(
                'flex cursor-pointer items-center rounded-full py-0.5 pl-0.5 pr-3 transition-colors duration-200',
                'hover:bg-lightGray/80 active:bg-lightGray/80',
                'dark:hover:bg-lightBlack darl:active:bg-lightBlack'
              )}
              onClick={openSelectToken}
            >
              <TokenImageWithFallback token={token} className="mr-2" />
              <span
                className={clsx(
                  'max-w-[100px] overflow-hidden overflow-ellipsis whitespace-nowrap text-black',
                  'dark:text-white'
                )}
              >
                {token?.symbol}
              </span>
              <ArrowIcon className={clsx('ml-2 w-3 text-black', 'dark:text-white')} />
            </button>
            <h2
              className={clsx(
                'ml-2 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-sm text-black/50',
                'dark:text-white/50'
              )}
            >
              {token?.name}
            </h2>
          </div>
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              <div
                className={clsx(
                  'mb-2.5 h-4 text-xs font-light text-[#264168]/40',
                  'dark:text-white/30'
                )}
              >
                {!!rate && rate}
                {tokenPriceUSD !== undefined && `~ $${formatNumber(tokenPriceUSD)}`}
              </div>
              <div className="flex items-center justify-between">
                <NumericFormat
                  onValueChange={(values, sourceInfo) => {
                    onChange?.(values, sourceInfo);
                  }}
                  className={clsx(
                    'relative w-full text-xl text-black outline-none font-normal disabled:bg-transparent disabled:opacity-100',
                    'dark:text-white dark:bg-black'
                  )}
                  value={value}
                  maxLength={18}
                  decimalSeparator="."
                  displayType="input"
                  type="text"
                  decimalScale={decimals}
                  thousandSeparator={' '}
                  allowLeadingZeros={false}
                  allowNegative={false}
                  disabled={disabled}
                  isAllowed={(values) => !/^\.\d+$/.test(values.value)}
                />
              </div>
            </>
          )}
          {best && (
            <div className="absolute -top-2 -right-1 rounded bg-actionBlue px-2 py-0.5 text-xs text-white">
              Best
            </div>
          )}
        </div>
      </div>
    );
  }
);
