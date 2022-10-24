import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import clsx from 'clsx';

import { Title } from '~/components/Title';
import { useRootStore } from '~/store/rootStore';
import { formatNumber } from '~/helpers/helpers';
import { Border } from './Border';
import { Step } from './Step';
import { DotContainer } from './DotContainer';
import { Skeleton } from '../Skeleton';
import { FadeInAnimation } from '../FadeInAnimation';
import { TokenImageWithFallback } from '../TokenImageWithFallback';

const StyledNumber = styled.div`
  @property --num {
    syntax: '<integer>';
    initial-value: 0;
    inherits: false;
  }

  animation: counter 3.5s infinite alternate ease-in-out;
  counter-reset: num var(--num);

  &:before {
    content: counter(num);
  }

  @keyframes counter {
    from {
      --num: 0;
    }
    to {
      --num: 100;
    }
  }
`;

export const Routing: React.FC = observer(() => {
  const { appStore } = useRootStore();
  const { from, fromValue, toValue, to, routes, isSwapParamsLoading } = appStore;

  const isShow = !!from && !!to && Number(fromValue) > 0;
  // return <Skeleton type="routing" className="flex-grow-[4]" />;
  return (
    <FadeInAnimation isVisible={isShow}>
      <Title className="flex items-center ">Routing</Title>
      <div>
        <div className="flex">
          <div className="flex flex-shrink grow flex-col">
            <div className="relative mt-5 flex w-full justify-between">
              <DotContainer className="before:left-2.5">
                <TokenImageWithFallback token={from} />
                <div className="ml-2 text-sm">{formatNumber(fromValue)}</div>
                <div className="ml-2">{from?.symbol}</div>
              </DotContainer>
              <div className="absolute inset-x-6 top-8 border-b border-dashed border-black sm:block lg:hidden" />
              <DotContainer className="before:right-2.5">
                <div className="mr-2 text-sm">{formatNumber(toValue)}</div>
                <div className="mr-2">{to?.symbol}</div>
                <TokenImageWithFallback token={to} />
              </DotContainer>
            </div>
            <div className="whitespace-nowrap lg:px-3">
              {routes.length > 0 && !isSwapParamsLoading ? (
                routes.map((route, index) => {
                  return (
                    <div key={index} className="flex flex-col lg:flex-row lg:items-start">
                      <Border className="hidden lg:block" start />
                      <div className="mb-2 mt-7  lg:mx-1.5 lg:mb-0 lg:-translate-y-1/2 lg:text-xs">
                        {formatNumber(route.percent, 0)} %
                      </div>
                      <Border className="hidden lg:block" grow />
                      <Step grow={true} route={route} />
                      <div className="mx-1.5 mt-7 hidden -translate-y-1/2 text-xs  lg:block">
                        {formatNumber(route.percent, 0)} %
                      </div>
                      <Border className="hidden lg:block" end />
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-start">
                  <Border className="hidden lg:block" start />
                  <div className="mb-2 mt-7  lg:mx-1.5 lg:mb-0 lg:-translate-y-1/2 lg:text-xs">
                    {isSwapParamsLoading ? (
                      <StyledNumber className="w-[20px] lg:text-xs"> %</StyledNumber>
                    ) : (
                      `100 %`
                    )}
                  </div>
                  <Border className="hidden lg:block" grow />
                  {isSwapParamsLoading ? (
                    <Skeleton type="routing" className="flex-grow-[4]" />
                  ) : (
                    <div
                      className={clsx(
                        'flex-grow-[4] rounded-2xl bg-black/5 py-2 text-center text-xs  md:mx-1 md:mt-2.5',
                        'dark:bg-white/10'
                      )}
                    >
                      Failed to build route
                    </div>
                  )}
                  <Border className="hidden lg:block" grow />
                  <div className="mx-1.5 mt-7 hidden -translate-y-1/2 text-xs  lg:block">
                    {isSwapParamsLoading ? (
                      <StyledNumber className="w-[20px] lg:text-xs"> %</StyledNumber>
                    ) : (
                      `100 %`
                    )}
                  </div>
                  <Border className="hidden lg:block" end />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FadeInAnimation>
  );
});
