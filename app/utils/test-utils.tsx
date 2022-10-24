import type { FC, ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { WagmiConfig } from 'wagmi';

import { useClientWallet } from '~/useClientWallet';
import { RootStore, StoreProvider } from '~/store/rootStore';
import { type UIContextType, UiSettingsProvider, styledComponentsTheme } from '~/UiProvider';
import { THEME_TYPES } from '~/constants';

const uiContextValue: UIContextType = {
  state: {
    theme: THEME_TYPES.LIGHT,
  },
  changeTheme: () => {},
  isLightTheme: true,
};

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = new RootStore({ fromAmount: '0' });
  const client = useClientWallet();
  return (
    <WagmiConfig client={client}>
      <UiSettingsProvider value={uiContextValue}>
        <ThemeProvider theme={styledComponentsTheme}>
          <StoreProvider value={store}>{children}</StoreProvider>
        </ThemeProvider>
      </UiSettingsProvider>
    </WagmiConfig>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
