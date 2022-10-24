import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import { BurgerIcon } from '~/components/Icon/BurgerIcon';
import { CloseIcon } from '~/components/Icon/CloseIcon';
import { useClickOutside } from '~/hooks';
import { BlurBackground } from '~/components/BlurBackground';
import { UISettings } from '~/components/UISettings';

interface Props {
  className?: string;
}

export function Menu({ className }: Props) {
  const ref = useRef(null);

  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const openMobileMenu = useCallback(() => {
    setIsOpenMobile(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeMobileMenu = useCallback(() => {
    if (isOpenMobile) {
      setIsOpenMobile(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpenMobile]);

  useClickOutside(ref, closeMobileMenu);

  return (
    <div className={className}>
      <AnimatePresence>
        {isOpenMobile && (
          <>
            <BlurBackground />
            <motion.div
              key="mobile-menu"
              className={clsx(
                'fixed top-0 z-[4] flex h-screen w-[80%] flex-col bg-white p-4 text-black will-change-right lg:p-8',
                'dark:bg-black p-4 dark:text-white'
              )}
              initial={{ right: '-100%' }}
              animate={{ right: 0 }}
              exit={{ right: '-100%' }}
              transition={{ duration: 0.5 }}
              ref={ref}
            >
              <div className="absolute top-8 right-5 flex items-center justify-end hover:cursor-pointer">
                <CloseIcon className="h-4 w-4" onClick={closeMobileMenu} />
              </div>
              <div className="mt-auto mb-28 px-4">
                <div className="mb-1 text-4xl">Contact us:</div>
                <div className="text-sm">partners@yetanotherdefi.com</div>
              </div>
              <UISettings />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <button onClick={openMobileMenu} className="md:hidden">
        <BurgerIcon className={clsx('h-4 w-4 text-black md:hidden', 'dark:text-white')} />
      </button>
    </div>
  );
}
