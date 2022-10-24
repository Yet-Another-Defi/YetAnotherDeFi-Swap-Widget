import React from 'react';
import { observer } from 'mobx-react';
import { Button } from '~/components/Button';

import { type Token } from '~/objects/tokens';
import { TokenImageWithFallback } from '~/components/TokenImageWithFallback';
import { Loader } from '~/components/Loader';
import { useCustomToken } from './useCustomToken';

interface Props {
  address: string;
  openCustomConfirmation: (token: Token) => void;
}

export const CustomTokenItem: React.FC<Props> = observer(({ address, openCustomConfirmation }) => {
  const { token, error } = useCustomToken(address);

  const openCustomWarning = () => {
    if (token) {
      openCustomConfirmation(token);
    }
  };

  if (!address) {
    return null;
  }

  if (error) {
    return (
      <div className="mt-20 text-center text-2xl text-black/60 dark:text-white/60">
        Nothing found
      </div>
    );
  }

  if (!token) {
    return <Loader />;
  }

  return (
    <div className="flex justify-between py-1.5 text-sm tracking-wide">
      <div className="flex items-center">
        <TokenImageWithFallback token={token} className="mr-2" />
        <div>{token.symbol}</div>
      </div>
      <Button variant="outline" onClick={openCustomWarning}>
        Import
      </Button>
    </div>
  );
});
