import React from 'react';
import styled from 'styled-components';
import { FixedNumber } from 'ethers';

import { useRootStore } from '~/store/rootStore';
import { TransactionCost } from './TransactionCost';
import { Rate } from './Rate';
import { ShortRouting } from '~/components/Routing';
import { formatNumber } from '~/helpers/helpers';

const StyledContainer = styled.div`
  border: 1px solid ${(props) => props.theme.colors.lightGray};
  border-radius: 10px;
`;

interface Props {
  tokenToPriceUSD: string;
  rate: string;
}

export function ShortTransactionInfo({ tokenToPriceUSD, rate }: Props) {
  const { appStore } = useRootStore();
  const { from, to } = appStore;

  return (
    <StyledContainer className="py-6 px-6 mt-5 dark:border-lightBlack">
      <Rate
        fromSymbol={from?.symbol.toUpperCase()}
        toSymbol={to?.symbol.toUpperCase()}
        isLoading={appStore.isSwapParamsLoading}
        tokenPrice={formatNumber(
          FixedNumber.fromString(tokenToPriceUSD).mulUnsafe(FixedNumber.from(rate)).toString()
        )}
        rate={formatNumber(rate)}
      />
      <TransactionCost />
      <ShortRouting />
    </StyledContainer>
  );
}
