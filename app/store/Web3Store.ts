import { action, computed, makeObservable, observable } from 'mobx';
import type { Provider } from '@wagmi/core';
import type { BigNumber, Signer } from 'ethers';

import type { RootStore } from '~/store/rootStore';
import type { Token } from '~/objects/tokens';

export class Web3Store {
  pending = false;
  providerChainId: number | null = null;
  accountAddress: string | null = null;
  accountBalance: BigNumber | null = null;
  provider: Provider | null = null;
  signer: Signer | null = null;
  switchNetworkError: {
    error: string | null;
    failedChainId: number | null;
  } = { error: null, failedChainId: null };

  constructor(private rs: RootStore) {
    makeObservable(this, {
      pending: observable,
      accountAddress: observable,
      providerChainId: observable,
      switchNetworkError: observable.ref,
      accountBalance: observable.ref,
      provider: observable.ref,
      signer: observable.ref,
      addToken: action.bound,
      setProvider: action.bound,
      setSigner: action.bound,
      setAccountAddress: action.bound,
      setAccountBalance: action.bound,
      setProviderChainId: action.bound,
      setSwitchNetworkError: action.bound,
      checkNetwork: computed,
    });
  }

  get checkNetwork() {
    return this.providerChainId === +this.rs.appStore.chainId;
  }

  async addToken(token: Token) {
    try {
      let wasAdded: any;
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      wasAdded = await window.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.logoURI,
          },
        },
      });

      return !!wasAdded;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  setProvider(provider: Provider) {
    this.provider = provider;
  }

  setSigner(signer: Signer | null) {
    this.signer = signer;
  }

  // chain Id in wallet
  setProviderChainId(chainId: number) {
    this.providerChainId = chainId;
  }

  // Computed mobx can't be async, so we need update it
  setAccountAddress(address: string | null) {
    this.accountAddress = address;
  }

  // Computed mobx can't be async, so we need update it. It is native network token, e.g. ETH for mainnet
  setAccountBalance(balance: BigNumber | null) {
    this.accountBalance = balance;
  }

  setSwitchNetworkError({
    error,
    failedChainId,
  }: {
    error: string | null;
    failedChainId: number | null;
  }) {
    this.switchNetworkError = { error, failedChainId };
  }
}
