import React from 'react';
import type { IconProps } from './icon.types';

export const TooltipArrowIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="13"
      height="7"
      viewBox="0 0 13 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.86592 0.520358C6.23467 0.217823 6.76575 0.217824 7.13449 0.520358L12.5663 4.97686C13.2923 5.57253 12.8711 6.74996 11.932 6.74996H1.0684C0.129287 6.74996 -0.291917 5.57253 0.434108 4.97686L5.86592 0.520358Z"
        fill="currentColor"
      />
    </svg>
  );
};
