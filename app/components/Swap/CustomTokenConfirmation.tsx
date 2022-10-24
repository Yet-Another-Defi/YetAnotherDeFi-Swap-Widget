import React from 'react';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react';
import { useNavigate } from '@remix-run/react';
import clsx from 'clsx';

import { CloseIcon } from '~/components/Icon/CloseIcon';
import { type Token } from '~/objects/tokens';
import { WarningIcon } from '~/components/Icon/WarningIcon';
import { Button } from '~/components/Button';
import { STORAGE_KEYS, useLocalStorage } from '~/hooks';
import { useRootStore } from '~/store/rootStore';
import { TokenImageWithFallback } from '../TokenImageWithFallback';

interface Props {
  closeCustom: () => void;
  closeAll: () => void;
  getLinkUrl: (token: Token) => string;
  setTokenToStore: (token: Token) => void;
  token: Token;
}

export const CustomTokenConfirmation: React.FC<Props> = observer(
  ({ closeCustom, closeAll, getLinkUrl, setTokenToStore, token }) => {
    const navigate = useNavigate();
    const { appStore } = useRootStore();

    const [storedCustomTokens, setStoredCustomTokens] = useLocalStorage(STORAGE_KEYS.CUSTOM_TOKENS);

    const confirmTokenImport = () => {
      const tokens = JSON.parse(storedCustomTokens ?? '{}');
      setStoredCustomTokens({
        ...tokens,
        [appStore.chainId]: {
          ...tokens[appStore.chainId],
          [token.address]: token,
        },
      });

      appStore.addCustomToken(token);

      setTokenToStore(token);

      navigate(getLinkUrl(token));

      closeAll();
    };

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
          <h5 className="text-[26px] leading-8">Import a Token</h5>
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
            'mb-5 flex flex-col justify-between overflow-hidden rounded-lg border border-solid border-black/5 py-3.5 px-3.5 shadow-sm',
            'dark:border-lightBlack'
          )}
        >
          <div className="mb-2 flex items-center">
            <TokenImageWithFallback token={token} className="mr-1" />
            <p>{token.name}</p>
          </div>
          <p className="overflow-hidden overflow-ellipsis">{token.address}</p>
        </div>

        <div
          className={clsx(
            'rounded-lg border border-solid border-black/5 p-[15px] shadow-sm mb-[40px]'
          )}
        >
          <div className="mb-[25px] flex items-center">
            <WarningIcon />
            <h6 className="ml-[10px] text-[20px] text-orange">Be careful!</h6>
          </div>
          <p>Token could be created by anyone and be masked as existing one.</p>
          <br />
          <p>If you buy it, you could loose your assets and not return them back.</p>
        </div>

        <Button className="w-full" onClick={confirmTokenImport}>
          Import &amp; confirm
        </Button>
      </motion.div>
    );
  }
);
