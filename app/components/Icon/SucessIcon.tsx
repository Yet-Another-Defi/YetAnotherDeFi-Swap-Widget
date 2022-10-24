import React from 'react';
import type { IconProps } from './icon.types';

export const SucessIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16.6443 2.04853C17.1186 1.5799 17.1186 0.8201 16.6443 0.351472C16.1701 -0.117157 15.4013 -0.117157 14.9271 0.351472L6.07143 9.10294L2.07292 5.15147C1.59871 4.68284 0.829864 4.68284 0.355656 5.15147C-0.118552 5.6201 -0.118552 6.3799 0.355656 6.84853L5.2128 11.6485C5.68701 12.1172 6.45585 12.1172 6.93006 11.6485L16.6443 2.04853Z"
        fill="#4BDB7C"
      />
    </svg>
  );
};
