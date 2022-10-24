import { useState, useCallback, createContext, useContext } from 'react';
import { MenuState } from './constants';

export type ContextType = {
  menuState: MenuState;
  closeSelect: () => void;
  openNetworkMenu: () => void;
  openConnectMenu: () => void;
  openWalletMenu: () => void;
};

interface Props {
  children: React.ReactNode;
}

export const MobileMenuContext = createContext<ContextType | undefined>(undefined);

export function useMobileMenuState(): ContextType {
  const context = useContext(MobileMenuContext);

  if (context === undefined) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }

  return context;
}

export const MobileMenuProvider = ({ children }: Props) => {
  const [menuState, setMenuState] = useState(MenuState.base);

  const closeSelect = useCallback(() => {
    setMenuState(MenuState.base);
  }, []);

  const openNetworkMenu = useCallback(() => {
    setMenuState(MenuState.network);
  }, []);

  const openConnectMenu = useCallback(() => {
    setMenuState(MenuState.connect);
  }, []);

  const openWalletMenu = useCallback(() => {
    setMenuState(MenuState.wallet);
  }, []);
  const contextValue = {
    menuState,
    closeSelect,
    openNetworkMenu,
    openConnectMenu,
    openWalletMenu,
  };

  return <MobileMenuContext.Provider value={contextValue}>{children}</MobileMenuContext.Provider>;
};
