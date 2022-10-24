import React, { useCallback, useMemo, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import { observer } from 'mobx-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import { useRootStore } from '~/store/rootStore';
import { SearchIcon } from '../../Icon/SearchIcon';
import type { Token } from '~/objects/tokens';
import type { TokenWithBalance } from '~/helpers/exchange.helpers';
import { TokenList } from './TokenList';
import { CustomTokenItem } from './CustomTokenItem';
import { PopularTokens } from './PopularTokens';
import { CloseIcon } from '~/components/Icon/CloseIcon';
import { useGetBalances } from '~/hooks';
import { Loader } from '~/components/Loader';

export interface SelectTokenProps {
  getLinkUrl: (token: Token) => string;
  setTokenToStore: (token: Token) => void;
  closeSelect: () => void;
  openSelectCustomToken: () => void;
  openCustomConfirmation: (token: Token) => void;
}

export const SelectToken: React.FC<SelectTokenProps> = observer(
  ({ getLinkUrl, setTokenToStore, closeSelect, openSelectCustomToken, openCustomConfirmation }) => {
    const { web3Store, appStore, swapStore } = useRootStore();

    useGetBalances();

    const tokens = appStore.tokensArray;

    const [filterValue, setFilterValue] = useState('');
    const isFilterValueAddress = useMemo(() => isAddress(filterValue), [filterValue]);

    const filterToken = useCallback(
      (token: Token | TokenWithBalance) => {
        if (isFilterValueAddress && filterValue) {
          return token.address.toUpperCase() === filterValue.toUpperCase();
        }
        if (filterValue) {
          return token.symbol.toUpperCase().includes(filterValue.toUpperCase());
        }
        return true;
      },
      [isFilterValueAddress, filterValue]
    );

    const openCustom = useCallback(() => {
      setFilterValue('');
      openSelectCustomToken();
    }, [openSelectCustomToken]);

    const tokenListWithBalances = useMemo(() => {
      let tokensWithBalances: TokenWithBalance[] = [];

      const isTokensRecieved =
        swapStore?.tokenBalances && Object.values(swapStore.tokenBalances).length > 0;

      if (tokens.length && isTokensRecieved) {
        Object.entries(appStore.tokensByCurrentChainId).forEach(([tokenAddress, token]) => {
          tokensWithBalances.push({
            ...token,
            amount: swapStore.tokenBalances[tokenAddress],
          });
        });
      }

      return tokensWithBalances;
    }, [appStore.tokensByCurrentChainId, tokens, swapStore?.tokenBalances]);

    const filteredTokens = useMemo(() => {
      //without account
      if (!web3Store.accountAddress || !tokenListWithBalances.length) {
        return tokens.filter(filterToken);
      }
      //account connected
      if (tokenListWithBalances.length > 0) {
        return tokenListWithBalances
          .filter(filterToken)
          .sort((tokenA, tokenB) => +tokenB.amount - +tokenA.amount);
      }

      return [];
    }, [tokenListWithBalances, tokens, filterToken, web3Store?.accountAddress]);

    const isSearchByAddress = isFilterValueAddress && !filteredTokens.length;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={clsx(
          'absolute inset-0 z-[5] rounded-[20px] bg-white py-7 px-5 text-black',
          'dark:bg-dark dark:text-white'
        )}
      >
        <div className="mb-5 flex justify-between">
          <h5 className="text-[26px] leading-8">Select Token</h5>
          <button onClick={closeSelect}>
            <CloseIcon
              className={clsx(
                'h-5 w-5 text-black transition-transform duration-300 hover:rotate-[-90deg]',
                'dark:text-white '
              )}
            />
          </button>
        </div>
        <div
          className={clsx(
            'flex items-center rounded-2lg border border-black/5 px-4 py-[13px] shadow-sm',
            'dark:border-lightBlack'
          )}
        >
          <SearchIcon className={clsx('mr-2 h-4 w-4 text-black/20', 'dark:text-white/20')} />
          <input
            onChange={(e) => {
              setFilterValue(e.target.value);
            }}
            value={filterValue}
            className={clsx(
              'w-full text-sm font-normal leading-none text-black bg-white  outline-none placeholder:text-black/20',
              'dark:text-white dark:bg-dark dark:placeholder:text-white/20'
            )}
            type="text"
            placeholder="Type a token name or paste address"
          />
        </div>
        {appStore.isTokensLoading ? (
          <div className="w-10 absolute top-[50%] left-[50%] translate-x-[-50%]">
            <Loader />
          </div>
        ) : (
          <>
            <PopularTokens
              tokens={tokens}
              getLinkUrl={getLinkUrl}
              closeSelect={closeSelect}
              chainId={appStore.chainId}
              setTokenToStore={setTokenToStore}
            />
            {isSearchByAddress ? (
              <CustomTokenItem
                address={filterValue}
                openCustomConfirmation={openCustomConfirmation}
              />
            ) : (
              <TokenList
                tokens={filteredTokens}
                getLinkUrl={getLinkUrl}
                setTokenToStore={setTokenToStore}
                openSelectCustomToken={openCustom}
                closeSelect={closeSelect}
                isConnected={!!web3Store.accountAddress}
              />
            )}
          </>
        )}
      </motion.div>
    );
  }
);
