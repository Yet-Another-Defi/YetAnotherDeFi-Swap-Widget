import { useReducer, useCallback, createContext } from 'react';
import type { Token } from '~/objects/tokens';

type TokenType = Token | null;

export interface SwapState {
  isCustomConfirmationOpen: boolean;
  isCustomSelectOpen: boolean;
  token: TokenType;
  isSelectTokenOpen: boolean;
  isFromToken: boolean;
  isOpenOptions: boolean;
}

export enum ActionKind {
  OPEN_SETTINGS = 'OPEN_SETTINGS',
  CLOSE_SETTINGS = 'CLOSE_SETTINGS',
  OPEN_SELECT_CUSTOM_TOKEN = 'OPEN_SELECT_CUSTOM_TOKEN',
  CLOSE_SELECT_CUSTOM_TOKEN = 'CLOSE_SELECT_CUSTOM_TOKEN',
  OPEN_CUSTOM_CONFIRMATION = 'OPEN_CUSTOM_CONFIRMATION',
  CLOSE_CUSTOM_TOKEN = 'CLOSE_CUSTOM_TOKEN',
  OPEN_SELECT_TOKEN = 'OPEN_SELECT_TOKEN',
  CLOSE_SELECT_TOKEN = 'CLOSE_SELECT_TOKEN',
}

export type ReturnFunctionsType = {
  openSettings: () => void;
  closeSettings: () => void;
  openSelectCustomToken: () => void;
  openCustomTokenConfirmation: (token: Token) => void;
  closeCustomToken: () => void;
  openSelectToken: (isFromToken: boolean) => void;
  closeSelectToken: () => void;
  closeAll: () => void;
};

const initialState: SwapState = {
  isCustomConfirmationOpen: false,
  isCustomSelectOpen: false,
  token: null,
  isSelectTokenOpen: false,
  isFromToken: false,
  isOpenOptions: false,
};

type Action = {
  type: ActionKind;
  payload?: Partial<SwapState>;
};

const reducer = (state: SwapState, action: Action): SwapState => {
  const { type, payload } = action;

  switch (type) {
    case ActionKind.OPEN_SETTINGS:
      return { ...state, isOpenOptions: true };
    case ActionKind.CLOSE_SETTINGS:
      return { ...state, isOpenOptions: false };
    case ActionKind.OPEN_SELECT_CUSTOM_TOKEN:
      return { ...state, isCustomConfirmationOpen: false, isCustomSelectOpen: true, token: null };
    case ActionKind.CLOSE_SELECT_CUSTOM_TOKEN:
      return { ...state, isCustomConfirmationOpen: false, isSelectTokenOpen: false, token: null };
    case ActionKind.OPEN_CUSTOM_CONFIRMATION:
      return {
        ...state,
        isCustomConfirmationOpen: true,
        isCustomSelectOpen: false,
        token: payload?.token ?? null,
      };

    case ActionKind.CLOSE_CUSTOM_TOKEN:
      return { ...state, isCustomConfirmationOpen: false, isCustomSelectOpen: false, token: null };
    case ActionKind.OPEN_SELECT_TOKEN:
      return { ...state, isFromToken: payload?.isFromToken ?? false, isSelectTokenOpen: true };
    case ActionKind.CLOSE_SELECT_TOKEN:
      return { ...state, isSelectTokenOpen: false };
    default:
      throw new Error(`useSwapReducer error on action: ${type}`);
  }
};

export const useSwapReducer = (): [SwapState, ReturnFunctionsType] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openSettings = useCallback(() => {
    dispatch({ type: ActionKind.OPEN_SETTINGS });
  }, []);

  const closeSettings = useCallback(() => {
    dispatch({ type: ActionKind.CLOSE_SETTINGS });
  }, []);

  const openSelectCustomToken = useCallback(() => {
    dispatch({ type: ActionKind.OPEN_SELECT_CUSTOM_TOKEN });
  }, []);

  const openCustomTokenConfirmation = useCallback((token: Token) => {
    dispatch({ type: ActionKind.OPEN_CUSTOM_CONFIRMATION, payload: { token } });
  }, []);

  const closeCustomToken = useCallback(() => {
    dispatch({ type: ActionKind.CLOSE_CUSTOM_TOKEN });
  }, []);

  const openSelectToken = useCallback((isFromToken: boolean) => {
    dispatch({ type: ActionKind.OPEN_SELECT_TOKEN, payload: { isFromToken } });
  }, []);

  const closeSelectToken = useCallback(() => {
    dispatch({ type: ActionKind.CLOSE_SELECT_TOKEN });
  }, []);

  const closeAll = useCallback(() => {
    dispatch({ type: ActionKind.CLOSE_CUSTOM_TOKEN });
    dispatch({ type: ActionKind.CLOSE_SELECT_TOKEN });
    dispatch({ type: ActionKind.CLOSE_SETTINGS });
  }, []);

  return [
    state,
    {
      openSettings,
      closeSettings,
      openSelectCustomToken,
      openCustomTokenConfirmation,
      closeCustomToken,
      openSelectToken,
      closeSelectToken,
      closeAll,
    },
  ];
};

export const SwapContext = createContext({
  state: initialState,
  actions: {
    openSettings: () => {},
    closeSettings: () => {},
    openSelectCustomToken: () => {},
    openCustomTokenConfirmation: (_: Token) => {},
    closeCustomToken: () => {},
    openSelectToken: (_: boolean) => {},
    closeSelectToken: () => {},
    closeAll: () => {},
  },
});

export const SwapStateProvider = SwapContext.Provider;
