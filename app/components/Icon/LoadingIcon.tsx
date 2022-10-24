import React from 'react';
import clsx from 'clsx';

import type { IconProps } from './icon.types';

interface Props {
  className?: string;
}

const Circle: React.FC<IconProps> = (props) => {
  return (
    <svg viewBox="0 0 13 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0 25C6.62742 25 12 19.6274 12 13C12 6.37258 6.62742 1 0 1"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

export const LoadingIcon: React.FC<Props> = (props) => {
  return (
    <div className={clsx('relative', props.className)}>
      <Circle className={'animate-circle1 absolute right-0 h-full origin-left text-black'} />
      <Circle className={'animate-circle2 absolute right-0 h-full origin-left text-black'} />
      <Circle className={'animate-circle3 absolute right-0 h-full origin-left text-black'} />
      <Circle className={'absolute right-0 h-full origin-left text-black'} />
    </div>
  );
};
