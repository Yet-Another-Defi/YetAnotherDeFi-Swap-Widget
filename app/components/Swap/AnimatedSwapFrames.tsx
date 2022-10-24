import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react';

import { useRootStore } from '~/store/rootStore';
import { SelectToken } from './SelectToken';
import { CustomTokenConfirmation } from './CustomTokenConfirmation';
import { SwapSettings } from './SwapSettings';
import { SelectCustomToken } from './SelectToken/SelectCustomToken';

import type { Token } from '~/objects/tokens';
import type { SwapState, ReturnFunctionsType as Actions } from './useSwapState';

interface Props {
  swapState: SwapState;
  actions: Actions;
}

export const AnimatedSwapFrames: React.FC<Props> = observer(({ swapState, actions }) => {
  const { appStore, swapStore } = useRootStore();

  const { from, to, chainId } = appStore;

  const {
    closeSettings,
    closeSelectToken,
    openSelectCustomToken,
    openCustomTokenConfirmation,
    closeCustomToken,
    closeAll,
  } = actions;

  const {
    isFromToken,
    isOpenOptions,
    isSelectTokenOpen,
    isCustomConfirmationOpen,
    token,
    isCustomSelectOpen,
  } = swapState;

  const getLinkUrl = useCallback(
    (token: Token) => {
      if (isFromToken) {
        const fromLink = `/${chainId}/exchange/${token.symbol.toLowerCase()}/${to?.symbol.toLowerCase()}`;
        const reverseFromLink = `/${chainId}/exchange/${token?.symbol.toLowerCase()}/${from?.symbol.toLowerCase()}`;

        return token.symbol === to?.symbol ? reverseFromLink : fromLink;
      }
      const toLink = `/${chainId}/exchange/${from?.symbol.toLowerCase()}/${token.symbol.toLowerCase()}`;
      const reverseToLink = `/${chainId}/exchange/${to?.symbol.toLowerCase()}/${token?.symbol.toLowerCase()}`;

      return token.symbol === from?.symbol ? reverseToLink : toLink;
    },
    [isFromToken, from?.symbol, to?.symbol, chainId]
  );

  const setTokenToStore = useCallback(
    (token: Token) => {
      if (isFromToken) {
        appStore.setFromToken(token);
      } else {
        appStore.setToToken(token);
      }
    },
    [isFromToken, appStore]
  );

  return (
    <AnimatePresence>
      {isOpenOptions && !!swapStore && <SwapSettings onClose={closeSettings} />}
      {isSelectTokenOpen && (
        <SelectToken
          getLinkUrl={getLinkUrl}
          setTokenToStore={setTokenToStore}
          closeSelect={closeSelectToken}
          openSelectCustomToken={openSelectCustomToken}
          openCustomConfirmation={openCustomTokenConfirmation}
          key="select"
        />
      )}
      {isCustomConfirmationOpen && token && (
        <CustomTokenConfirmation
          closeCustom={closeCustomToken}
          closeAll={closeAll}
          getLinkUrl={getLinkUrl}
          setTokenToStore={setTokenToStore}
          token={token}
          key="custom-confirmation"
        />
      )}
      {isCustomSelectOpen && (
        <SelectCustomToken
          closeCustom={closeCustomToken}
          closeAll={closeAll}
          getLinkUrl={getLinkUrl}
          setTokenToStore={setTokenToStore}
          openCustomConfirmation={openCustomTokenConfirmation}
          key="custom"
        />
      )}
    </AnimatePresence>
  );
});
