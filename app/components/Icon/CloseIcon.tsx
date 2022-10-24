import React from 'react';
import type { IconProps } from './icon.types';

export const CloseIcon: React.FC<IconProps> = (props) => {
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
        x1="1.06066"
        y1="1"
        x2="14.1421"
        y2="14.0815"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="14.0819"
        x2="14.0815"
        y2="1.00044"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
