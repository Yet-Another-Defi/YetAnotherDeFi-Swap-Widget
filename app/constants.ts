import type { SettingItem } from '~/store/SettingsStore';
import {
  AvalancheIcon,
  BscIcon,
  EthereumIcon,
  FantomIcon,
  OptimismIcon,
  PolygonIcon,
} from './components/Icon/networks';
import { CoinbaseWalletIcon } from './components/Icon/wallets/CoinbaseWalletIcon';
import { MetamaskIcon } from './components/Icon/wallets/MetamaskIcon';
import { WalletConnectIcon } from './components/Icon/wallets/WalletConnectIcon';

export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

// related to wagmi connectors ids
export enum WalletId {
  MetaMask = 'metaMask',
  WalletConnect = 'walletConnect',
  CoinbaseWallet = 'coinbaseWallet',
}

export enum SupportedNetworks {
  Ethereum = '1',
  BSC = '56',
  Polygon = '137',
  Fantom = '250',
  Avalanche = '43114',
  Optimism = '10',
}

export const NATIVE_TOKEN_TO_WRAPPED = {
  [SupportedNetworks.Ethereum]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [SupportedNetworks.BSC]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [SupportedNetworks.Polygon]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  [SupportedNetworks.Fantom]: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  [SupportedNetworks.Avalanche]: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  [SupportedNetworks.Optimism]: '0x4200000000000000000000000000000000000006',
};

export const TRANSACTION_UNIT_NETWORKS = {
  [SupportedNetworks.Ethereum]: 'Gwei',
  [SupportedNetworks.BSC]: 'Gwei',
  [SupportedNetworks.Polygon]: 'Gwei',
  [SupportedNetworks.Fantom]: 'Gwei',
  [SupportedNetworks.Avalanche]: 'nAVAX',
  [SupportedNetworks.Optimism]: 'Gwei',
};

export const POPULAR_TOKENS_NETWORKS = {
  [SupportedNetworks.Ethereum]: ['ETH', 'USDT', 'USDC', 'DAI', 'WBTC'],
  [SupportedNetworks.BSC]: ['BNB', 'WBNB', 'USDC', 'DAI', 'USDT', 'BTCB'],
  [SupportedNetworks.Polygon]: ['MATIC', 'WMATIC', 'AAVE', 'AGA', 'ANY'],
  [SupportedNetworks.Fantom]: ['FTM', 'WFTM', 'USDC', 'BTC', 'DAI', 'fUSDT'],
  [SupportedNetworks.Avalanche]: ['AVAX', 'WAVAX', 'WETH.e', 'WBTC.e', 'USDT.e', 'USDC.e'],
  [SupportedNetworks.Optimism]: ['ETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'LINK'],
};

export const MULTICALL_CONTRACT_ADDRESSES = {
  [SupportedNetworks.Ethereum]: '0x8d035edd8e09c3283463dade67cc0d49d6868063',
  [SupportedNetworks.BSC]: '0x61A94c696917406B5737B8Fa4226Dd724e31080D',
  [SupportedNetworks.Polygon]: '0x0196e8a9455a90d392b46df8560c867e7df40b34',
  [SupportedNetworks.Fantom]: '0x61A94c696917406B5737B8Fa4226Dd724e31080D',
  [SupportedNetworks.Avalanche]: '0x61A94c696917406B5737B8Fa4226Dd724e31080D',
  [SupportedNetworks.Optimism]: '0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe',
};

export const DEFAULT_TOKEN_PAIRS = {
  [SupportedNetworks.Ethereum]: ['eth', 'dai'],
  [SupportedNetworks.BSC]: ['bnb', 'dai'],
  [SupportedNetworks.Polygon]: ['matic', 'dai'],
  [SupportedNetworks.Fantom]: ['ftm', 'dai'],
  [SupportedNetworks.Avalanche]: ['avax', 'dai.e'],
  [SupportedNetworks.Optimism]: ['eth', 'usdt'],
};

export const NATIVE_TOKEN_COINGECKO_ID = {
  [SupportedNetworks.Ethereum]: 'ethereum',
  [SupportedNetworks.BSC]: 'binancecoin',
  [SupportedNetworks.Polygon]: 'matic-network',
  [SupportedNetworks.Fantom]: 'fantom',
  [SupportedNetworks.Avalanche]: 'avalanche-2',
  [SupportedNetworks.Optimism]: 'ethereum',
};

export const CHAIN_ID_TO_COINGECKO_CHAIN_ID = {
  [SupportedNetworks.Ethereum]: 'ethereum',
  [SupportedNetworks.BSC]: 'binance-smart-chain',
  [SupportedNetworks.Polygon]: 'polygon-pos',
  [SupportedNetworks.Fantom]: 'fantom',
  [SupportedNetworks.Avalanche]: 'avalanche',
  [SupportedNetworks.Optimism]: 'optimistic-ethereum',
};

export const WALLETS = [
  {
    id: WalletId.MetaMask,
    icon: MetamaskIcon,
    name: 'Metamask',
  },
  {
    id: WalletId.WalletConnect,
    icon: WalletConnectIcon,
    name: 'WalletConnect',
  },
  {
    id: WalletId.CoinbaseWallet,
    icon: CoinbaseWalletIcon,
    name: 'Coinbase Wallet',
  },
];

export const NETWORKS = [
  {
    id: SupportedNetworks.Ethereum,
    icon: EthereumIcon,
    nativeToken: 'ETH',
    name: 'Ethereum',
  },
  {
    id: SupportedNetworks.BSC,
    icon: BscIcon,
    nativeToken: 'BNB',
    name: 'BSC',
  },
  {
    id: SupportedNetworks.Avalanche,
    icon: AvalancheIcon,
    nativeToken: 'AVAX',
    name: 'Avalanche',
  },
  {
    id: SupportedNetworks.Polygon,
    icon: PolygonIcon,
    nativeToken: 'MATIC',
    name: 'Polygon',
  },
  {
    id: SupportedNetworks.Fantom,
    icon: FantomIcon,
    nativeToken: 'FTM',
    name: 'Fantom',
  },
  {
    id: SupportedNetworks.Optimism,
    icon: OptimismIcon,
    nativeToken: 'ETH',
    name: 'Optimism',
  },
];

export type Wallet = typeof WALLETS[0];

export enum ScreenSize {
  xs = 420,
  sm = 640,
  md = 768,
  lg = 1024,
  xl = 1028,
}

export const SLIPPAGES: SettingItem[] = [
  {
    type: '0.5',
    value: 0.5,
  },
  {
    type: '1',
    value: 1,
  },
  {
    type: '3',
    value: 3,
  },
];

export enum THEME_TYPES {
  LIGHT = 'LIGHT_THEME',
  DARK = 'DARK_THEME',
}

export enum GasPriceType {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  FAST = 'FAST',
  CUSTOM = 'CUSTOM',
}

export type CustomTransactionConfirmationTimes = {
  fastest: string;
  betweenMediumAndFast: string;
  betweenLowAndMedium: string;
  slowest: string;
};

export type TransactionConfirmationTimes = { [K in GasPriceType]?: number };

export const TRANSACTION_CONFIRMATION_TIMES: Record<
  SupportedNetworks,
  TransactionConfirmationTimes
> = {
  [SupportedNetworks.Ethereum]: {
    FAST: 12,
    MEDIUM: 24,
    LOW: 60,
  },
  [SupportedNetworks.BSC]: {
    FAST: 3,
    MEDIUM: 6,
    LOW: 12,
  },
  [SupportedNetworks.Polygon]: {
    FAST: 2,
    MEDIUM: 4,
    LOW: 8,
  },
  [SupportedNetworks.Fantom]: {
    FAST: 2,
    MEDIUM: 4,
    LOW: 8,
  },
  [SupportedNetworks.Avalanche]: {
    MEDIUM: 3,
  },
  [SupportedNetworks.Optimism]: {
    MEDIUM: 1,
  },
};

export const CUSTOM_TRANSACTION_CONFIRMATION_TIMES: {
  [K in SupportedNetworks]?: CustomTransactionConfirmationTimes;
} = {
  [SupportedNetworks.Ethereum]: {
    fastest: '< 12 sec',
    betweenMediumAndFast: '~ 24 sec',
    betweenLowAndMedium: '~ 60 sec',
    slowest: '> 72 sec',
  },
  [SupportedNetworks.BSC]: {
    fastest: '< 3 sec',
    betweenMediumAndFast: '~ 6 sec',
    betweenLowAndMedium: '~ 12 sec',
    slowest: '> 15 sec',
  },
  [SupportedNetworks.Polygon]: {
    fastest: '< 2 sec',
    betweenMediumAndFast: '~ 4 sec',
    betweenLowAndMedium: '~ 8 sec',
    slowest: '> 10 sec',
  },
  [SupportedNetworks.Fantom]: {
    fastest: '< 2 sec',
    betweenMediumAndFast: '~ 4 sec',
    betweenLowAndMedium: '~ 8 sec',
    slowest: '> 10 sec',
  },
};
export const THEMES = [
  {
    value: THEME_TYPES.LIGHT,
    title: 'Light',
  },
  {
    value: THEME_TYPES.DARK,
    title: 'Dark',
  },
];
