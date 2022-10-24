import { useContext, createContext } from 'react';

import { ModalStore } from '~/store/ModalStore';
import { Web3Store } from '~/store/Web3Store';
import type { InitialState as AppStoreInitialState } from '~/store/AppStore';
import { AppStore } from '~/store/AppStore';
import { SettingsStore } from '~/store/SettingsStore';
import { SwapStore } from '~/store/SwapStore';

export type InitialState = AppStoreInitialState;

export class RootStore {
  modalStore: ModalStore;
  settingsStore: SettingsStore;
  web3Store: Web3Store;
  appStore: AppStore;
  swapStore: SwapStore;

  constructor(initialState: InitialState) {
    this.modalStore = new ModalStore();
    this.appStore = new AppStore(this, initialState);
    this.settingsStore = new SettingsStore(this);
    this.web3Store = new Web3Store(this);
    this.swapStore = new SwapStore(this);
  }
}

const StoreContext = createContext<RootStore | undefined>(undefined);

export function useRootStore() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }

  return context;
}

export const StoreProvider = StoreContext.Provider;
