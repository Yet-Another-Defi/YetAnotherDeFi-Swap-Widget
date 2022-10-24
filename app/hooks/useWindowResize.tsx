import { useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { isServer } from '~/helpers/helpers';

export const useWindowResize = (cb: () => void) => {
  const debouncedCB = useMemo(() => {
    return debounce(cb, 300);
  }, [cb]);

  useEffect(() => {
    if (!isServer) {
      window.addEventListener('resize', debouncedCB);

      return () => {
        window.removeEventListener('resize', debouncedCB);
      };
    }
  }, [debouncedCB]);
};
