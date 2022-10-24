import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { CloseIcon } from '~/components/Icon/CloseIcon';
import { useRootStore } from '~/store/rootStore';

import { SelectNetworkAndWalletModal } from './SelectNetworkAndWalletModal';
import { TransactionModal } from './TransactionModal';
import { BlurBackground } from '../BlurBackground';

export const ModalWatcher: React.FC = observer(() => {
  const { modalStore } = useRootStore();
  const modalContent = useMemo(() => {
    switch (modalStore.currentModal?.type) {
      case 'SelectWallet':
        return <SelectNetworkAndWalletModal />;
      case 'Transaction':
        return <TransactionModal {...modalStore.currentModal?.props} />;
    }
  }, [modalStore.currentModal]);

  useEffect(() => {
    if (modalContent) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalContent]);

  return (
    <AnimatePresence>
      {modalStore.currentModal?.name && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-[5] flex items-center',
            modalStore.currentModal?.position === 'right' && 'justify-end',
            modalStore.currentModal?.position === 'center' && 'justify-center'
          )}
          style={{ overscrollBehavior: 'none' }}
          onClick={modalStore.closeModal}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          key={'modal-content'}
        >
          <BlurBackground className="bg-white/10" />
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={clsx(
              'z-[6] mx-4 w-[730px] rounded-2.5xl bg-white/80 shadow-base p-8 backdrop-blur sm:py-10 sm:px-16 overflow-auto',
              'dark:bg-dark/80 dark:shadow-darkShadow',
              modalStore.currentModal?.styles?.container
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className={clsx(
                  'text-2xl text-black',
                  'dark:text-white',
                  modalStore.currentModal?.styles?.title
                )}
              >
                {modalStore.currentModal?.name}
              </span>
              <CloseIcon
                className={clsx('h-4 w-4 cursor-pointer text-black', 'dark:text-white')}
                onClick={modalStore.closeModal}
              />
            </div>
            {modalContent}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
