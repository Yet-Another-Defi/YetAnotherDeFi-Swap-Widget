import { NETWORKS } from '~/constants';

interface IconProps {
  networkId: string;
  className?: string;
}

export const NetworkIcon = ({ networkId, ...rest }: IconProps): JSX.Element | null => {
  const SelectedIcon = Object.values(NETWORKS).find(({ id }) => id === networkId)?.icon;

  return SelectedIcon ? <SelectedIcon {...rest} /> : null;
};
