import clsx from 'clsx';
import { useConnect } from 'wagmi';

import { AnimateHeight } from '~/components/AnimateHeight';
import { WalletIcon } from '~/components/Icon/wallets/WalletIcon';
import type { Wallet } from '~/constants';
import { WalletId, WALLETS } from '~/constants';
import { openNewWindow } from '~/helpers/helpers';
import { MenuState } from './constants';
import { TitleClose } from './TitleClose';

interface Props {
  menuState: MenuState;
  closeSelect: () => void;
}

export function Connect({ menuState, closeSelect }: Props) {
  const { connect, connectors } = useConnect();

  const onConnect = (wallet: Wallet) => {
    const activeConnector = connectors.find((connector) => connector.id === wallet.id);
    if (activeConnector?.ready) {
      connect({ connector: activeConnector });
      closeSelect();
    } else if (activeConnector?.id === WalletId.MetaMask) {
      let openLink = `https://metamask.app.link/dapp/${location.host + location.pathname}/`;
      openNewWindow(openLink);
    }
  };

  return (
    <AnimateHeight
      isOpen={menuState === MenuState.connect}
      className={clsx('flex flex-col text-black', 'dark:text-white')}
    >
      <div className="flex flex-col justify-start">
        <TitleClose closeSelect={closeSelect}>Connect Wallet</TitleClose>
        {WALLETS.map((wallet) => {
          const connector = connectors.find((connector) => connector.id === wallet.id);
          return (
            <button
              key={wallet.id}
              className={clsx(
                'flex items-center justify-center',
                'rounded-lg border border-black/10 px-4 py-5',
                'hover:bg-black hover:text-white',
                'text-sm',
                'mb-4',
                'dark:border-white/10 dark:hover:bg-white dark:hover:text-black'
              )}
              onClick={() => {
                if (connector) {
                  onConnect(wallet);
                }
              }}
            >
              <WalletIcon walletId={wallet.id} className={'mr-[15px] w-[25px] h-[25px]'} />
              {wallet.name}
            </button>
          );
        })}
      </div>
    </AnimateHeight>
  );
}
