import { useCallback } from 'react';

import { isServer } from '~/helpers/helpers';

export enum STORAGE_KEYS {
  CONNECTED = 'yad_connected',
  FROM_AMOUNT = 'yad_fromAmount',
  CUSTOM_TOKENS = 'custom_tokens',
  SETTINGS = 'yad_settings',
}

type useLocalStorageReturn = [string | undefined, (value?: any) => void];

export const useLocalStorage = (key: STORAGE_KEYS): useLocalStorageReturn => {
  const storage = !isServer && window?.localStorage ? localStorage : null;

  const value = storage?.getItem(key) || null;

  const setValue = useCallback(
    (value?: any) => {
      if (value) {
        let str;
        if (typeof value === 'string') {
          str = value;
        } else {
          str = JSON.stringify(value);
        }

        storage?.setItem(key, str);
      } else {
        storage?.removeItem(key);
      }
    },
    [key, storage]
  );

  return [value ?? undefined, setValue];
};
