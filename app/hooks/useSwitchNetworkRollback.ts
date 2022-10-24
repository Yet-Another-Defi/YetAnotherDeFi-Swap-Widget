import { useRef } from 'react';
import { useNavigate } from '@remix-run/react';
import { useSwitchNetwork } from 'wagmi';

import type { SupportedNetworks } from '~/constants';
import { replaceChainIdUrl } from '~/helpers/helpers';
import { useRootStore } from '~/store/rootStore';
import { STORAGE_KEYS, useLocalStorage } from './useLocalStorage';

export function useSwitchNetworkRollback() {
  const {
    appStore: { chainId: appChainId, setChainId: setAppChainId },
    web3Store: { setSwitchNetworkError },
  } = useRootStore();
  const navigate = useNavigate();
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS);
  const prevChainId = useRef(appChainId);

  const changeNetwork = (chainId: SupportedNetworks) => {
    setSettings({ ...(settings && { ...JSON.parse(settings) }), chainId });
    setAppChainId(chainId);
    navigate(replaceChainIdUrl(chainId));
  };

  const { switchNetwork } = useSwitchNetwork({
    onError: (error, variables) => {
      changeNetwork(prevChainId.current);
      setSwitchNetworkError({ error: error.name, failedChainId: variables.chainId });
    },
    onSuccess: (data) => {
      prevChainId.current = String(data.id) as SupportedNetworks;
      setSwitchNetworkError({ error: null, failedChainId: null });
    },
  });

  return { switchNetworkWithRollback: switchNetwork, changeNetwork };
}
