import { observer } from 'mobx-react';
import clsx from 'clsx';

import { AnimateHeight } from '~/components/AnimateHeight';
import { NetworkIcon } from '~/components/Icon/networks';
import type { SupportedNetworks } from '~/constants';
import { NETWORKS } from '~/constants';
import { useSwitchNetworkRollback } from '~/hooks';
import { MenuState } from './constants';
import { TitleClose } from './TitleClose';

interface Props {
  menuState: MenuState;
  closeSelect: () => void;
}

export const Network: React.FC<Props> = observer(({ menuState, closeSelect }) => {
  const { switchNetworkWithRollback, changeNetwork } = useSwitchNetworkRollback();

  const onSelect = async (chainId: SupportedNetworks) => {
    changeNetwork(chainId);
    switchNetworkWithRollback?.(+chainId);
    closeSelect();
  };

  return (
    <AnimateHeight
      isOpen={menuState === MenuState.network}
      className={clsx('flex flex-col text-black', 'dark:text-white')}
    >
      <TitleClose closeSelect={closeSelect}>Networks</TitleClose>
      <div className="flex flex-wrap justify-between gap-y-1.5">
        {NETWORKS.map((network) => (
          <button
            className={clsx(
              'flex w-[47%] items-center rounded-2lg border-black/40 border px-4 py-2',
              'dark:border-white/40'
            )}
            key={network.id}
            onClick={() => {
              onSelect(network.id);
            }}
          >
            <span
              className={clsx(
                'mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/10',
                'dark:bg-white/10'
              )}
            >
              <NetworkIcon networkId={network.id} />
            </span>
            {network.name}
          </button>
        ))}
      </div>
    </AnimateHeight>
  );
});
