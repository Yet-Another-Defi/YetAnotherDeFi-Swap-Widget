import type { Route } from '~/routes/api/route.$chainId.$from.$to';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import clsx from 'clsx';

import { Border } from './Border';
import { replaceUnderscore } from '~/helpers/helpers';

import protocols from '~/resolve-dex-img.json';

const StyledContainer = styled.div`
  position: relative;
  &:hover {
    z-index: 1;
    & span {
      display: block;
    }
  }
`;

const StyledTip = styled.span`
  position: absolute;
  background: ${(props) => props.theme.colors.white};
  display: none;
  top: -39px;
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.lightGray};
  box-shadow: 0px 2px 4px ${(props) => props.theme.colors.lightGray};
  min-width: 105px;
  text-align: center;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%) rotate(-45deg);
    background: inherit;
    border: 1px solid ${(props) => props.theme.colors.lightGray};
    width: 10px;
    height: 10px;
    border-top-color: ${(props) => props.theme.colors.transparent};
    border-right-color: ${(props) => props.theme.colors.transparent};
  }
`;

export const Step: React.FC<{
  route: Route;
  grow?: boolean;
  isShort?: boolean;
}> = observer(({ route, grow, isShort = false }) => {
  const protocolIcon = protocols[route.protocol_name.toLowerCase() as keyof typeof protocols];

  const protoсolName = replaceUnderscore(route.protocol_name);

  return (
    <>
      {isShort ? (
        <>
          <StyledContainer
            className={clsx(
              'my-0.5 rounded-2xl p-0.5 text-sm lg:mx-3 lg:mt-7 lg:mb-0 lg:-translate-y-4 bg-black/5',
              'dark:bg-white/10'
            )}
          >
            <div
              className={clsx(
                'flex h-[29px] w-[29px] items-center justify-center rounded-full bg-white'
              )}
            >
              {protocolIcon && (
                <img
                  alt="protocol"
                  src={protocolIcon}
                  className={'h-[25px] w-[25px]'}
                  title={protoсolName}
                />
              )}
              <StyledTip className="rounded-xl text-xs p-1.5 text-black">{protoсolName}</StyledTip>
            </div>
          </StyledContainer>
          <Border className="pt-0 h-[5%]" grow={grow} />
        </>
      ) : (
        <>
          <div
            className={clsx(
              'my-0.5 rounded-2xl py-1 pl-1 pr-2.5 text-sm lg:mx-3 lg:mt-7 lg:mb-0 lg:-translate-y-4 bg-black/5',
              'dark:bg-white/10'
            )}
          >
            <div className="flex cursor-pointer items-center justify-between">
              <div
                className={clsx(
                  'mr-2.5 flex h-[25px] w-[25px] items-center justify-center rounded-full bg-white'
                )}
              >
                {protocolIcon && (
                  <img alt="protocol" src={protocolIcon} className={'h-[18px] w-[18px]'} />
                )}
              </div>
              <div className="uppercase">{protoсolName}</div>
            </div>
          </div>
          <Border className="hidden lg:block" grow={grow} />
        </>
      )}
    </>
  );
});
