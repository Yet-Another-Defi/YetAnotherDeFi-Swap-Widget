import React from 'react';
import type { IconProps } from './icon.types';

export const SeriesIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="14"
      height="11"
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.63875 10.1892L5.78432 3.99978L8.29222 7.89513L12.2843 1.00021"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
