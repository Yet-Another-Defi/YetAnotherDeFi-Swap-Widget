import React from 'react';
import type { IconProps } from './icon.types';

export const CollapseIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 0C4.66421 0 5 0.33579 5 0.75V3.25C5 4.2165 4.2165 5 3.25 5H0.75C0.33579 5 0 4.66421 0 4.25C0 3.83579 0.33579 3.5 0.75 3.5H3.25C3.38807 3.5 3.5 3.38807 3.5 3.25V0.75C3.5 0.33579 3.83579 0 4.25 0ZM9.75 0C10.1642 0 10.5 0.33579 10.5 0.75V3.25C10.5 3.38807 10.6119 3.5 10.75 3.5H13.25C13.6642 3.5 14 3.83579 14 4.25C14 4.66421 13.6642 5 13.25 5H10.75C9.7835 5 9 4.2165 9 3.25V0.75C9 0.33579 9.3358 0 9.75 0ZM0 9.75C0 9.3358 0.33579 9 0.75 9H3.25C4.2165 9 5 9.7835 5 10.75V13.25C5 13.6642 4.66421 14 4.25 14C3.83579 14 3.5 13.6642 3.5 13.25V10.75C3.5 10.6119 3.38807 10.5 3.25 10.5H0.75C0.33579 10.5 0 10.1642 0 9.75ZM9 10.75C9 9.7835 9.7835 9 10.75 9H13.25C13.6642 9 14 9.3358 14 9.75C14 10.1642 13.6642 10.5 13.25 10.5H10.75C10.6119 10.5 10.5 10.6119 10.5 10.75V13.25C10.5 13.6642 10.1642 14 9.75 14C9.3358 14 9 13.6642 9 13.25V10.75Z"
        fill="currentColor"
      />
    </svg>
  );
};
