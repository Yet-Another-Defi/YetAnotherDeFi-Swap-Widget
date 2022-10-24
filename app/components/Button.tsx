import React from 'react';
import clsx from 'clsx';

function getButtonStyle({
  buttonType,
  variant,
}: {
  buttonType: 'primary' | 'secondary' | 'action';
  variant?: 'fill' | 'outline';
}) {
  const btnStyle: string = buttonType + '-' + variant;
  let styles;

  switch (btnStyle) {
    case 'primary-fill':
      styles = clsx(
        'bg-black text-white hover:bg-lightBlack hover:text-white active:bg-black disabled:text-white disabled:bg-grayTretiary disabled:hover:text-white',
        'dark:bg-orange dark:hover:bg-lightOrange dark:active:bg-orange dark:disabled:bg-gray500 dark:disabled:text-gray dark:disabled:hover:!bg-gray500 dark:disabled:hover:!text-gray'
      );
      break;
    case 'primary-outline':
      styles = clsx(
        'border border-black',
        'bg-white text-black hover:text-black hover:bg-black/20 active:text-black active:bg-black/20 disabled:!text-gray disabled:!border-gray disabled:!bg-white disabled:hover:text-gray disabled:hover:border-gray disabled:hover:bg-white',
        'dark:bg-orange dark:text-white dark:hover:text-white dark:hover:bg-lightOrange dark:active:bg-white/20'
      );
      break;
    case 'secondary-fill':
      styles = clsx(
        'text-white bg-orange hover:bg-[rgb(251, 84, 0, 0.8)] active:bg-orange disabled:!text-gray disabled:!bg-grayTretiary disabled:hover:text-gray disabled:hover:bg-grayTretiary'
      );
      break;
    case 'action-fill':
      styles = clsx(
        'bg-green text-white hover:bg-darkGreen active:bg-darkGreen disabled:!text-gray disabled:!bg-grayTretiary disabled:hover:text-gray disabled:hover:bg-grayTretiary'
      );
  }
  return styles;
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType?: 'primary' | 'secondary' | 'action';
  variant?: 'fill' | 'outline';
  children: React.ReactNode;
};

export function Button({
  className,
  children,
  buttonType = 'primary',
  variant = 'fill',
  ...rest
}: Props) {
  const styles = getButtonStyle({ buttonType, variant });

  return (
    <button
      className={clsx(
        'h-10 font-semibold uppercase tracking-widest',
        'cursor-pointer rounded-2lg px-5 text-center text-xs',
        styles,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
