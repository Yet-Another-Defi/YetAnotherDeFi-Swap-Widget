import React from 'react';
import type { IconProps } from './icon.types';

export const ScrewIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path d="M15 1.11H5L0 10l5 8.89h10L20 10zm-5 12.75A3.86 3.86 0 1 1 13.86 10 3.86 3.86 0 0 1 10 13.86z"></path>
    </svg>
  );
};
