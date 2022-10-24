import { FixedNumber } from 'ethers';
import { NATIVE_TOKEN_ADDRESS } from '~/constants';
import type { Token } from '~/objects/tokens';

interface Params {
  token: Token | null;
  tokenValue: string;
  nativeTokenPriceUSD: number;
  tokenPriceUSD: string;
}

export const calcTotalTokenPrice = ({
  token,
  tokenValue,
  nativeTokenPriceUSD,
  tokenPriceUSD,
}: Params): string => {
  const isNativeToken =
    !!tokenValue && token?.address === NATIVE_TOKEN_ADDRESS && nativeTokenPriceUSD > 0;
  const isAltToken = !!tokenValue && +tokenPriceUSD > 0;

  if (isNativeToken) {
    return FixedNumber.fromString(`${nativeTokenPriceUSD}`)
      .mulUnsafe(FixedNumber.fromString(tokenValue))
      .toString();
  } else if (isAltToken) {
    return FixedNumber.fromString(tokenPriceUSD)
      .mulUnsafe(FixedNumber.fromString(tokenValue))
      .toString();
  }
  return '0';
};
