import { useCallback, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { observer } from 'mobx-react';
import { useAccount, useNetwork } from 'wagmi';
import clsx from 'clsx';

import { ClockIcon } from '~/components/Icon/ClockIcon';
import { LinkIcon } from '~/components/Icon/LinkIcon';
import type { Token } from '~/objects/tokens';
import { Button } from '~/components/Button';
import { useRootStore } from '~/store/rootStore';
import { Loader } from '~/components/Loader';
import { NATIVE_TOKEN_ADDRESS, WalletId } from '~/constants';

export interface TransactionModalProps {
  tx?: string;
  text: string;
  token?: Token;
  isApprove?: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = observer(
  ({ tx, text, token, isApprove }) => {
    const {
      web3Store,
      modalStore,
      appStore: { chainId },
    } = useRootStore();
    const [pending, setPending] = useState(false);
    const { connector: activeConnector } = useAccount();

    const isMetamaskConnect = activeConnector?.id === WalletId.MetaMask;

    const { chains } = useNetwork();

    const addToken = useCallback(() => {
      if (token && window.ethereum) {
        setPending(true);
        web3Store.addToken(token).then(() => {
          unstable_batchedUpdates(() => {
            setPending(false);
          });
        });
      }
    }, [token, web3Store]);

    const isTokenAndNotNativeToken =
      token && web3Store.provider && token.address !== NATIVE_TOKEN_ADDRESS;
    const isShowAddTokenButton = isTokenAndNotNativeToken && !isApprove && isMetamaskConnect;

    return (
      <>
        <div
          className={clsx(
            'bg-white shadow-lightBase py-8 text-black rounded-2lg',
            'dark:bg-dark dark:shadow-lightDarkShadow dark:text-white'
          )}
        >
          <div className=" flex flex-col items-center justify-center gap-y-[10px] ">
            <ClockIcon className="h-4 w-4" />
            <div className={clsx('text-black/80', 'dark:text-white/80')}>{text}</div>
          </div>
          {!!tx && (
            <div className="mt-5 flex items-center justify-center text-gray">
              <LinkIcon className="mr-1 h-3 w-3 text-gray" />
              <a
                className="text-sm leading-tight text-gray"
                href={`${
                  chains.find((chain) => chain.id === +chainId)?.blockExplorers?.default.url
                }/tx/${tx}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Explorer
              </a>
            </div>
          )}
        </div>
        <div
          className={clsx(
            'mt-5 flex',
            isTokenAndNotNativeToken ? 'justify-between' : 'justify-center'
          )}
        >
          {isShowAddTokenButton && (
            <Button className="w-[48%]" onClick={addToken} variant="outline">
              {pending ? <Loader /> : `Add ${token.symbol} to Metamask`}
            </Button>
          )}
          <Button
            onClick={() => {
              modalStore.closeModal();
            }}
            className={clsx('w-full', isShowAddTokenButton && 'w-[48%]')}
          >
            OK
          </Button>
        </div>
      </>
    );
  }
);
