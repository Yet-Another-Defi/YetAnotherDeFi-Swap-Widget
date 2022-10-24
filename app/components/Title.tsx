import clsx from 'clsx';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Title({ children, className }: Props) {
  return <div className={clsx('text-2xl font-medium sm:text-3xl', className)}>{children}</div>;
}
