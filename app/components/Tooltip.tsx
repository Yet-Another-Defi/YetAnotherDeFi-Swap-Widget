import React, { useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { TooltipArrowIcon } from '~/components/Icon/TooltipArrowIcon';

export type TooltipPosition = 'right' | 'top' | 'bottom' | 'left';
export type ArrowTooltipPosition = 'left' | 'center' | 'right';
export type TooltipTheme = 'gray' | 'white' | 'black';
interface Props {
  position: TooltipPosition;
  content: React.ReactNode;
  appearanceDelay?: number;
  arrowPosition?: ArrowTooltipPosition;
  disabled?: boolean;
  className?: string;
  themeColor?: TooltipTheme;
}

const getTooltipPositionStyles = (
  position: TooltipPosition,
  arrowPosition: ArrowTooltipPosition
) => {
  let styles = '';

  if (position === 'right' || position === 'left') {
    styles = position === 'right' ? 'left-full ml-[7px]' : 'right-full mr-[7px]';
    if (arrowPosition === 'right') {
      styles += ' top-1/4 -translate-y-1/4';
    }
    if (arrowPosition === 'center') {
      styles += ' top-1/2 -translate-y-1/2';
    }
    if (arrowPosition === 'left') {
      styles += ' top-3/4 -translate-y-3/4';
    }
  }

  if (position === 'bottom' || position === 'top') {
    styles = position === 'bottom' ? 'top-full mt-[7px]' : 'bottom-full mb-[7px]';
    if (arrowPosition === 'right') {
      styles += ' left-3/4 -translate-x-3/4';
    }
    if (arrowPosition === 'center') {
      styles += ' left-1/2 -translate-x-1/2';
    }
    if (arrowPosition === 'left') {
      styles += ' left-1/4 -translate-x-1/4';
    }
  }

  return styles;
};

const getArrowPositionStyles = (position: TooltipPosition, arrowPosition: ArrowTooltipPosition) => {
  let styles = '';
  if (position === 'right' || position === 'left') {
    styles = position === 'right' ? '-left-[7px] -rotate-90' : '-right-[7px] rotate-90';
    if (arrowPosition === 'right') {
      styles += ' top-1/4 translate-y-1/4';
    }
    if (arrowPosition === 'center') {
      styles += ' top-1/2 -translate-y-1/2';
    }
    if (arrowPosition === 'left') {
      styles += ' top-3/4 -translate-y-3/4 -mt-1';
    }
  }

  if (position === 'bottom' || position === 'top') {
    styles = position === 'bottom' ? 'bottom-full -mb-px' : 'top-full -mt-px rotate-180';
    if (arrowPosition === 'right') {
      styles += ' left-3/4 -ml-1 -translate-x-3/4';
    }
    if (arrowPosition === 'center') {
      styles += ' left-1/2 -translate-x-1/2';
    }
    if (arrowPosition === 'left') {
      styles += ' left-1/4 ml-1.5 -translate-x-1/4';
    }
  }

  return styles;
};

export const Tooltip: React.FC<Props> = React.memo(function Tooltip({
  position,
  content,
  children,
  className,
  arrowPosition = 'center',
  themeColor = 'gray',
  appearanceDelay = 0,
  disabled = false,
}) {
  const [isShow, setIsShow] = useState(false);

  const showPopup = () => {
    if (!disabled) {
      setIsShow(true);
    }
  };

  const hidePopup = () => {
    setIsShow(false);
  };

  return (
    <div
      className={clsx('relative', className)}
      onMouseLeave={hidePopup}
      onMouseMove={showPopup}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
      <AnimatePresence>
        {isShow && (
          <motion.div
            className={clsx(
              'absolute z-[10] rounded-xl px-4 py-3 text-left text-sm font-medium normal-case shadow',
              getTooltipPositionStyles(position, arrowPosition),
              themeColor === 'gray' && 'bg-gray text-white',
              themeColor === 'white' && 'bg-white text-black shadow-base',
              themeColor === 'black' && 'bg-black text-white shadow-middleDarkShadow'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0 } }}
            transition={{ duration: 0.2, delay: appearanceDelay }}
            key="tooltip"
          >
            <TooltipArrowIcon
              className={clsx(
                'absolute',
                getArrowPositionStyles(position, arrowPosition),
                themeColor === 'gray' && 'text-gray',
                themeColor === 'white' && 'text-white',
                themeColor === 'black' && 'text-black'
              )}
            />
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
