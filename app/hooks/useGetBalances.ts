import { useEffect, useMemo } from 'react';
import { useContractReads, useBalance } from 'wagmi';

import ERC20ABI from '~/abis/ERC20.json';
import { useRootStore } from '~/store/rootStore';
import { NATIVE_TOKEN_ADDRESS } from '~/constants';

export function useGetBalances() {
  const { appStore, web3Store, swapStore } = useRootStore();
  const address = web3Store.accountAddress ?? '';

  const { data: nativeTokenBalance } = useBalance({
    addressOrName: address,
    chainId: +appStore?.chainId,
  });

  const contracts = useMemo(
    () =>
      Object.keys(appStore.tokensByCurrentChainId)
        .map((tokenAddress) => ({
          addressOrName: tokenAddress,
          contractInterface: ERC20ABI,
          functionName: 'balanceOf',
          args: [address],
        }))
        .filter((token) => token.addressOrName !== NATIVE_TOKEN_ADDRESS),
    [appStore.tokensByCurrentChainId, address]
  );

  const { data, isError, isLoading } = useContractReads({
    contracts,
  });

  useEffect(() => {
    const canSetBalancesToStore =
      !isLoading && !isError && data?.length && data?.[0] && web3Store?.accountAddress;

    if (canSetBalancesToStore) {
      let balances = new Map<string, string>();
      balances.set(NATIVE_TOKEN_ADDRESS, nativeTokenBalance?.value.toString() ?? '0');

      contracts.forEach((token, index) => {
        const balance = data?.[index] ? data?.[index].toString() : '0';
        balances.set(token.addressOrName, balance);
      });

      swapStore.setBalances(Object.fromEntries(balances));
    }
  }, [
    contracts,
    data,
    nativeTokenBalance,
    isError,
    isLoading,
    swapStore,
    web3Store?.accountAddress,
  ]);
}
