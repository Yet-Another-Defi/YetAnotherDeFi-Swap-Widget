import type { RpcError } from 'wagmi';
import { isRpcError } from '~/helpers/helpers';
import { WalletId } from '~/constants';

export class NetworkConnectionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export const getWalletErrorText = (error: Error | RpcError | null, walletId?: WalletId) => {
  const isInternalError =
    !isRpcError(error) ||
    walletId === WalletId.CoinbaseWallet ||
    walletId === WalletId.WalletConnect; // TODO cover errors from Coinbase and WalletConnect after researching. Then remove from isInternalError variable.

  if (isInternalError) {
    return 'Connection error';
  }

  if (walletId === WalletId.MetaMask) {
    switch (error.code) {
      case -32002:
        return 'Metamask already in use, check your plugin. Maybe you started and did not finish the authorization process.';
      default:
        return 'Connection error';
    }
  }
};
