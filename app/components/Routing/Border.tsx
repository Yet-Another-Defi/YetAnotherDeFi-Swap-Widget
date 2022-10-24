import clsx from 'clsx';

interface Props {
  start?: boolean;
  end?: boolean;
  grow?: boolean;
  className?: string;
}

export function Border({ start, end, grow, className }: Props): JSX.Element {
  return (
    <div
      className={clsx(
        (start || end) && 'pl-14',
        grow ? 'grow' : 'max-w-[3.5rem] grow',
        start && 'rounded-bl-2.5xl border-l',
        end && 'rounded-br-3xl border-r',
        'min-w-[.5rem] border-b border-dashed border-black pt-7',
        'dark:border-white',
        className
      )}
    />
  );
}
