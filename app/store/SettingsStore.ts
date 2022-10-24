import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { BigNumber, ethers } from 'ethers';

import type { RootStore } from '~/store/rootStore';
import { type SupportedNetworks, SLIPPAGES, GasPriceType } from '~/constants';
import { isServer, isNetworkWithConstantGasPrice } from '~/helpers/helpers';
import { STORAGE_KEYS } from '~/hooks';

export interface SettingItem {
  type: string;
  value: number;
}

export const MAX_SLIPPAGE_VALUE = 50;

export const DEFAULT_GAS_PRICE = {
  type: GasPriceType.MEDIUM,
  value: 0,
};

export const DEFAULT_SLIPPAGE = SLIPPAGES[1];

export class SettingsStore {
  gasPrices: SettingItem[] = [];
  gasPrice: SettingItem = DEFAULT_GAS_PRICE;
  gasCustomValue?: number = undefined;
  slippageCustomValue?: number = undefined;
  slippage: SettingItem = DEFAULT_SLIPPAGE;
  validSlippage: SettingItem = DEFAULT_SLIPPAGE;

  constructor(private rs: RootStore) {
    makeObservable(this, {
      slippage: observable.struct,
      validSlippage: observable.struct,
      slippageCustomValue: observable,
      gasPrice: observable.struct,
      gasCustomValue: observable,
      gasPrices: observable.ref,
      gasPriceInGwei: computed,
      checkValues: action.bound,
      setValidSlippage: action.bound,
      setSlippage: action.bound,
      setGasPrices: action.bound,
      setGasPrice: action.bound,
      resetSettings: action.bound,
      resetSlippage: action.bound,
      resetGasPrice: action.bound,
    });

    this.initSettings(this.rs.appStore.chainId);

    reaction(
      () => this.rs.appStore.chainId,
      (chainId) => {
        this.initSettings(chainId);
      }
    );
  }

  get gasPriceInGwei() {
    return this.gasPrice.value
      ? ethers.utils.parseUnits(this.gasPrice.value?.toFixed(9).toString(), 'gwei')
      : BigNumber.from(0);
  }

  initSettings(chainId: SupportedNetworks) {
    if (isServer) {
      return;
    }

    const settings = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.SETTINGS) ?? '{}');

    if (!settings) {
      return;
    }

    this.slippageCustomValue = settings?.[chainId]?.slippage?.custom;
    this.gasCustomValue = settings?.[chainId]?.gas?.custom;

    const selectedGas = settings?.[chainId]?.gas?.selected;
    const selectedSlippage = settings?.[chainId]?.slippage?.selected;

    if (selectedGas) {
      this.gasPrice = {
        type: selectedGas,
        value: selectedGas === GasPriceType.CUSTOM && this.gasCustomValue ? this.gasCustomValue : 0,
      };
    }

    if (selectedSlippage) {
      this.slippage = {
        type: selectedSlippage,
        value:
          selectedSlippage === 'custom' && this.slippageCustomValue
            ? this.slippageCustomValue
            : DEFAULT_SLIPPAGE.value,
      };
    }
  }

  setSlippage(slippage: SettingItem) {
    this.slippage = slippage;

    if (slippage.type === 'custom') {
      this.slippageCustomValue = slippage.value;
    } else {
      this.setValidSlippage();
    }
  }

  setValidSlippage() {
    if (this.slippage.value < MAX_SLIPPAGE_VALUE) {
      this.validSlippage = this.slippage;
    }
  }

  checkValues() {
    if (this.slippage.value !== this.validSlippage.value) {
      this.slippage = this.validSlippage;
      if (this.validSlippage.type === 'custom') {
        this.slippageCustomValue = this.validSlippage.value;
      }
    }
  }

  setGasPrices(gasPrices: { [K in GasPriceType]?: number }) {
    const isConstantGasPrice = isNetworkWithConstantGasPrice(this.rs.appStore.chainId);

    let gasPricesArray: SettingItem[] = [];

    gasPricesArray = Object.entries(gasPrices)
      .map(([type, value]) => ({
        type,
        value,
      }))
      .reverse();

    const mediumGasPrice = gasPricesArray[1];

    if (!this.gasPrice) {
      this.gasPrice = mediumGasPrice;
    } else if (this.gasPrice.type !== GasPriceType.CUSTOM) {
      const currentType = this.gasPrice.type;
      const foundPrice = gasPricesArray.find(({ type }) => type === currentType);

      if (foundPrice) {
        this.gasPrice = foundPrice;
      }
    }
    // if it is network with constant gas price we receive an array with gasprices which values are the same.
    // So we set any of these values (we don't need all three value because of it will display like three same options)
    if (isConstantGasPrice) {
      this.gasPrices = [mediumGasPrice];
      this.gasPrice = mediumGasPrice;
      return;
    }

    this.gasPrices = gasPricesArray;
  }

  setGasPrice(gasPrice: SettingItem) {
    this.gasPrice = gasPrice;
    if (gasPrice.type === GasPriceType.CUSTOM) {
      this.gasCustomValue = gasPrice.value;
    }
  }

  resetSettings() {
    const isConstantGasPrice = isNetworkWithConstantGasPrice(this.rs.appStore.chainId);

    if (!isConstantGasPrice) {
      this.resetGasPrice();
    }
    this.resetSlippage();
  }

  resetGasPrice() {
    this.gasPrice =
      this.gasPrices.find((gasPrice) => gasPrice.type === DEFAULT_GAS_PRICE.type) ||
      DEFAULT_GAS_PRICE;
  }

  resetSlippage() {
    this.slippage = DEFAULT_SLIPPAGE;
    this.setValidSlippage();
  }
}
