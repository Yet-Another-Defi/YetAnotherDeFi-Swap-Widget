import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import type { SettingItem } from '~/store/SwapStore';
import { CloseIcon } from '~/components/Icon/CloseIcon';
import { SelectBar } from '~/components/SelectBar';
import { VerticalSelectBar } from '~/components/VerticalSelectBar';
import { useRootStore } from '~/store/rootStore';
import { STORAGE_KEYS, useLocalStorage } from '~/hooks/useLocalStorage';
import { DEFAULT_GAS_PRICE, DEFAULT_SLIPPAGE, MAX_SLIPPAGE_VALUE } from '~/store/SettingsStore';
import { GasPriceType, SLIPPAGES, TRANSACTION_UNIT_NETWORKS, NETWORKS } from '~/constants';
import { Button } from '../Button';
import { ControlTitle } from './ControlTitle';
import { useCustomTransactionConfirmationTime } from './useCustomTransactionConfirmationTime';
import { isNetworkWithConstantGasPrice } from '~/helpers/helpers';
import { GasPriceSelectBarElement } from './GasPriceSelectBarElement';

interface Props {
  onClose: () => void;
}

const SLIPPAGE_TOOLTIP =
  'During the processing of a transaction, the exchange rate may change. If the price changes by more than this percentage, the transaction will revert';
const getGasTooltip = (chainId: string) => {
  let chainName = NETWORKS.find((network) => network.id === chainId)?.name;

  return `Gas is the fuel that allows the ${chainName} network to operate. The higher the gas price, the faster the transaction will be completed, but the more ether you will have to pay`;
};

export const SwapSettings: React.FC<Props> = observer(({ onClose }) => {
  const {
    settingsStore,
    appStore: { chainId },
  } = useRootStore();

  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS);

  const [customTransactionConfirmationTime, customTransactionConfirmationTimeError] =
    useCustomTransactionConfirmationTime();

  const isConstantGasPrice = isNetworkWithConstantGasPrice(chainId);

  const close = useCallback(() => {
    onClose();
    settingsStore.checkValues();
  }, [onClose, settingsStore]);

  const isActiveSlippage = useCallback(
    (slippage: SettingItem): boolean => settingsStore.slippage.type === slippage.type,
    [settingsStore.slippage]
  );

  const isActiveGasPrice = useCallback(
    (gasPrice: SettingItem): boolean => settingsStore.gasPrice.type === gasPrice.type,
    [settingsStore.gasPrice.type]
  );

  const onCloseClick = () => {
    close();

    const isCustomValueNotValid =
      settingsStore.gasPrice.type === GasPriceType.CUSTOM &&
      (!settingsStore.gasCustomValue || customTransactionConfirmationTimeError);

    if (isCustomValueNotValid) {
      settingsStore.resetGasPrice();
    }

    if (!settingsStore.validSlippage.value) {
      settingsStore.resetSlippage();
    }
  };

  useEffect(() => {
    setSettings({
      ...(settings && JSON.parse(settings)),
      [chainId]: {
        gas: {
          selected: settingsStore.gasPrice.type,
          custom: settingsStore.gasCustomValue,
        },
        slippage: {
          selected: settingsStore.slippage.type,
          custom: settingsStore.slippageCustomValue,
        },
      },
    });
  }, [
    settingsStore.slippageCustomValue,
    settingsStore.gasCustomValue,
    settingsStore.gasPrice,
    settingsStore.validSlippage,
    settings,
    setSettings,
    settingsStore.slippage,
    chainId,
  ]);

  const isDisabledResetBtn =
    settingsStore.gasPrice.type === DEFAULT_GAS_PRICE.type &&
    settingsStore.slippage.type === DEFAULT_SLIPPAGE.type;

  const customGasPriceError =
    settingsStore.gasPrice.type === GasPriceType.CUSTOM && customTransactionConfirmationTimeError;

  return (
    <motion.div
      className={clsx(
        'absolute inset-0 z-[1] flex flex-col rounded-2.5xl bg-white px-6 py-7',
        'dark:bg-dark'
      )}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-baseline">
          <h5 className="text-[26px] leading-8">Settings</h5>
        </div>
        <button
          className="group -mr-2 cursor-pointer p-2 transition-colors duration-200"
          onClick={onCloseClick}
          data-testid="btn-close-settings"
        >
          <CloseIcon
            className={clsx(
              'h-4 w-4 transition-transform duration-300 group-hover:rotate-[-90deg] text-black',
              'dark:text-white'
            )}
          />
        </button>
      </div>
      <div className="mt-5" id="slippage">
        <div className="flex items-baseline justify-between">
          <ControlTitle tooltipText={SLIPPAGE_TOOLTIP} position="right">
            Slippage tolerance
          </ControlTitle>
          {settingsStore.slippage.value > MAX_SLIPPAGE_VALUE && (
            <div className="text-xs font-light text-[#BC3348] opacity-80">
              Max {MAX_SLIPPAGE_VALUE}%
            </div>
          )}
        </div>
        <SelectBar
          onBlur={settingsStore.setValidSlippage}
          onChange={settingsStore.setSlippage}
          checkIsActive={isActiveSlippage}
          list={SLIPPAGES}
          renderItem={(item: SettingItem) => (
            <div className="text-xs font-medium">{`${item.value}%`}</div>
          )}
          customValue={settingsStore.slippageCustomValue}
          formatCustomValue={(value) => ({
            type: 'custom',
            value: value ? value : 0,
          })}
          suffix="%"
          max={100}
          decimals={1}
        />
      </div>
      <div className="mt-5" id="gasPrice">
        <ControlTitle tooltipText={getGasTooltip(chainId)} position="right">
          Gas Price
        </ControlTitle>
        <VerticalSelectBar
          list={settingsStore.gasPrices}
          onChange={settingsStore.setGasPrice}
          checkIsActive={isActiveGasPrice}
          renderItem={(item, isActive) => (
            <GasPriceSelectBarElement
              gasPriceItem={item}
              chainId={chainId}
              isActive={isActive}
              isConstantGasPrice={isConstantGasPrice}
            />
          )}
          formatCustomValue={(value) => ({
            type: GasPriceType.CUSTOM,
            value: value,
          })}
          decimals={1}
          max={10000}
          suffix={`\u00A0${TRANSACTION_UNIT_NETWORKS[chainId]}`}
          customValue={settingsStore.gasCustomValue}
          customDescription={customTransactionConfirmationTime}
          isCustomAvailable={!isConstantGasPrice}
        />
        {customGasPriceError && (
          <div className="text-xs text-orange mt-1">{customGasPriceError}</div>
        )}
      </div>

      <div className="mt-auto flex justify-between">
        <button
          className={clsx(
            'h-10 w-[47%] rounded-2lg border border-black px-5 text-xs font-semibold uppercase tracking-widest transition-colors duration-300 text-black',
            'hover:border-black hover:bg-black hover:text-white',
            'disabled:text-gray disabled:border-gray disabled:hover:text-gray disabled:hover:border-gray disabled:hover:bg-white',
            'dark:disabled:text-gray dark:disabled:border-gray dark:disabled:hover:text-gray dark:disabled:hover:border-gray dark:disabled:hover:bg-transparent',
            'dark:text-white dark:border-gray400 dark:hover:bg-gray dark:hover:text-black dark:hover:border-gray dark:disabled:!border-lightBlack'
          )}
          onClick={() => {
            settingsStore.resetSettings();
          }}
          disabled={isDisabledResetBtn}
        >
          Reset
        </button>
        <Button className="w-[47%]" onClick={onCloseClick}>
          OK
        </Button>
      </div>
    </motion.div>
  );
});
