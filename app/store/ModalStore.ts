import { action, makeObservable, observable } from 'mobx';

import type { TransactionModalProps } from '~/components/Modal/TransactionModal';

export const enum ModalType {
  SelectWallet = 'SelectWallet',
  Transaction = 'Transaction',
}

type ModalPosition = 'right' | 'center';

interface BaseModal {
  type: ModalType;
  name: string;
  position?: ModalPosition;
  onClose?: () => void;
  styles?: { container?: string; title?: string };
}

interface SelectWalletModal extends BaseModal {
  type: ModalType.SelectWallet;
}

interface TransactionModal extends BaseModal {
  type: ModalType.Transaction;
  props: TransactionModalProps;
}

type Modal = SelectWalletModal | TransactionModal;

export class ModalStore {
  currentModal: Modal | null = null;

  constructor() {
    makeObservable(this, {
      currentModal: observable,
      openModal: action,
      closeModal: action.bound,
    });
  }

  openModal(modal: Modal) {
    if (modal.type === ModalType.SelectWallet) {
      window.gtag?.('event', 'connect_wallet');
    }

    if (!modal.position) {
      modal.position = 'center';
    }

    this.currentModal = modal;
  }

  closeModal() {
    this.currentModal?.onClose?.();
    this.currentModal = null;
  }
}
