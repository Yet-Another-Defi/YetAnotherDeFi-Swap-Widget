import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { isServer } from '~/helpers/helpers';

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onClick: (event: MouseEvent) => void
) => {
  const savedCallback = useRef(onClick);

  useEffect(() => {
    savedCallback.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (!isServer) {
      const handler = (event: MouseEvent) => {
        const { target } = event;

        if (!(target instanceof Element)) {
          return;
        }

        if (ref.current && ref.current.contains(target)) {
          return;
        }

        savedCallback.current(event);
      };

      window.addEventListener('mousedown', handler);

      return () => {
        window.removeEventListener('mousedown', handler);
      };
    }
  }, [ref]);
};
