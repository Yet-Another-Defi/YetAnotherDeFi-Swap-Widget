import { useMemo } from 'react';
import type { Chain } from 'wagmi';
import { createClient, configureChains, chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const BSC_CHAIN: Chain = {
  id: 56,
  name: 'Binance Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://bsc-dataseed1.binance.org',
  },
  blockExplorers: {
    default: {
      name: 'Bscscan',
      url: 'https://bscscan.com',
    },
  },
  multicall: {
    address: '0x61A94c696917406B5737B8Fa4226Dd724e31080D',
    blockCreated: 20054518,
  },
};

const AVALANCHE_CHAIN: Chain = {
  id: 43114,
  name: 'Avalanche',
  network: 'avalanche',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    default: 'https://api.avax.network/ext/bc/C/rpc',
  },
  blockExplorers: {
    default: {
      name: 'AvaxScan',
      url: 'https://snowtrace.io/',
    },
  },
  multicall: {
    address: '0x61A94c696917406B5737B8Fa4226Dd724e31080D',
    blockCreated: 18068417,
  },
};

const FANTOM_CHAIN: Chain = {
  id: 250,
  name: 'Fantom Opera',
  network: 'fantom',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.ftm.tools',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://ftmscan.com',
    },
  },
  multicall: {
    address: '0x61A94c696917406B5737B8Fa4226Dd724e31080D',
    blockCreated: 43793683,
  },
};

// fill out address and blockCreated fields for testing local contracts. You need to send requests with chainId 1337

const TEST_LOCALHOST_NETWORK = {
  ...chain.localhost,
  multicall: {
    address: '0x5bC1CcF0Ebb16D33cD7F08e55d5CF9E82Dc4a7A6',
    blockCreated: 20054164,
  },
};

export function useClientWallet() {
  const client = useMemo(() => {
    const { chains, provider, webSocketProvider } = configureChains(
      [
        chain.mainnet,
        chain.optimism,
        chain.polygon,
        BSC_CHAIN,
        AVALANCHE_CHAIN,
        FANTOM_CHAIN,
        TEST_LOCALHOST_NETWORK,
      ],
      [
        publicProvider({ priority: 1 }),
        jsonRpcProvider({
          priority: 2,
          rpc: (chain) => {
            return { http: `/api/rpc/${chain.id}` };
          },
        }),
      ]
    );

    return createClient({
      autoConnect: true,
      connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: 'yad',
          },
        }),
        new WalletConnectConnector({
          chains,
          options: {
            qrcode: true,
          },
        }),
        new InjectedConnector({
          chains,
          options: {
            name: 'Injected',
            shimDisconnect: true,
          },
        }),
      ],
      provider,
      webSocketProvider,
    });
  }, []);

  return client;
}
