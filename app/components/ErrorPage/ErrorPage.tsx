import { useState, useEffect } from 'react';
import clsx from 'clsx';

import { AnimateHeight } from '~/components/AnimateHeight';
import { isServer } from '~/helpers/helpers';
import { useOnlineStatus } from '~/hooks';

interface Props {
  error: Error;
}

export function ErrorPage({ error }: Props): JSX.Element {
  const isOnline = useOnlineStatus();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const reload = () => {
    window.location.reload();
  };
  // TODO check https://github.com/remix-run/remix/issues/1032 and fix styled-compontns problem
  // page reloading on a popstate event is created for case when styled components fail after the app crash and user go back using browser's back button.
  useEffect(() => {
    if (!isServer) {
      window.addEventListener('popstate', reload);
      return () => {
        window.removeEventListener('popstate', reload);
      };
    }
  }, []);

  return (
    <div className="relative mx-auto min-h-screen max-w-[1400px] bg-white px-5">
      <div className="mx-auto h-[300px] w-[100%] max-w-[800px] bg-[url('/images/error-bg.png')] bg-contain bg-center bg-no-repeat lg:mt-[-50px] lg:h-[660px]" />
      <div className="flex h-full flex-col items-center justify-center lg:mt-[-200px]">
        <div className="text-center text-2xl text-black/80">Sorry, something went wrong</div>
        <p className="mt-3 max-w-[380px] text-center text-sm text-black">
          Try reloading the page. We’re working hard to fix YAD for you as soon as possible.
        </p>
        <div className="mt-7 flex">
          <button
            onClick={reload}
            disabled={!isOnline}
            className="rounded-2lg bg-black py-3 px-7 text-xs font-semibold uppercase text-white"
          >
            Reload
          </button>

          <button
            onClick={toggleOpen}
            className={clsx(
              'ml-5 rounded-2lg border border-gray bg-white py-3 px-7 text-xs font-semibold uppercase text-black',
              isOpen && 'text-gray'
            )}
          >
            Details
          </button>
        </div>
        <AnimateHeight
          className="rounded-2x mt-7 mb-10 w-[90%] max-w-[630px] rounded-2xl border border-black/5 bg-white shadow-md"
          isOpen={isOpen}
        >
          <div className="m-8">
            <div className="mb-2.5">Application Error</div>
            <div className="text-xs font-normal">{error.stack}</div>
          </div>
        </AnimateHeight>
      </div>
    </div>
  );
}
