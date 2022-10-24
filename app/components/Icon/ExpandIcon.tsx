import React from 'react';
import type { IconProps } from './icon.types';

export const ExpandIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.75 1.5C1.61193 1.5 1.5 1.61193 1.5 1.75V4.25C1.5 4.66421 1.16421 5 0.75 5C0.33579 5 0 4.66421 0 4.25V1.75C0 0.7835 0.7835 0 1.75 0H4.25C4.66421 0 5 0.33579 5 0.75C5 1.16421 4.66421 1.5 4.25 1.5H1.75ZM9 0.75C9 0.33579 9.3358 0 9.75 0H12.25C13.2165 0 14 0.7835 14 1.75V4.25C14 4.66421 13.6642 5 13.25 5C12.8358 5 12.5 4.66421 12.5 4.25V1.75C12.5 1.61193 12.3881 1.5 12.25 1.5H9.75C9.3358 1.5 9 1.16421 9 0.75ZM0.75 9C1.16421 9 1.5 9.3358 1.5 9.75V12.25C1.5 12.3881 1.61193 12.5 1.75 12.5H4.25C4.66421 12.5 5 12.8358 5 13.25C5 13.6642 4.66421 14 4.25 14H1.75C0.7835 14 0 13.2165 0 12.25V9.75C0 9.3358 0.33579 9 0.75 9ZM13.25 9C13.6642 9 14 9.3358 14 9.75V12.25C14 13.2165 13.2165 14 12.25 14H9.75C9.3358 14 9 13.6642 9 13.25C9 12.8358 9.3358 12.5 9.75 12.5H12.25C12.3881 12.5 12.5 12.3881 12.5 12.25V9.75C12.5 9.3358 12.8358 9 13.25 9Z"
        fill="currentColor"
      />
    </svg>
  );
};