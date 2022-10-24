import { useContext, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { observer } from 'mobx-react';
import { useParams } from '@remix-run/react';
import clsx from 'clsx';

import { ArrowIcon } from '~/components/Icon/ArrowIcon';
import { useClickOutside } from '~/hooks/useClickOutside';
import { useWindowSize } from '~/hooks/useWindowSize';
import type { SupportedNetworks } from '~/constants';
import { NETWORKS, ScreenSize } from '~/constants';
import { Menu } from './Menu';
import { NetworkIcon } from '../Icon/networks';
import { useRootStore } from '~/store/rootStore';
import { useIsMounted, useSwitchNetworkRollback } from '~/hooks';
import { SwapContext } from '../Swap/useSwapState';

interface Props {
  className?: string;
}

export const Networks: React.FC<Props> = observer(({ className }) => {
  const isMounted = useIsMounted();
  const { chainId } = useParams();

  const {
    appStore: { chainId: appChainId },
  } = useRootStore();
  const { switchNetworkWithRollback, changeNetwork } = useSwitchNetworkRollback();

  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const {
    actions: { closeAll },
  } = useContext(SwapContext);

  const toggleSelect = (e: MouseEvent) => {
    e.stopPropagation();
    setIsOpen((isOpen) => !isOpen);
  };

  const closeSelect = () => {
    setIsOpen(false);
  };

  const onSelect = async (chainId: SupportedNetworks) => {
    closeAll();
    closeSelect();
    changeNetwork(chainId);
    switchNetworkWithRollback?.(+chainId);
  };

  const { width } = useWindowSize();
  useClickOutside(ref, closeSelect);

  const isOpenDesktop = isOpen && width > ScreenSize.md;

  if (!chainId || !isMounted) {
    return null;
  }

  return (
    <div
      className={clsx('relative rounded-2lg', 'dark:border-dark dark:border', className)}
      ref={ref}
    >
      <button
        onClick={toggleSelect}
        className={clsx(
          'flex cursor-pointer items-center justify-center md:justify-start',
          'h-10 w-[180px] rounded-2lg border border-black/40 px-5 ',
          'text-xs font-semibold uppercase tracking-widest',
          'transition-colors duration-300 hover:bg-black hover:text-white',
          'dark:border-white/40 dark:hover:bg-white dark:hover:text-black',
          isOpenDesktop && 'bg-black text-white dark:bg-white dark:text-black'
        )}
      >
        <span className="mr-2.5 flex h-[25px] w-[25px] items-center justify-center">
          <NetworkIcon networkId={appChainId} />
        </span>

        <span>{NETWORKS.find((network) => network.id === appChainId)?.name}</span>
        <ArrowIcon
          className={clsx(
            'ml-auto h-2.5 w-2.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpenDesktop && <Menu onSelect={onSelect} />}
    </div>
  );
});
