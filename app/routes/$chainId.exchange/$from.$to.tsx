import { useCallback, useEffect, useRef } from 'react';
import { json } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useParams } from '@remix-run/react';
import { observer } from 'mobx-react';
import { useAccount, useBalance, useNetwork, useProvider, useSigner } from 'wagmi';
import clsx from 'clsx';

import type { Token } from '~/objects/tokens';
import { getTokenBySymbol } from '~/objects/tokens';
import { useRootStore } from '~/store/rootStore';
import { getTokens } from '~/data/tokens';
import { UnsupportedNetwork } from '~/components/UnsupportedNetwork';
import { MobileBottomMenu } from '~/components/MobileBottomMenu';
import { isSupportedNetwork } from '~/helpers/helpers';
import { useIsMounted, useWindowSize, useCheckUrl, useLoadTokens, useOnlineStatus } from '~/hooks';
import { AnimateHeight } from '~/components/AnimateHeight';
import { Swap } from '~/components/Swap/Swap';
import { ScreenSize } from '~/constants';
import { NetworkError } from '~/components/NetworkError';
import { NetworkConnectionError } from '~/utils/errors';
import type { LoaderFunctionArgs } from '~/types/loader';

export const loader = async ({ params, context: { logger }, request }: LoaderFunctionArgs) => {
  let { from, to, chainId } = params;

  if (!chainId || !isSupportedNetwork(chainId)) {
    return json('Does not have required param CHAIN_ID', { status: 400 });
  }

  let tokensPair;

  try {
    if (from && to) {
      tokensPair = await getTokens(logger, request, { chainId, symbols: [from, to] });
    }
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      request: request.url,
      original_url: request.url,
    });
    return new Response('Failed to load from to', { status: 500 });
  }

  return {
    from,
    to,
    tokensPair,
  };
};

export const meta: MetaFunction = ({ data }) => {
  const { from, to } = data;

  const upperFrom = from?.toUpperCase();
  const toUpper = to?.toUpperCase();

  const title = `${upperFrom} to ${toUpper} Exchange - Convert ${upperFrom} to ${toUpper} with Lowest Fees.`;
  const description = `We offer the best ${upperFrom} to ${toUpper} exchange rates. Swap your ${upperFrom} for ${toUpper} with DEX on Yetanotherdefi.`;

  return {
    title,
    description,
  };
};

export function CatchBoundary() {
  return <NetworkError />;
}

export function ErrorBoundary() {
  return <NetworkError />;
}

interface PageData {
  from: string;
  to: string;
  tokensPair: Record<string, Token>;
}

function Index() {
  const navigate = useNavigate();
  const { chainId } = useParams();
  const isMounted = useIsMounted();
  const { appStore, web3Store } = useRootStore();
  const isOnline = useOnlineStatus();

  const { from, to, tokensPair } = useLoaderData<PageData>();

  const { customTokens } = useLoadTokens();

  const { width } = useWindowSize();

  const getTokenBySymbolMemo = useCallback(
    (symbol) => {
      if (chainId) {
        return getTokenBySymbol({
          ...tokensPair,
          ...customTokens,
        })(symbol);
      }
    },
    [chainId, customTokens, tokensPair]
  );

  const fromToken = getTokenBySymbolMemo(from);

  const toToken = getTokenBySymbolMemo(to);

  useCheckUrl({ fromToken, toToken, chainId });

  useEffect(() => {
    if (fromToken && toToken) {
      appStore.setFromToken(fromToken);
      appStore.setToToken(toToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken?.address, toToken?.address]);

  const { chain } = useNetwork();
  const { address } = useAccount();
  const provider = useProvider({ chainId: chainId ? +chainId : 1 });
  const { data: signer } = useSigner();
  const { data: balance } = useBalance({
    addressOrName: address,
    chainId: +appStore.chainId,
    watch: true,
  });
  const prevNetwork = useRef(chain?.id);

  //init web3Store from wagmi hooks
  useEffect(() => {
    web3Store.setProvider(provider);

    if (signer && address && balance && chain?.id) {
      web3Store.setSigner(signer);
      web3Store.setAccountAddress(address);
      web3Store.setAccountBalance(balance.value);
      web3Store.setProviderChainId(chain.id);

      isSupportedNetwork(`${chain.id}`) &&
        prevNetwork.current !== chain.id &&
        navigate(`/${chain.id}/exchange/${from}/${to}`);
      prevNetwork.current = chain.id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, signer, address, balance, web3Store, chain?.id, navigate]);

  useEffect(() => {
    if (chainId && isSupportedNetwork(chainId)) {
      appStore.setChainId(chainId);
      web3Store.setProviderChainId(+chainId);
    }
  }, [appStore, chainId, web3Store]);

  useEffect(() => {
    if (!isOnline) {
      throw new NetworkConnectionError();
    }
  }, [isOnline]);

  const isValidNetwork = chainId && +chainId === chain?.id;
  const isUnsupportedNetwork =
    (!isValidNetwork && !!address && isMounted) || !!web3Store.switchNetworkError.error;
  const isValidNetworkOrNotLogin = isMounted && (isValidNetwork || !address);

  return (
    <>
      <AnimateHeight
        isOpen={isUnsupportedNetwork}
        className={clsx('sticky top-[90px] z-[3]', isUnsupportedNetwork && 'mb-8')}
      >
        <UnsupportedNetwork switchNetworkError={web3Store.switchNetworkError} />
      </AnimateHeight>
      <MobileBottomMenu />

      <div
        className={clsx(
          'relative flex flex-col md:flex-row justify-between min-h-[620px]',
          isValidNetworkOrNotLogin && 'mt-12',
          width < ScreenSize.md && '!mt-4 pb-24'
        )}
      >
        <aside
          className={clsx(
            'z-[2] w-full min-w-[335px] md:w-[40%] md:max-w-[370px] xl:max-w-[413px] mx-auto md:sticky',
            isValidNetworkOrNotLogin && 'md:!top-[128px]'
          )}
        >
          <Swap />
        </aside>
      </div>
    </>
  );
}

export default observer(Index);
