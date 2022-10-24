import React from 'react';
import type { IconProps } from './icon.types';

export const BurgerIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        x1="0.75"
        y1="2.25"
        x2="15.25"
        y2="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="0.75"
        y1="7.25"
        x2="15.25"
        y2="7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="0.75"
        y1="12.25"
        x2="15.25"
        y2="12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
