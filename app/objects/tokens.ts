import type { SupportedNetworks } from '~/constants';

export interface TokenPool {
  address: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

export interface Token {
  chainId: SupportedNetworks;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export const isToken =
  (tokens: Record<string, Token>) =>
  (symbol?: string): boolean => {
    return !!symbol && Object.values(tokens).some((token) => token.symbol === symbol);
  };

export const getTokenBySymbol =
  (tokens: Record<string, Token>) =>
  (symbol?: string): Token | undefined => {
    return symbol
      ? Object.values(tokens).find((token) => token.symbol.toUpperCase() === symbol.toUpperCase())
      : undefined;
  };
