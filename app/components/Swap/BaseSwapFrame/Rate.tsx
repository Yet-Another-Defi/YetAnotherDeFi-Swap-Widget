interface Props {
  rate: string;
  fromSymbol?: string;
  toSymbol?: string;
  isLoading: boolean;
  tokenPrice: string;
}

export function Rate({ rate, fromSymbol, toSymbol, isLoading, tokenPrice }: Props) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <div className="text-sm text-black/40 dark:text-white/40 text-ellipsis whitespace-nowrap overflow-hidden max-w-[50%]">
        1 {fromSymbol}
      </div>
      {isLoading ? (
        <div className="text-sm">Loading...</div>
      ) : (
        <div className="flex">
          <div className="text-sm text-black/40 dark:text-white/40">~${tokenPrice}</div>
          <div className="ml-2.5 text-sm text-black/80 dark:text-white/80 overflow-hidden text-ellipsis whitespace-nowrap">
            {rate} {toSymbol}
          </div>
        </div>
      )}
    </div>
  );
}
