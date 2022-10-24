import { useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

import { isServer } from '~/helpers/helpers';

export const useWindowScroll = (cb: () => void) => {
  const debouncedCB = useMemo(() => {
    return debounce(cb, 300);
  }, [cb]);

  useEffect(() => {
    if (!isServer) {
      window.addEventListener('scroll', debouncedCB, { passive: true });

      return () => {
        window.removeEventListener('scroll', debouncedCB);
      };
    }
  }, [debouncedCB]);
};
