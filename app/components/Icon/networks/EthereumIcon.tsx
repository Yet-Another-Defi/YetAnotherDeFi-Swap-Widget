import React from 'react';
import type { IconProps } from '../icon.types';

export const EthereumIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50Z"
        fill="#627EEB"
      />
      <path
        d="M24.6969 8.32031L24.4688 9.06719V30.7125L24.6969 30.9328L35.1094 24.9937L24.6969 8.32031Z"
        fill="#BFCDFA"
      />
      <path d="M24.6953 8.32031L14.2812 24.9937L24.6953 30.9328V8.32031Z" fill="#FFFFFD" />
      <path
        d="M24.6906 32.8359L24.5625 32.9859V40.6984L24.6906 41.0578L35.1094 26.8984L24.6906 32.8359Z"
        fill="#BFCDFA"
      />
      <path d="M24.6953 41.0578V32.8344L14.2812 26.8984L24.6953 41.0578Z" fill="#FFFFFD" />
      <path d="M24.6875 30.9281L35.1 24.9891L24.6875 20.4219V30.9281Z" fill="#8199EF" />
      <path d="M14.2812 24.9969L24.6938 30.9359V20.4297" fill="#C5CAF4" />
    </svg>
  );
};
