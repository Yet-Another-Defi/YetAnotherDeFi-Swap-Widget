import { Link } from '@remix-run/react';

import { SwitchIcon } from '~/components/Icon/SwitchIcon';
import type { SupportedNetworks } from '~/constants';
import type { Token } from '~/objects/tokens';
import { TokenImageWithFallback } from '../TokenImageWithFallback';

interface Props {
  from: Token;
  to: Token;
  chainId: SupportedNetworks;
  toggleDirection: () => void;
}

export function TokensPair({ from, to, chainId, toggleDirection }: Props) {
  return (
    <div className="relative mt-4 inline-block">
      <div className="relative flex items-center">
        <div className="mr-1.5 flex items-center">
          <TokenImageWithFallback token={from} />
          <TokenImageWithFallback token={to} className="ml-[-5px]" />
        </div>
        <span>
          {from.symbol}/{to.symbol}
        </span>
        <Link
          onClick={toggleDirection}
          className="group relative ml-2 rounded-full p-2"
          to={`/${chainId}/exchange/${to.symbol}/${from.symbol}`}
        >
          <SwitchIcon className="h-[14px] w-[14px] transition-transform  duration-300 group-hover:rotate-[-180deg]" />
        </Link>
      </div>
    </div>
  );
}
