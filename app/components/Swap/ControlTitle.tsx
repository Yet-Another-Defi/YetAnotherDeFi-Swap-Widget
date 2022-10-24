import clsx from 'clsx';

import { useUiSettings } from '~/UiProvider';
import { InfoIcon } from '../Icon/InfoIcon';
import type { ArrowTooltipPosition } from '../Tooltip';
import { Tooltip } from '../Tooltip';

interface Props {
  children: React.ReactNode;
  tooltipText: string;
  arrowPosition?: ArrowTooltipPosition;
  position?: 'right' | 'top';
}

export function ControlTitle({ children, tooltipText, arrowPosition, position = 'top' }: Props) {
  const { isLightTheme } = useUiSettings();

  return (
    <div
      className={clsx(
        'mb-3 flex items-center text-sm font-medium text-black/40',
        'dark:text-white/40'
      )}
    >
      {children}{' '}
      <Tooltip
        className="z-[6] ml-1"
        position={position}
        arrowPosition={arrowPosition}
        content={<div className="w-44 text-xs">{tooltipText}</div>}
        themeColor={isLightTheme ? 'white' : 'black'}
      >
        <InfoIcon className="h-4 w-4 cursor-pointer text-gray" />
      </Tooltip>
    </div>
  );
}
