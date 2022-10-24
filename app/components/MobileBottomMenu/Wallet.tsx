import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

import { AnimateHeight } from '~/components/AnimateHeight';
import { CopyIcon } from '~/components/Icon/CopyIcon';
import { DisconnectIcon } from '~/components/Icon/DisconnectIcon';
import { ExplorerIcon } from '~/components/Icon/ExplorerIcon';
import type { SupportedNetworks, WalletId } from '~/constants';
import { compactAddress, openNewWindow } from '~/helpers/helpers';
import { useRootStore } from '~/store/rootStore';
import { WalletIcon } from '../Icon/wallets/WalletIcon';

import { MenuState } from './constants';
import { TitleClose } from './TitleClose';

interface Props {
  menuState: MenuState;
  closeSelect: () => void;
  chainId: SupportedNetworks;
}

export const Wallet: React.FC<Props> = observer(({ menuState, closeSelect, chainId }) => {
  const {
    web3Store: { setAccountBalance, setSigner, setAccountAddress },
  } = useRootStore();
  const [isCopied, setCopied] = useState(false);

  const { address, connector: activeConnector } = useAccount();
  const { chains } = useNetwork();

  const { disconnect } = useDisconnect();

  return (
    <AnimateHeight
      isOpen={menuState === MenuState.wallet}
      className={clsx('flex flex-col text-black text-sm', 'dark:text-white')}
    >
      <TitleClose closeSelect={closeSelect}>Account</TitleClose>
      <button
        className={clsx(
          'mb-5 flex w-full items-center rounded-lg border border-black/20 py-5 px-6 text-black',
          'dark:border-white/20 dark:text-white'
        )}
      >
        {activeConnector?.id && (
          <WalletIcon
            walletId={activeConnector?.id as WalletId}
            className={'mr-4 w-[25px] h-[25px]'}
          />
        )}
        {compactAddress(address ?? '')}
        <CopyToClipboard
          text={address ?? ''}
          onCopy={() => {
            setCopied(true);
          }}
        >
          <CopyIcon
            className={clsx(
              'ml-auto h-[20px] w-[22px] transition-transform active:scale-110',
              isCopied && 'opacity-60'
            )}
          />
        </CopyToClipboard>
      </button>
      <div className="flex items-center justify-evenly">
        <button
          className="flex"
          onClick={() => {
            openNewWindow(
              `${
                chains.find((chain) => chain.id === +chainId)?.blockExplorers?.default.url
              }/address/${address}`
            );
          }}
        >
          <ExplorerIcon className="mr-2" />
          in Explorer
        </button>
        <button
          className="flex items-center"
          onClick={() => {
            disconnect();
            closeSelect();
            setAccountBalance(null);
            setSigner(null);
            setAccountAddress(null);
          }}
        >
          <DisconnectIcon className="mr-2" />
          Disconnect
        </button>
      </div>
    </AnimateHeight>
  );
});
