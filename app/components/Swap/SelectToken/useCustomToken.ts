import { useState, useEffect, useCallback } from 'react';
import { useFetcher } from '@remix-run/react';
import { isAddress } from 'ethers/lib/utils';

import { useRootStore } from '~/store/rootStore';
import { type Token } from '~/objects/tokens';
import { ERC20__factory } from '~/types/ethers';

export function useCustomToken(address: string) {
  const {
    web3Store,
    appStore: { chainId },
  } = useRootStore();

  const tokenLogoFetcher = useFetcher<string>();

  const [token, setToken] = useState<Omit<Token, 'logoURI'> | null>(null);
  const [tokenLogo, setTokenLogo] = useState('');
  const [error, setError] = useState(false);

  const getTokenByAddress = useCallback(async () => {
    if (!web3Store.provider) {
      return;
    }

    try {
      const isContractExist = await !!web3Store.provider.getCode(address);

      if (isContractExist) {
        const contract = ERC20__factory.connect(address, web3Store.provider);
        tokenLogoFetcher.load(`/api/tokenlogo/${chainId}/${address}`);

        setToken({
          chainId,
          address,
          name: await contract.name(),
          symbol: await contract.symbol(),
          decimals: await contract.decimals(),
        });
      }
    } catch (error) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chainId, web3Store.provider]);

  useEffect(() => {
    if (isAddress(address)) {
      setToken(null);
      setError(false);
      setTokenLogo('/images/noLogoTokenIcon.png');
      getTokenByAddress();
      return;
    }
    setError(true);
  }, [address, chainId, getTokenByAddress]);

  useEffect(() => {
    if (tokenLogoFetcher.data) {
      setTokenLogo(tokenLogoFetcher.data);
    }
  }, [tokenLogoFetcher.data]);

  const customToken =
    token && tokenLogoFetcher.state !== 'loading'
      ? ({ ...token, logoURI: tokenLogo } as Token)
      : null;

  return {
    token: customToken,
    error,
  };
}
