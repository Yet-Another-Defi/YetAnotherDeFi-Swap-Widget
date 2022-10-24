import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

import { isSupportedNetwork } from '~/helpers/helpers';
import { type Token } from '~/objects/tokens';
import { SupportedNetworks } from '~/constants';
import { DEFAULT_TOKEN_PAIRS } from '~/constants';

interface CheckUrlParams {
  fromToken?: Token;
  toToken?: Token;
  chainId?: string;
}

export const useCheckUrl = ({ fromToken, toToken, chainId }: CheckUrlParams) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isValidChainId = chainId && isSupportedNetwork(chainId);
    const isTokensEqual = fromToken?.symbol === toToken?.symbol;

    if (!isValidChainId) {
      return navigate(
        `/1/exchange/${DEFAULT_TOKEN_PAIRS[
          SupportedNetworks.Ethereum
        ][0].toLowerCase()}/${DEFAULT_TOKEN_PAIRS[SupportedNetworks.Ethereum][1].toLowerCase()}`
      );
    }

    const defaultFromToken = DEFAULT_TOKEN_PAIRS[chainId][0].toLowerCase();
    const defaultToToken = DEFAULT_TOKEN_PAIRS[chainId][1].toLowerCase();

    if (isTokensEqual) {
      return navigate(`/${chainId}/exchange/${defaultFromToken}/${defaultToToken}`);
    }

    const fromLower = fromToken?.symbol.toLowerCase();
    const toLower = toToken?.symbol.toLowerCase();

    const from = fromLower ?? defaultFromToken;
    const to = toLower ?? defaultToToken;

    return navigate(`/${chainId}/exchange/${from}/${to}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken?.address, toToken?.address, navigate, chainId]);
};
