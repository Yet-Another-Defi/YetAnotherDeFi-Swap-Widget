import { useEffect, useState } from 'react';
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { useParams, useNavigate } from '@remix-run/react';
import { observer } from 'mobx-react';
import clsx from 'clsx';

import { STORAGE_KEYS, useIsMounted, useLocalStorage } from '~/hooks';
import { AlertIcon } from '../Icon/AlertIcon';
import { useRootStore } from '~/store/rootStore';
import { FadeInAnimation } from '~/components/FadeInAnimation';
import type { Wallet } from '~/constants';
import { NETWORKS } from '~/constants';
import { WalletId, WALLETS } from '~/constants';
import { openNewWindow, replaceChainIdUrl } from '~/helpers/helpers';
import { NetworkIcon } from '~/components/Icon/networks';
import { WalletIcon } from '../Icon/wallets/WalletIcon';
import { getWalletErrorText } from '~/utils/errors';

const ERROR_MSG_USER = ['User rejected request', 'User denied account authorization'];

export const SelectNetworkAndWalletModal = observer(() => {
  const navigate = useNavigate();
  const { chainId } = useParams();
  const {
    modalStore: { closeModal },
    appStore: { chainId: appChainId, setChainId: setAppChainId },
  } = useRootStore();
  const isMounted = useIsMounted();
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS);
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);

  const { connect, connectors, error, isLoading } = useConnect();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const onConnect = async (wallet: Wallet) => {
    setActiveWallet(wallet);
    const activeConnector = connectors.find((connector) => connector.id === wallet.id);

    if (activeConnector?.ready && chainId) {
      connect({ connector: activeConnector, chainId: +chainId });
      chain?.id !== +chainId && switchNetwork?.(+chainId);
    } else if (activeConnector?.id === WalletId.MetaMask) {
      openNewWindow('https://metamask.io/download');
    }
  };

  useEffect(() => {
    if (isConnected && !isLoading) {
      closeModal();
    }
  }, [closeModal, isConnected, isLoading]);

  const isSelectWallet =
    (!isConnected && !error?.message) || ERROR_MSG_USER.includes(error?.message ?? '');
  const isError = !!error?.message && !ERROR_MSG_USER.includes(error.message);

  const errorText = getWalletErrorText(error, activeWallet?.id);

  if (!isMounted || !chainId) {
    return null;
  }

  return (
    <>
      <FadeInAnimation className="flex flex-col mb-5" isVisible={isSelectWallet} isExit={false}>
        <>
          <h6 className={clsx('mb-5 text-black/40', 'dark:text-white/40')}>Change a network</h6>
          <div className="flex flex-wrap gap-y-2.5 mb-[30px]">
            {NETWORKS.map((network) => {
              return (
                <button
                  key={network.id}
                  className={clsx(
                    'flex flex-col items-center justify-center',
                    'w-[120px] h-[100px] rounded-2lg',
                    'transition-all duration-300',
                    network.id === appChainId && 'shadow-md bg-white dark:bg-lightBlack'
                  )}
                  onClick={() => {
                    setSettings({
                      ...(settings && { ...JSON.parse(settings) }),
                      chainId: network.id,
                    });
                    setAppChainId(network.id);
                    navigate(replaceChainIdUrl(network.id), { replace: true });
                  }}
                >
                  <NetworkIcon networkId={network.id} className={'mb-1'} />
                  <span className={clsx('text-xs text-black/90', 'dark:text-white/90')}>
                    {network.name}
                  </span>
                </button>
              );
            })}
          </div>
          <h6 className={clsx('mb-5 text-black/40', 'dark:text-white/40')}>Select a wallet</h6>
          <div className="flex">
            {WALLETS.map((wallet) => {
              const isActiveWallet = wallet.id === activeWallet?.id;
              return (
                <button
                  key={wallet.name}
                  className={clsx(
                    'flex flex-col items-center justify-center',
                    'w-[120px] h-[100px] py-4',
                    'rounded-2lg',
                    isActiveWallet && 'shadow bg-white dark:bg-lightBlack'
                  )}
                  onClick={() => {
                    onConnect(wallet);
                  }}
                >
                  <WalletIcon walletId={wallet.id} className={'h-[50px] w-[50px] mb-2.5'} />
                  <span className={clsx('text-xs text-black/90', 'dark:text-white/90')}>
                    {wallet.name}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      </FadeInAnimation>

      <FadeInAnimation
        className={clsx(
          'flex flex-col items-center justify-center',
          'h-[160px] rounded-xl bg-white',
          'dark:bg-dark',
          'mb-5'
        )}
        isVisible={isError}
      >
        <AlertIcon className="mb-2.5 h-4 w-4 text-orange" />
        <div className="opacity-80 px-7">{errorText}</div>
      </FadeInAnimation>
    </>
  );
});
