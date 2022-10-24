import { useEffect, useMemo, useRef, useState } from 'react';
import { throttle } from 'lodash';

import { isServer } from '~/helpers/helpers';

export function useWindowSize() {
  const mounted = useRef(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const throttledHandleResize = useMemo(() => {
    return throttle(() => {
      if (mounted.current) {
        setWindowSize({
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        });
      }
    }, 300);
  }, [mounted]);

  useEffect(() => {
    if (!isServer) {
      mounted.current = true;
      window.addEventListener('resize', throttledHandleResize);
      throttledHandleResize();

      return () => {
        mounted.current = false;
        window.removeEventListener('resize', throttledHandleResize);
      };
    }
  }, [throttledHandleResize]);

  return windowSize;
}
