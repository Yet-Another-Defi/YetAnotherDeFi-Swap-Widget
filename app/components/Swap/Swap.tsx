import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import clsx from 'clsx';

import { useSwapData } from './useSwapData';
import { AnimatedSwapFrames } from './AnimatedSwapFrames';
import { BaseSwapFrame } from './BaseSwapFrame';
import { useRootStore } from '~/store/rootStore';
import { STORAGE_KEYS, useLocalStorage } from '~/hooks';
import { SwapContext } from './useSwapState';

import { ShortTransactionInfo } from './BaseSwapFrame/ShortTransactionInfo';

const StyledContainer = styled.div`
  box-shadow: -5px 5px 60px rgba(58, 45, 133, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 10px;
  min-height: 459px;
`;

const containerStyles = clsx(
  'relative rounded-[20px] px-5 py-7 backdrop-blur-md',
  'ease-linear duration-500',
  'dark:shadow-darkShadow'
);

export const Swap: React.FC = observer(() => {
  const [_, setFromAmount] = useLocalStorage(STORAGE_KEYS.FROM_AMOUNT);

  const { state, actions } = useContext(SwapContext);

  const { appStore, swapStore } = useRootStore();

  const { fromValue } = appStore;

  useEffect(() => {
    if (fromValue !== '') {
      setFromAmount(fromValue);
    }
  }, [fromValue, setFromAmount]);

  useEffect(() => {
    if (!fromValue || appStore.routes.length === 0) {
      appStore.setToValue('0');
    }
  }, [appStore, fromValue, appStore.routes]);

  const swapData = useSwapData(swapStore);

  return (
    <>
      <StyledContainer className={containerStyles}>
        <AnimatedSwapFrames swapState={state} actions={actions} />

        <BaseSwapFrame
          openSettings={actions.openSettings}
          openSelectToken={actions.openSelectToken}
          swapData={swapData}
        />
      </StyledContainer>

      <ShortTransactionInfo tokenToPriceUSD={swapData.tokenToPriceUSD} rate={swapData.rate} />
    </>
  );
});
