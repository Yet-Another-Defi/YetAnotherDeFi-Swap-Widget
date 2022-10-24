import React from 'react';
import type { IconProps } from './icon.types';

export const SettingsIcon: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 1.75C0 1.55109 0.0790201 1.36032 0.21967 1.21967C0.36032 1.07902 0.55109 1 0.75 1H13.25C13.4489 1 13.6397 1.07902 13.7803 1.21967C13.921 1.36032 14 1.55109 14 1.75C14 1.94891 13.921 2.13968 13.7803 2.28033C13.6397 2.42098 13.4489 2.5 13.25 2.5H0.75C0.55109 2.5 0.36032 2.42098 0.21967 2.28033C0.0790201 2.13968 0 1.94891 0 1.75ZM0 6.75C0 6.55109 0.0790201 6.36032 0.21967 6.21967C0.36032 6.07902 0.55109 6 0.75 6H13.25C13.4489 6 13.6397 6.07902 13.7803 6.21967C13.921 6.36032 14 6.55109 14 6.75C14 6.94891 13.921 7.13968 13.7803 7.28033C13.6397 7.42098 13.4489 7.5 13.25 7.5H0.75C0.55109 7.5 0.36032 7.42098 0.21967 7.28033C0.0790201 7.13968 0 6.94891 0 6.75ZM0.75 11C0.55109 11 0.36032 11.079 0.21967 11.2197C0.0790201 11.3603 0 11.5511 0 11.75C0 11.9489 0.0790201 12.1397 0.21967 12.2803C0.36032 12.421 0.55109 12.5 0.75 12.5H13.25C13.4489 12.5 13.6397 12.421 13.7803 12.2803C13.921 12.1397 14 11.9489 14 11.75C14 11.5511 13.921 11.3603 13.7803 11.2197C13.6397 11.079 13.4489 11 13.25 11H0.75Z"
      />
      <circle cx="3.75" cy="1.75" r="1.75" />
      <circle cx="3.75" cy="6.75" r="1.75" />
      <circle cx="9.75" cy="11.75" r="1.75" />
    </svg>
  );
};