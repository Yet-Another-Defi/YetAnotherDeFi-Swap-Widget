import { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { TooltipArrowIcon } from '~/components/Icon/TooltipArrowIcon';
import { CopyIcon } from '~/components/Icon/CopyIcon';
import { openNewWindow } from '~/helpers/helpers';
import type { SupportedNetworks } from '~/constants';
import { WALLETS } from '~/constants';
import { DisconnectIcon } from '../Icon/DisconnectIcon';
import { ExplorerIcon } from '../Icon/ExplorerIcon';
import { WalletIcon } from '../Icon/wallets/WalletIcon';
import { useIsMounted } from '~/hooks';
import { useRootStore } from '~/store/rootStore';

interface Props {
  chainId: SupportedNetworks;
}

export const AccountMenu: React.FC<Props> = observer(({ chainId }) => {
  const {
    web3Store: { setAccountBalance, setSigner, setAccountAddress },
  } = useRootStore();
  const isMounted = useIsMounted();
  const [copied, setCopied] = useState(false);

  const { address, connector: activeConnector } = useAccount();
  const { chains } = useNetwork();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [copied]);

  const activeWallet = WALLETS.find((wallet) => wallet.id === activeConnector?.id);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={clsx(
        'absolute right-0 top-full z-30 mt-1.5 rounded-2.5xl bg-white p-4 pb-2 shadow',
        'dark:bg-black dark:shadow-lightDarkShadow'
      )}
    >
      <TooltipArrowIcon
        className={clsx('absolute -top-1.5 right-10 text-white', 'dark:text-black')}
      />
      <div className={clsx('flex text-black', 'dark:text-white')}>
        <div
          className={clsx(
            'flex items-center justify-center',
            'h-16 w-16',
            'rounded-l-lg border border-black/5',
            'dark:border-lightBlack'
          )}
        >
          {activeWallet?.id && <WalletIcon walletId={activeWallet?.id} />}
        </div>
        <div
          className={clsx(
            'ml-0.5 flex grow flex-col justify-center px-4',
            'border border-black/5 rounded-r-lg',
            'dark:border-lightBlack'
          )}
        >
          <div className="text-xs font-light">Wallet</div>
          <div className="font-semibold">{activeWallet?.name}</div>
        </div>
      </div>
      <div
        className={clsx(
          'flex items-center whitespace-nowrap pt-2.5 text-sm tracking-widest text-black',
          'dark:text-white'
        )}
      >
        <div
          onClick={() => {
            openNewWindow(
              `${
                chains.find((chain) => chain.id === +chainId)?.blockExplorers?.default.url
              }/address/${address}`
            );
          }}
          className="mr-4 flex cursor-pointer items-center hover:underline"
        >
          <ExplorerIcon className={clsx('mr-1.5 w-7 pt-1 text-black', 'dark:text-white')} />
          in Explorer
        </div>
        <CopyToClipboard
          text={address ?? ''}
          onCopy={() => {
            setCopied(true);
          }}
        >
          <div className="mr-4 flex cursor-pointer items-center hover:underline">
            <CopyIcon className={clsx('mr-1.5 w-5 h-5 text-black', 'dark:text-white')} />
            {copied ? 'Copied' : 'Copy'}
          </div>
        </CopyToClipboard>
        <button
          onClick={() => {
            disconnect();
            setAccountBalance(null);
            setSigner(null);
            setAccountAddress(null);
          }}
          className="flex cursor-pointer items-center hover:underline"
        >
          <DisconnectIcon className={clsx('mr-1.5 w-7 text-black', 'dark:text-white')} />
          Disconnect
        </button>
      </div>
    </div>
  );
});
