import { useCallback, useEffect, useRef } from 'react';

import { useOnlineStatus } from '~/hooks';
import { Button } from '~/components/Button';
import { isIOS, isSafari } from '~/helpers/browser.helpers';

export function NetworkError(): JSX.Element {
  const isOnline = useOnlineStatus();
  const prevOnlineStatus = useRef(true);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    if (isOnline && !prevOnlineStatus.current) {
      reload();
      prevOnlineStatus.current = true;
    } else {
      prevOnlineStatus.current = false;
    }
  }, [isOnline, reload]);

  return (
    <div className="relative mx-auto min-h-screen max-w-[1400px]  px-5">
      <img
        src="/images/error-bg.png"
        alt="error"
        className="mx-auto h-[300px] w-[100%] max-w-[800px] lg:mt-[-50px] lg:h-[660px]"
      />
      <div className="flex h-full flex-col items-center justify-center lg:mt-[-200px]">
        <div className="text-center text-2xl">Connect to the internet</div>
        <p className="mt-3 max-w-[380px] text-center text-sm">
          You're offline. Check your connection.
        </p>
        {!(isIOS || isSafari) && (
          <div className="mt-7 flex">
            <Button
              onClick={reload}
              className="rounded-2lg bg-black py-3 px-7 text-xs font-semibold uppercase"
            >
              Reload
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
