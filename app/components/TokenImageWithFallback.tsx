import { useEffect, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import clsx from 'clsx';
import type { Token } from '~/objects/tokens';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  token: Token | null;
}

export function TokenImageWithFallback({ token, className }: Props) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onError = () => {
    setIsError(true);
  };

  const onLoaded = () => {
    setIsError(false);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsError(false);
  }, [token?.logoURI]);

  return (
    <>
      {isError ? (
        <div
          className={clsx(
            'flex items-center justify-center',
            'rounded-full bg-gray/40 text-graySecondary',
            'w-[30px] h-[30px] mr-2',
            className
          )}
        >
          {token?.name?.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img
          src={token?.logoURI}
          onError={onError}
          onLoad={onLoaded}
          alt={`${token?.name}_logo`}
          className={clsx('h-[30px] w-[30px] rounded-full', isLoading && 'hidden', className)}
        />
      )}
    </>
  );
}
