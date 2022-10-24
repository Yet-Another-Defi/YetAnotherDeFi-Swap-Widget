import React from 'react';
import clsx from 'clsx';

import { DropDownMenuItem } from './DropDownMenuItem';
import { TooltipArrowIcon } from '~/components/Icon/TooltipArrowIcon';

interface Props {
  className?: string;
  list: { linkUrl: string; content: React.ReactNode }[];
}

export function DropDownMenu({ list, className }: Props): JSX.Element {
  return (
    <div
      className={clsx(
        'absolute top-full z-[2] mt-2 rounded-2.5xl bg-white px-3 py-2.5 text-gray/80',
        className
      )}
    >
      <TooltipArrowIcon className="absolute -top-1 left-8 text-white" />
      {list.map((item) => (
        <div className="mb-1 last:mb-0" key={item.linkUrl}>
          <DropDownMenuItem {...item} />
        </div>
      ))}
    </div>
  );
}
