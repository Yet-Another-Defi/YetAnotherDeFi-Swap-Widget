import { formatNumber } from '~/helpers/helpers';
import type { Token } from '~/objects/tokens';

const TOOLTIP_TEXT =
  'This value is calculated by subtracting the transaction fee from your balance. ';
const BALANCE_LOWER_TEXT = 'Currently, your balance is lower than the transaction fee.';

interface Props {
  amount: string;
  token: Token | null;
  isNativeBalanceWithoutFeePositive?: boolean;
}

export const MaxAmountTooltip = ({ amount, token, isNativeBalanceWithoutFeePositive }: Props) => {
  return (
    <div className="w-44 text-xs">
      <div className="mb-2">{`${formatNumber(amount)} ${token?.symbol}`}</div>
      <div>{TOOLTIP_TEXT}</div>
      {!isNativeBalanceWithoutFeePositive && <div>{BALANCE_LOWER_TEXT}</div>}
    </div>
  );
};
