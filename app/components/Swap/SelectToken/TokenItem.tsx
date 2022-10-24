import React from 'react';
import { BigNumber } from 'ethers';
import { Link } from '@remix-run/react';

import type { Token } from '~/objects/tokens';
import { isTokenWithBalance } from '~/helpers/exchange.helpers';
import { formatNumber } from '~/helpers/helpers';
import { getTokenValueStr } from '~/helpers/exchange.helpers';
import { TokenImageWithFallback } from '~/components/TokenImageWithFallback';

interface Props {
  token: Token;
  getLinkUrl: (token: Token) => string;
  setTokenToStore: (token: Token) => void;
  close: () => void;
  isConnected: boolean;
  style?: React.CSSProperties;
}

export const TokenItem: React.FC<Props> = ({
  token,
  style,
  getLinkUrl,
  setTokenToStore,
  close,
  isConnected,
}) => {
  const stringDecimalNumber =
    token && isTokenWithBalance(token)
      ? getTokenValueStr(token, BigNumber.from(token.amount))
      : '0';

  return (
    <Link
      key={token.address}
      className="flex justify-between py-2.5 pr-4 text-sm tracking-wide"
      style={style}
      to={getLinkUrl(token)}
      onClick={() => {
        close();
        setTokenToStore(token);
      }}
    >
      <div className="flex items-center">
        <TokenImageWithFallback token={token} className="mr-2" />
        <div>{token.symbol}</div>
      </div>
      {isConnected ? formatNumber(stringDecimalNumber) : ''}
    </Link>
  );
};
