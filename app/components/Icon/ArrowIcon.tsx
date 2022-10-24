import React from 'react';
import type { IconProps } from './icon.types';

export const ArrowIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1 1L5.5 5L10 1" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
};
