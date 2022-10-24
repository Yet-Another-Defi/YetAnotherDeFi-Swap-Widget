import type { WalletId } from '~/constants';
import { WALLETS } from '~/constants';

interface IconProps {
  walletId: WalletId;
  className?: string;
}

export const WalletIcon = ({ walletId, ...rest }: IconProps): JSX.Element | null => {
  const SelectedIcon = Object.values(WALLETS).find(({ id }) => id === walletId)?.icon;

  return SelectedIcon ? <SelectedIcon {...rest} /> : null;
};
