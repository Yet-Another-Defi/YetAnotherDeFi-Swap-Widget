import React from 'react';
import type { IconProps } from './icon.types';

export const CandleStickIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="10"
      height="11"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        x1="0.75"
        y1="5.75"
        x2="0.75"
        y2="10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="4.75"
        y1="0.75"
        x2="4.75"
        y2="10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="8.75"
        y1="0.75"
        x2="8.75"
        y2="4.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
