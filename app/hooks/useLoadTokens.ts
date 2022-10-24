import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';

import { useRootStore } from '~/store/rootStore';
import type { Token } from '~/objects/tokens';
import { STORAGE_KEYS, useLocalStorage } from '~/hooks';

type TokensMap = Record<string, Token>;

interface ReturnType {
  tokens?: TokensMap;
  customTokens?: TokensMap;
}

export function useLoadTokens(): ReturnType {
  const { appStore } = useRootStore();
  const { chainId, tokensArray, setTokens, setIsTokensLoading } = appStore;

  const [customTokens] = useLocalStorage(STORAGE_KEYS.CUSTOM_TOKENS);
  const parsedCustomTokens = JSON.parse(customTokens ?? '{}')[chainId];

  const tokensFetcher = useFetcher<Record<string, Token>>();

  const isRefetch = !tokensArray.length;

  useEffect(() => {
    if (isRefetch) {
      setIsTokensLoading(true);
      tokensFetcher.load(`/api/tokens/${chainId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, isRefetch]);

  useEffect(() => {
    if (tokensFetcher.data) {
      setIsTokensLoading(false);

      const tokens = {
        ...tokensFetcher.data,
        ...parsedCustomTokens,
      };
      setTokens(tokens);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensFetcher.data]);

  return { tokens: tokensFetcher.data, customTokens: parsedCustomTokens };
}
