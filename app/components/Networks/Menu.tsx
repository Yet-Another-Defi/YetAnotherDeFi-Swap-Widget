import clsx from 'clsx';

import { NetworkIcon } from '~/components/Icon/networks';
import { type SupportedNetworks, NETWORKS } from '~/constants';

interface Props {
  onSelect: (chainId: SupportedNetworks) => void;
}

export function Menu({ onSelect }: Props) {
  return (
    <div
      className={clsx(
        'top-full left-0 z-[2] w-full rounded-2.5xl border border-black/5 bg-white p-4 md:absolute md:mt-3',
        'dark:bg-black dark:border-white/5 dark:shadow-lightDarkShadow'
      )}
    >
      <div className="text-sm">
        <div className={clsx('grid grid-cols-2 text-black md:block', 'dark:text-white')}>
          {NETWORKS.map((network) => {
            return (
              <button
                className={clsx(
                  'flex items-center hover:bg-lightGray rounded-full w-full mb-2.5 py-px text-sm',
                  'dark:hover:bg-lightBlack'
                )}
                key={network.id}
                onClick={() => {
                  onSelect(network.id);
                }}
              >
                <div className="mr-[5px] flex h-[25px] w-[25px] items-center justify-center rounded-full">
                  <NetworkIcon networkId={network.id} />
                </div>
                {network.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
