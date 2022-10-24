import type { NavigateFunction } from '@remix-run/react';
import { DEFAULT_TOKEN_PAIRS } from '~/constants';
import { isSupportedNetwork } from '~/helpers/helpers';

export const redirectToHome = (navigate: NavigateFunction, settings?: string) => {
  if (settings) {
    const { chainId } = JSON.parse(settings);

    if (chainId && isSupportedNetwork(chainId)) {
      navigate(
        `/${chainId}/exchange/${DEFAULT_TOKEN_PAIRS[
          chainId
        ][0].toLowerCase()}/${DEFAULT_TOKEN_PAIRS[chainId][1].toLowerCase()}`
      );
      return;
    }
  }

  navigate('/1/exchange/eth/dai');
};
