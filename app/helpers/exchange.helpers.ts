import { ethers, BigNumber } from 'ethers';

import type { Token } from '~/objects/tokens';
import { truncateDecimals } from './helpers';

export interface TokenWithBalance extends Token {
  amount: string;
}

export const isTokenWithBalance = (token: Token | TokenWithBalance): token is TokenWithBalance => {
  return (token as TokenWithBalance).amount !== undefined;
};

export const calculateGasLimit = (gas: BigNumber): BigNumber => {
  return gas.mul(BigNumber.from(10000).add(BigNumber.from(2000))).div(BigNumber.from(10000));
};

export const getTokenValueBigInt = (token: Token, value: string): BigNumber => {
  const str = truncateDecimals(value, token.decimals);

  return ethers.utils.parseUnits(str, token.decimals);
};

export const getTokenValueStr = (token: Token, value: BigNumber): string => {
  return ethers.utils.formatUnits(value, token.decimals);
};

export const getAmountWithSlippage = (slippage: number, amount: bigint): bigint => {
  return (amount * BigInt(1000 - slippage * 10)) / BigInt(1000);
};

export const getRate = ({
  from,
  to,
  fromValue,
  toValue,
}: {
  from: Token;
  to: Token;
  fromValue: string;
  toValue: string;
}): number => {
  if (parseFloat(toValue) === 0 || parseFloat(fromValue) === 0) {
    return 0;
  }

  const MULTIPLICATOR = 10000000;

  let fromBN = ethers.utils.parseUnits(truncateDecimals(fromValue, from.decimals), from.decimals);

  let toBN = ethers.utils.parseUnits(truncateDecimals(toValue, to.decimals), to.decimals);

  if (to.decimals > from.decimals) {
    fromBN = fromBN.mul(BigNumber.from('1'.padEnd(to.decimals - from.decimals + 1, '0')));
  } else if (from.decimals > to.decimals) {
    toBN = toBN.mul(BigNumber.from('1'.padEnd(from.decimals - to.decimals + 1, '0')));
  }

  if (fromBN.mul(BigNumber.from(`${MULTIPLICATOR}`)).gte(toBN)) {
    toBN = toBN.mul(BigNumber.from(`${MULTIPLICATOR}`));
  } else {
    fromBN = fromBN.mul(BigNumber.from(`${MULTIPLICATOR}`));
  }

  return toBN.div(fromBN).toNumber() / MULTIPLICATOR;
};
