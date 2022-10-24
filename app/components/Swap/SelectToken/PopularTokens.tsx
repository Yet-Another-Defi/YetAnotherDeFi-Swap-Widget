import clsx from 'clsx';
import { Link } from '@remix-run/react';

import type { Token } from '~/objects/tokens';
import type { SupportedNetworks } from '~/constants';
import { POPULAR_TOKENS_NETWORKS } from '~/constants';
import { TokenImageWithFallback } from '~/components/TokenImageWithFallback';

interface Props {
  tokens: Token[];
  getLinkUrl: (token: Token) => string;
  setTokenToStore: (token: Token) => void;
  closeSelect: () => void;
  chainId: SupportedNetworks;
}

export function PopularTokens({
  tokens,
  getLinkUrl,
  setTokenToStore,
  closeSelect,
  chainId,
}: Props): JSX.Element {
  const filteredTokens = tokens.filter((token) =>
    POPULAR_TOKENS_NETWORKS[chainId].includes(token.symbol)
  );

  return (
    <div className="my-4 flex flex-wrap gap-1.5">
      {filteredTokens.map((token) => (
        <Link
          key={token.symbol}
          className={clsx(
            'flex items-center rounded-2xl bg-lightGray py-0.5 pr-2.5 pl-0.5 text-sm text-black/80 md:text-base',
            'dark:bg-lightBlack dark:text-white/80'
          )}
          to={getLinkUrl(token)}
          onClick={() => {
            closeSelect();
            setTokenToStore(token);
          }}
        >
          <TokenImageWithFallback token={token} className="mr-2" />
          {token.symbol}
        </Link>
      ))}
    </div>
  );
}
