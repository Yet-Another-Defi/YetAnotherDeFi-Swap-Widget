import clsx from 'clsx';

interface Props {
  className: string;
  children: React.ReactNode;
}

export function DotContainer({ children, className }: Props) {
  return (
    <div
      className={clsx(
        'relative flex items-center pb-4 before:absolute before:top-full before:-mt-2.5 before:box-content before:h-px before:w-px before:rounded-full before:bg-black before:p-[1.5px]',
        'dark:before:bg-white',
        className
      )}
    >
      {children}
    </div>
  );
}
