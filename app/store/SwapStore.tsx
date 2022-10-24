import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';
import type { ContractTransaction } from 'ethers';
import { BigNumber, ethers, FixedNumber } from 'ethers';
import { toast } from 'react-toastify';

import type { RootStore } from '~/store/rootStore';
import { ModalType } from '~/store/ModalStore';
import { NATIVE_TOKEN_ADDRESS } from '~/constants';
import type { ERC20 } from '~/types/ethers';
import { ERC20__factory } from '~/types/ethers';
import { SuccessIcon } from '~/components/Icon/SuccessIcon';
import { FailedIcon } from '~/components/Icon/FailedIcon';
import { calculateGasLimit } from '~/helpers/exchange.helpers';
import { GasPriceType } from '~/constants';

export interface SettingItem {
  type: string;
  value: number;
}

const ERROR_MESSAGE_DENIED_TRANSACTION = 'User denied transaction signature';

export class SwapStore {
  pending = false;
  tokenApproved = false;
  isCheckingApprove = false;
  isApproveLoading: boolean = false;
  tokenContract: ERC20 | null = null;
  transactionGas = BigNumber.from(0);
  tokenBalance: BigNumber = BigNumber.from(0);
  tokenBalances: Record<string, string> = {};

  constructor(private rs: RootStore) {
    makeObservable(this, {
      tokenBalance: observable,
      tokenBalances: observable.ref,
      tokenApproved: observable,
      tokenContract: observable.ref,
      pending: observable,
      transactionGas: observable,
      isApproved: computed,
      isCheckingApprove: observable,
      isApproveLoading: observable,
      canBeSwapped: computed,
      enoughFunds: computed,
      transactionNativeTokenPrice: computed,
      toAmountWithoutSlippage: computed,
      errorString: computed,
      checkApprove: action.bound,
      swap: action.bound,
      approve: action.bound,
      getBalance: action.bound,
      initTokenContract: action.bound,
    });

    reaction(
      () => {
        return {
          symbol: this.rs.appStore.from?.symbol,
          signer: this.rs.web3Store.signer,
        };
      },
      ({ symbol, signer }) => {
        if (symbol && signer) {
          this.initTokenContract();
        }
      }
    );

    reaction(
      () => this.rs.appStore.swapContractAddress,
      (swapContractAddress) => {
        if (swapContractAddress) {
          this.checkApprove();
        }
      }
    );

    reaction(
      () => this.rs.web3Store.accountBalance,
      async () => {
        const account = await this.rs.web3Store.signer?.getAddress();
        this.getBalance(account);
      }
    );
  }

  get isApproved() {
    return this.tokenApproved || this.rs.appStore.from?.address === NATIVE_TOKEN_ADDRESS;
  }

  get transactionNativeTokenPrice(): BigNumber {
    return this.rs.settingsStore.gasPriceInGwei.mul(this.transactionGas);
  }

  get transactionPrice(): number {
    return FixedNumber.from(this.transactionNativeTokenPrice)
      .mulUnsafe(FixedNumber.fromString(String(this.rs.appStore.nativeTokenPrice)))
      .divUnsafe(FixedNumber.fromString(String(ethers.constants.WeiPerEther)))
      .toUnsafeFloat();
  }

  get canBeSwapped(): boolean {
    const isCustomSlippageNotNull =
      this.rs.settingsStore.slippage.type === 'custom'
        ? !!this.rs.settingsStore.slippageCustomValue
        : true;

    const isCustomGasPriceNotNull =
      this.rs.settingsStore.gasPrice.type === GasPriceType.CUSTOM
        ? !!this.rs.settingsStore.gasCustomValue
        : true;

    return (
      +this.rs.appStore.fromValue > 0 &&
      this.enoughFunds &&
      this.rs.web3Store.checkNetwork &&
      !!this.rs.appStore.routes.length &&
      isCustomSlippageNotNull &&
      isCustomGasPriceNotNull
    );
  }

  get enoughFunds(): boolean {
    const isNativeToken = this.rs.appStore.from?.address === NATIVE_TOKEN_ADDRESS;
    const nativeTokenBalance = this.rs.web3Store.accountBalance;

    if (isNativeToken && nativeTokenBalance) {
      return nativeTokenBalance.gt(
        this.rs.appStore.fromValueBig.add(this.transactionNativeTokenPrice)
      );
    }

    return (
      this.tokenBalance.gt(this.rs.appStore.fromValueBig) &&
      !!this.rs.web3Store.accountBalance?.gt(this.transactionNativeTokenPrice)
    );
  }

  get errorString(): string {
    const isUnusableState = !this.isApproved || +this.rs.appStore.fromValue === 0;
    const isCanAllowanceTransaction =
      this.rs.web3Store.accountBalance?.gt(this.transactionNativeTokenPrice) &&
      !this.isCheckingApprove;

    if (!this.rs.web3Store.accountAddress) {
      return '';
    }

    //error for allow to use
    if (!isCanAllowanceTransaction) {
      return 'Insufficient balance';
    }

    if (isUnusableState) {
      return '';
    }

    if (!this.enoughFunds) {
      return 'Insufficient balance';
    }

    return '';
  }

  async initTokenContract() {
    if (this.rs.web3Store.signer) {
      const from = this.rs.appStore.from;
      const signer = this.rs.web3Store.signer;
      const account = await signer?.getAddress();

      runInAction(() => {
        this.tokenBalance = BigNumber.from(0);
        if (from && from.address !== NATIVE_TOKEN_ADDRESS && signer) {
          this.tokenContract = ERC20__factory.connect(from.address, signer);

          this.checkApprove();
          this.getBalance(account);
        } else {
          this.tokenContract = null;
        }
      });
    }
  }

  async checkApprove() {
    if (
      this.tokenContract &&
      this.rs.appStore.swapContractAddress &&
      this.rs.web3Store.accountAddress
    ) {
      try {
        this.isCheckingApprove = true;
        const approveValue = (await this.tokenContract.allowance(
          this.rs.web3Store.accountAddress,
          this.rs.appStore.swapContractAddress
        )) as BigNumber;

        runInAction(() => {
          this.tokenApproved = !approveValue.isZero();
        });
      } catch (e) {
        console.error('---e', e);
      } finally {
        this.isCheckingApprove = false;
      }
    }
  }

  get toAmountWithoutSlippage(): BigNumber {
    const slippagePercent = ethers.utils.parseUnits(
      this.rs.settingsStore.validSlippage.value.toString(),
      1
    );
    const percent = BigNumber.from(1000).sub(slippagePercent);
    return this.rs.appStore.toValueBig.mul(percent).div(1000);
  }

  async estimateGas() {
    let gas: BigNumber | undefined;

    const isSwapOperationAndWalletConnected =
      this.isApproved && this.rs.appStore.fromValue && this.rs.appStore.routes.length;

    const isApproveOperation =
      this.tokenContract && this.rs.web3Store.signer && this.rs.appStore.fromValue;

    const isCanEstimateGas =
      isSwapOperationAndWalletConnected &&
      this.rs.appStore.from &&
      this.rs.appStore.callData &&
      this.rs.web3Store.provider &&
      this.rs.appStore.swapContractAddress &&
      this.rs.web3Store.accountAddress;

    const fromNativeToken = this.rs.appStore.from?.address === NATIVE_TOKEN_ADDRESS;
    const fromAmount = this.rs.appStore.fromValueBig.toString();

    try {
      if (isCanEstimateGas) {
        gas = await this.rs.web3Store.provider?.estimateGas({
          from: this.rs.web3Store.accountAddress ?? '',
          to: this.rs.appStore.swapContractAddress ?? '',
          data: this.rs.appStore.callData ?? '',
          value: fromNativeToken ? BigNumber.from(fromAmount) : undefined,
        });
      } else if (isApproveOperation) {
        gas = await this.tokenContract?.estimateGas.approve(
          this.rs.appStore.swapContractAddress ?? '',
          ethers.constants.MaxUint256.toString()
        );
      } else {
        //get estimate from back-end
        gas = BigNumber.from(this.rs.appStore.gasUnitsConsumed);
      }
    } catch (error) {
      //fallback to backend
      gas = BigNumber.from(this.rs.appStore.gasUnitsConsumed);
    }

    runInAction(() => {
      if (gas) {
        this.transactionGas = gas;
      }
    });
  }

  async swap() {
    window.gtag?.('event', 'swap');
    if (this.rs.appStore.routes.length) {
      this.pending = true;
      const fromNativeToken = this.rs.appStore.from?.address === NATIVE_TOKEN_ADDRESS;
      const fromAmount = this.rs.appStore.fromValueBig.toString();
      const signer = this.rs.web3Store.signer;

      if (signer && this.rs.appStore.callData && this.rs.appStore.swapContractAddress) {
        try {
          let tx: ContractTransaction | undefined;

          tx = await signer.sendTransaction({
            to: this.rs.appStore.swapContractAddress,
            data: this.rs.appStore.callData,
            value: fromNativeToken ? BigNumber.from(fromAmount) : undefined,
            gasPrice: this.rs.settingsStore.gasPriceInGwei,
            gasLimit: calculateGasLimit(BigNumber.from(this.transactionGas)),
          });

          runInAction(() => {
            window.gtag?.('event', 'swap_tx_submitted');
            this.pending = false;
            this.rs.modalStore.openModal({
              type: ModalType.Transaction,
              name: 'Pending',
              props: {
                tx: tx?.hash,
                text: 'Swap transaction submitted',
                token: this.rs.appStore.to ?? undefined,
              },
            });
          });
          await tx?.wait();

          toast('Swap transaction confirmed', { icon: SuccessIcon });
          window.gtag?.('event', 'swap_tx_confirmed');
        } catch (error: any) {
          console.error(error);
          runInAction(() => {
            //was update balance
            this.pending = false;
          });
          if (error.message.includes('min return') || error.message.includes('MINRET')) {
            toast(
              <div>
                Swap transaction failed:
                <br />
                increase slippage tolerance
              </div>,
              {
                icon: FailedIcon,
              }
            );
            return;
          }
          if (!error.message.includes(ERROR_MESSAGE_DENIED_TRANSACTION)) {
            toast('Swap transaction failed', { icon: FailedIcon });
          }
        }
      }
    }
  }

  async approve() {
    window.gtag?.('event', 'allow_use');
    const from = this.rs.appStore.from;
    const signer = this.rs.web3Store.signer;
    const fromAmount = this.rs.appStore.fromValueBig.toString();
    const isCanApprove = signer && from && this.rs.settingsStore.gasPrice.value > 0;

    if (isCanApprove) {
      try {
        this.isApproveLoading = true;
        const gasPriceParsed = ethers.utils
          .parseUnits(this.rs.settingsStore.gasPrice.value.toString(), 'gwei')
          .toString();
        this.pending = true;

        const data = await fetch(
          `/api/approve/${this.rs.appStore.chainId}/${from?.address}/${fromAmount}/${gasPriceParsed}`
        );

        const { calldata, estimate_gas, gas_price, to } = await data.json();
        console.log(BigNumber.from(estimate_gas));
        const approveTx = await signer?.sendTransaction({
          to,
          data: calldata,
          gasPrice: gas_price,
          gasLimit: calculateGasLimit(BigNumber.from(estimate_gas)),
        });

        runInAction(() => {
          window.gtag?.('event', 'approve_tx_submitted');
          this.pending = false;
          this.rs.modalStore.openModal({
            type: ModalType.Transaction,
            name: 'Pending',
            props: {
              tx: approveTx?.hash,
              text: 'Approval transaction submitted',
              token: from,
              isApprove: true,
            },
          });
        });
        await approveTx?.wait();

        runInAction(() => {
          this.isApproveLoading = false;
          this.tokenApproved = true;
        });
        toast('Approval transaction confirmed', { icon: SuccessIcon });
        window.gtag?.('event', 'approval_tx_confirmed');
      } catch (error: any) {
        runInAction(() => {
          this.isApproveLoading = false;
          this.pending = false;
        });

        if (!error.message.includes(ERROR_MESSAGE_DENIED_TRANSACTION)) {
          toast('Approval transaction failed', { icon: FailedIcon });
        }
        console.error('---e', error);
      }
    }
  }

  async getBalance(account?: string | null) {
    if (!account) {
      return;
    }

    const token = this.rs.appStore.from;

    if (this.tokenContract) {
      try {
        const balance = (await this.tokenContract.balanceOf(account)) as BigNumber;

        runInAction(() => {
          this.tokenBalance = balance;
        });
      } catch (error) {
        console.error('cannot get token balance', token?.symbol, error);
      }
    } else if (token?.address !== NATIVE_TOKEN_ADDRESS) {
      console.error('token without contract', token?.symbol);
    }
  }

  setBalances(balances: Record<string, string>) {
    runInAction(() => {
      this.tokenBalances = balances;
    });
  }
}
