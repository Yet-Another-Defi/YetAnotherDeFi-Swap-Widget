import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { BigNumber } from 'ethers';

import type { Token } from '~/objects/tokens';
import { getTokenValueBigInt, getTokenValueStr } from '~/helpers/exchange.helpers';
import type { Route } from '~/routes/api/route.$chainId.$from.$to';
import type { RootStore } from '~/store/rootStore';
import { formatNumber } from '~/helpers/helpers';
import { NATIVE_TOKEN_ADDRESS, SupportedNetworks } from '~/constants';

export interface InitialState {
  fromAmount?: string;
  chainId?: SupportedNetworks;
}

interface SwapParams {
  amountOut?: string;
  callData?: string;
  routes?: Route[];
  gasUnitsConsumed?: number;
  swapContractAddress?: string;
}

const defaultTokens: Record<SupportedNetworks, Record<string, Token>> = {
  [SupportedNetworks.Ethereum]: {},
  [SupportedNetworks.BSC]: {},
  [SupportedNetworks.Optimism]: {},
  [SupportedNetworks.Polygon]: {},
  [SupportedNetworks.Avalanche]: {},
  [SupportedNetworks.Fantom]: {},
};

export class AppStore {
  chainId: SupportedNetworks = SupportedNetworks.Ethereum;
  from: Token | null = null;
  to: Token | null = null;
  fromValueLocked = '0';
  fromValue = '0';
  toValue = '0';
  nativeTokenPrice = 0;
  tokens = defaultTokens;
  callData: string | null = null;
  routes: Route[] = [];
  gasUnitsConsumed: number = 0;
  swapContractAddress: string | null = null;
  isSwapParamsLoading: boolean = false;
  isTokensLoading: boolean = false;
  isToggled: boolean = false;
  isLastChangedFrom: boolean = false;

  constructor(private rs: RootStore, initialState: InitialState) {
    makeObservable(this, {
      chainId: observable,
      from: observable.ref,
      to: observable.ref,
      fromValue: observable,
      fromValueLocked: observable,
      toValue: observable,
      nativeTokenPrice: observable,
      callData: observable.ref,
      tokens: observable.ref,
      routes: observable.ref,
      gasUnitsConsumed: observable,
      isToggled: observable,
      isLastChangedFrom: observable,
      isSwapParamsLoading: observable,
      isTokensLoading: observable,
      swapContractAddress: observable,
      fromValueBig: computed,
      toValueBig: computed,
      tokensArray: computed,
      tokensByCurrentChainId: computed,
      setSwapParams: action.bound,
      setFromToken: action.bound,
      setToToken: action.bound,
      setFromValue: action.bound,
      setFromValueLocked: action.bound,
      setTokens: action.bound,
      setNativeTokenPrice: action.bound,
      setCallData: action.bound,
      setToValue: action.bound,
      setChainId: action.bound,
      toggleDirection: action.bound,
      setIsSwapParamsLoading: action.bound,
      setIsTokensLoading: action.bound,
      addCustomToken: action.bound,
    });

    this.fromValue = initialState.fromAmount || '1';
    this.fromValueLocked = initialState.fromAmount || '1';
    this.chainId = initialState?.chainId || SupportedNetworks.Ethereum;

    reaction(
      () => this.rs.modalStore.currentModal,
      () => {
        this.isToggled = false;
      }
    );
  }

  get tokensByCurrentChainId() {
    return this.tokens[this.chainId];
  }

  get fromValueBig(): BigNumber {
    if (this.from && +this.fromValue !== 0) {
      return getTokenValueBigInt(this.from, this.fromValue);
    }

    return BigNumber.from(0);
  }

  get toValueBig() {
    if (this.to && +this.toValue !== 0) {
      return getTokenValueBigInt(this.to, this.toValue);
    }

    return BigNumber.from(0);
  }

  get tokensArray(): Token[] {
    return Object.values(this.tokensByCurrentChainId);
  }

  addCustomToken(token: Token) {
    const newTokens = {
      ...this.tokens,
      [this.chainId]: {
        [token.address]: token,
        ...this.tokensByCurrentChainId,
      },
    };

    this.tokens = newTokens;
  }

  setSwapParams(data: SwapParams) {
    this.callData = data.callData ?? null;
    this.routes = data.routes ?? [];
    this.gasUnitsConsumed = data.gasUnitsConsumed || 0;
    this.swapContractAddress = data.swapContractAddress ?? null;

    if (this.to?.address && data.amountOut) {
      this.toValue = getTokenValueStr(this.to, BigNumber.from(data.amountOut));
    }
  }

  setFromToken(token: Token) {
    if (token.address === this.from?.address && token.address !== NATIVE_TOKEN_ADDRESS) {
      return;
    }
    if (token.address === this.to?.address) {
      this.to = this.from;
    }
    this.from = token;
  }

  setToToken(token: Token) {
    if (token.address === this.to?.address) {
      return;
    }
    if (token.address === this.from?.address) {
      this.from = this.to;
    }
    this.to = token;
  }

  toggleDirection() {
    this.isToggled = true;
    const buf = this.from;

    this.from = this.to;
    this.to = buf;
    this.isLastChangedFrom = !this.isLastChangedFrom;

    if (this.fromValue === '0') {
      return;
    }

    if (this.isLastChangedFrom) {
      this.fromValue = formatNumber(this.toValue, 5, '');
      return;
    }

    this.fromValue = this.fromValueLocked;
  }

  setIsSwapParamsLoading(isSwapParamsLoading: boolean) {
    this.isSwapParamsLoading = isSwapParamsLoading;
  }

  setIsTokensLoading(isTokensLoading: boolean) {
    this.isTokensLoading = isTokensLoading;
  }

  setFromValue(value: string) {
    if (!this.from) {
      return;
    }
    this.fromValue = value;
  }

  setFromValueLocked(value: string) {
    if (!this.from) {
      return;
    }
    this.isLastChangedFrom = false;
    this.fromValueLocked = value;
  }

  setToValue(value: string) {
    if (!this.to) {
      return;
    }
    this.toValue = value;
  }

  setTokens(tokens: Record<string, Token>) {
    const newTokens = {
      ...this.tokens,
      [this.chainId]: tokens,
    };

    this.tokens = newTokens;
  }

  setNativeTokenPrice(price: number) {
    this.nativeTokenPrice = price;
  }

  setCallData(data: string | null) {
    this.callData = data;
  }

  setChainId(chainId: SupportedNetworks) {
    this.chainId = chainId;
  }
}
