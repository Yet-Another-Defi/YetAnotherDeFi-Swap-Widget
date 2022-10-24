import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useAccount } from 'wagmi';

import { Button } from '~/components/Button';
import { ArrowIcon } from '~/components/Icon/ArrowIcon';
import { NETWORKS, ScreenSize } from '~/constants';
import { compactAddress } from '~/helpers/helpers';
import { useWindowSize } from '~/hooks/useWindowSize';
import { useRootStore } from '~/store/rootStore';
import { NetworkIcon } from '../Icon/networks';
import { useMobileMenuState } from './useMobileMenuState';

export const Base: React.FC = observer(() => {
  const {
    appStore: { chainId },
  } = useRootStore();
  const { width } = useWindowSize();
  const { openConnectMenu, openWalletMenu, openNetworkMenu } = useMobileMenuState();

  const { address, connector: isConnected } = useAccount();

  const networkName = NETWORKS.find((network) => network.id === chainId)
    ?.name.slice(0, 3)
    .toUpperCase();

  const compactAddressCalcSymbols = () => {
    if (width > ScreenSize.sm) {
      return 3;
    } else if (width > 380) {
      return 2;
    }
    return 1;
  };
  const isMobile = width < ScreenSize.sm;

  return (
    <div className="flex justify-between">
      <button
        onClick={openNetworkMenu}
        className={clsx(
          'flex items-center justify-center',
          'cursor-pointer rounded-2lg border border-black/40',
          'py-2 px-4',
          'text-xs font-bold uppercase tracking-widest text-black',
          'dark:border-white/40 dark:text-white',
          isMobile && 'w-[130px]'
        )}
      >
        <span
          className={clsx(
            'mr-2.5 flex h-[25px] w-[25px] items-center justify-center rounded-full bg-black/10',
            'dark:bg-white/10'
          )}
        >
          <NetworkIcon networkId={chainId} />
        </span>
        <span className="overflow-hidden text-ellipsis w-[70px]">{networkName}</span>
        <ArrowIcon className={'ml-2.5 h-2.5 w-2.5'} />
      </button>
      {isConnected && address ? (
        <button
          onClick={openWalletMenu}
          className={clsx(
            'flex cursor-pointer items-center rounded-2lg bg-black py-2 px-7 uppercase tracking-widest text-white md:px-3',
            'dark:bg-white dark:text-black'
          )}
        >
          {compactAddress(address, compactAddressCalcSymbols())}
          <ArrowIcon className="ml-2.5 h-4 w-4" />
        </button>
      ) : (
        <Button onClick={openConnectMenu} className={clsx(isMobile && '!text-xss')}>
          Connect a Wallet
        </Button>
      )}
    </div>
  );
});
