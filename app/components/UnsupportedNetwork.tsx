import { useParams } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

import { Button } from '~/components/Button';
import { AlertIcon } from '~/components/Icon/AlertIcon';
import { NETWORKS, WalletId } from '~/constants';

interface Props {
  switchNetworkError: { error: string | null; failedChainId: number | null };
}

export function UnsupportedNetwork({ switchNetworkError }: Props) {
  const { chainId } = useParams();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const { connector: activeConnector } = useAccount();

  const [isUnsupportedNetwork, setIsUnsupportedNetwork] = useState(false);

  const isWalletConnect = activeConnector?.id === WalletId.WalletConnect;
  const currentPageNetwork = NETWORKS.find((network) => network.id === chainId)?.name;
  const failedChain = NETWORKS.find(
    (network) => +network.id === switchNetworkError.failedChainId
  )?.name;

  useEffect(() => {
    setIsUnsupportedNetwork(NETWORKS.find((network) => +network.id === chain?.id) ? false : true);
  }, [chain]);

  const errorMessage = useMemo(() => {
    if (isUnsupportedNetwork || switchNetworkError.failedChainId) {
      return `Unsupported network selected. Please connect to the ${
        switchNetworkError.failedChainId ? failedChain : currentPageNetwork
      } network in your wallet.`;
    }

    return `Network doesn't match to network selected in your wallet. Please switch the network to ${currentPageNetwork} network in your wallet.`;
  }, [isUnsupportedNetwork, currentPageNetwork, switchNetworkError.failedChainId, failedChain]);

  return (
    <div className="flex flex-col items-center justify-between rounded-2lg bg-orange/40 py-4 pl-7 pr-7 lg:flex-row lg:py-0.5 lg:pr-0.5 min-h-[40px]">
      <div className="flex items-center">
        <AlertIcon className="h-4 w-4 shrink-0 text-white" />
        <div className="ml-4 text-sm text-white lg:text-left">{errorMessage}</div>
      </div>
      {!isWalletConnect && (
        <Button
          className="mt-4 justify-self-end rounded-lg lg:mt-0"
          buttonType="secondary"
          onClick={() => {
            chainId && switchNetwork?.(+chainId);
          }}
        >
          Change Network
        </Button>
      )}
    </div>
  );
}
