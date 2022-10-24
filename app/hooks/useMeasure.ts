import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

import { isServer } from '~/helpers/helpers';

interface Bounds {
  height: number;
  width: number;
}

export function useMeasure(ref: RefObject<HTMLElement>): Bounds {
  const [bounds, setBounds] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    if (!isServer) {
      function onResize([entry]: ResizeObserverEntry[]) {
        setBounds({
          height: entry.contentRect.height,
          width: entry.contentRect.width,
        });
      }

      const observer = new ResizeObserver(onResize);

      if (ref?.current) {
        observer.observe(ref.current);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [ref]);

  return bounds;
}
