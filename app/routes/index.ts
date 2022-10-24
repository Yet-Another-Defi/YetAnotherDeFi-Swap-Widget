import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { DEFAULT_TOKEN_PAIRS } from '~/constants';
import { isSupportedNetwork } from '~/helpers/helpers';
import { STORAGE_KEYS, useLocalStorage } from '~/hooks';

export default function Index() {
  const navigate = useNavigate();
  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS);

  useEffect(() => {
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
  }, [settings, navigate]);

  return null;
}
