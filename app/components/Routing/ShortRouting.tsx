import React, { useState } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';

import { ArrowIcon } from '~/components/Icon/ArrowIcon';
import { FadeInAnimation } from '../FadeInAnimation';
import { useRootStore } from '~/store/rootStore';
import { formatNumber, replaceUnderscore } from '~/helpers/helpers';
import { Border } from './Border';
import { Step } from './Step';
import { DotContainer } from './DotContainer';
import { TokenImageWithFallback } from '../TokenImageWithFallback';

export const ShortRouting: React.FC = observer(() => {
  const [isOpenRoutes, setIsOpenRoutes] = useState(false);

  const { appStore } = useRootStore();
  const { from, fromValue, to, routes, isSwapParamsLoading } = appStore;

  const changeRoutesOppeness = () => {
    if (isMoreThanOneRoute) {
      setIsOpenRoutes((prevOpen) => !prevOpen);
    }
  };

  const isShow = !!from && !!to && Number(fromValue) > 0;

  const shortRoutingString = `${from?.symbol.toUpperCase()} > ${replaceUnderscore(
    routes?.[0]?.protocol_name.toUpperCase()
  )} > ${to?.symbol.toUpperCase()}`;

  const isMoreThanOneRoute = routes.length > 1;

  const isShowRouteDetais = isOpenRoutes && isMoreThanOneRoute && !isSwapParamsLoading;

  return (
    <FadeInAnimation isVisible={isShow}>
      <div className="flex">
        <div className="flex flex-shrink grow flex-col">
          <div className="whitespace-nowrap">
            <div
              onClick={changeRoutesOppeness}
              className={clsx('flex justify-between', isMoreThanOneRoute && 'cursor-pointer')}
            >
              <div className="text-sm text-black/40 dark:text-white/40">Route</div>

              {routes.length > 0 && !isSwapParamsLoading ? (
                <>
                  <div className={clsx('flex items-center text-sm text-black', 'dark:text-white')}>
                    {routes.length === 1 ? (
                      shortRoutingString
                    ) : (
                      <>
                        <span>{`${routes.length} steps in the route`}</span>{' '}
                        <ArrowIcon
                          className={clsx(
                            'w-2.5 ml-1 duration-200 ease-linear',
                            isOpenRoutes ? 'rotate-[-180deg]' : 'rotate-0'
                          )}
                        />
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm text-black">
                  {isSwapParamsLoading ? '' : 'Fail to build'}
                </div>
              )}
            </div>

            {isShowRouteDetais && (
              <div className="mt-5">
                {routes.map((route, index) => {
                  return (
                    <div key={index} className="flex flex-row items-center h-9">
                      <DotContainer className="before:top-[50%] before:left-[calc(100%+8px)] pb-0 before:mt-0 before:translate-y-[-50%] mr-5">
                        <TokenImageWithFallback token={from} />
                      </DotContainer>
                      <Border className="pt-0 h-[5%]" grow />
                      <div className="mt-7 text-black mx-1.5 -translate-y-1/2 text-xs px-2 py-1.5 rounded-full bg-lightGray">
                        {formatNumber(route.percent, 0)} %
                      </div>
                      <Border className="pt-0 h-[5%]" grow />
                      <Step grow={true} route={route} isShort />
                      <div className="mx-1.5 mt-7 -translate-y-1/2 text-xs text-black px-2 py-1.5 rounded-full bg-lightGray">
                        {formatNumber(route.percent, 0)} %
                      </div>
                      <Border className="pt-0 h-[5%]" grow />

                      <DotContainer className="before:top-[50%] before:right-[calc(100%+8px)] pb-0 before:mt-0 before:translate-y-[-50%] ml-5">
                        <TokenImageWithFallback token={to} />
                      </DotContainer>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeInAnimation>
  );
});
