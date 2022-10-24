import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react';
import clsx from 'clsx';

import { useRootStore } from '~/store/rootStore';
import { SearchIcon } from '../../Icon/SearchIcon';
import type { Token } from '~/objects/tokens';
import { CustomTokenItem } from './CustomTokenItem';
import { TokenItem } from './TokenItem';
import { CloseIcon } from '~/components/Icon/CloseIcon';

export interface SelectCustomTokenProps {
  closeCustom: () => void;
  closeAll: () => void;
  getLinkUrl: (token: Token) => string;
  setTokenToStore: (token: Token) => void;
  openCustomConfirmation: (token: Token) => void;
}

export const SelectCustomToken: React.FC<SelectCustomTokenProps> = observer(
  ({ closeCustom, closeAll, getLinkUrl, setTokenToStore, openCustomConfirmation }) => {
    const { appStore, web3Store } = useRootStore();

    const [tokenAddress, setTokenAddress] = useState('');

    const foundToken = appStore.tokensArray.find(
      (token) => token.address.toLowerCase() === tokenAddress.toLowerCase()
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={clsx('absolute inset-0 z-[5] rounded-[20px] bg-white py-7 px-5', 'dark:bg-dark')}
      >
        <div className="mb-5 flex justify-between">
          <h5 className="text-[26px] leading-8">Select Token</h5>
          <button onClick={closeCustom}>
            <CloseIcon
              className={clsx(
                'h-5 w-5 text-black transition-transform duration-300 hover:rotate-[-90deg]',
                'dark:text-white'
              )}
            />
          </button>
        </div>
        <div
          className={clsx(
            'mb-[25px] flex items-center rounded-2lg border border-black/5 px-4 py-[13px] shadow-sm',
            'dark:border-lightBlack'
          )}
        >
          <SearchIcon className={clsx('mr-2 h-4 w-4 text-black/20', 'dark:text-white/20')} />
          <input
            onChange={(e) => {
              setTokenAddress(e.target.value);
            }}
            value={tokenAddress}
            className={clsx(
              'w-full text-sm font-normal leading-none text-black bg-white outline-none placeholder:text-black/20',
              'dark:text-white dark:placeholder:text-white/20 dark:bg-dark'
            )}
            type="text"
            placeholder="Paste an address"
          />
        </div>

        {foundToken ? (
          <TokenItem
            token={foundToken}
            getLinkUrl={getLinkUrl}
            setTokenToStore={setTokenToStore}
            isConnected={!!web3Store.accountAddress}
            close={closeAll}
          />
        ) : (
          <CustomTokenItem address={tokenAddress} openCustomConfirmation={openCustomConfirmation} />
        )}
      </motion.div>
    );
  }
);
