import clsx from 'clsx';
import styled, { keyframes } from 'styled-components';

import { useUiSettings } from '~/UiProvider';

const backgroundMovement = keyframes`
    0% {
        background-position: 100%;
    }

    100% {
        background-position: -100%;
   
    }
`;

const backgroundOpacityMovement = keyframes`
    0% {
      background-position: 100%;
      background-color: rgba(0,0,0, 0.05);
    }

    50% {
      background-color: rgba(0,0,0, 0.1);
    }

    100% {
      background-position: -300%;
      background-color: rgba(0,0,0, 0.05);
    }
`;

const SkeletonContainer = styled.div<{ mt?: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  margin-top: ${({ mt }) => mt && `${mt}px`};
`;

const SkeletonItem = styled.div<{
  isLightTheme?: boolean;
  opacity?: number;
  animationType?: string;
}>`
  background: ${({ opacity, isLightTheme }) =>
    isLightTheme ? `rgba(221, 226, 229, ${opacity})` : `rgba(48, 48, 48, ${opacity})`};
  background: ${({ opacity, isLightTheme }) =>
    isLightTheme
      ? `linear-gradient(
    92.51deg,
    rgba(221, 226, 229,${opacity}) 6.44%,
    rgba(226, 230, 232,${opacity}) 38.47%,
    rgba(243, 245, 245,${opacity}) 56.48%,
    rgba(227, 231, 234,${opacity}) 77.5%,
    rgba(221, 226, 229,${opacity}) 102.52%
  )`
      : `linear-gradient(
    92.51deg,
    rgba(48, 48, 48,${opacity}) 6.44%,
    rgba(55, 52, 51,${opacity}) 38.47%,
    rgba(62, 67, 64,${opacity}) 56.48%,
    rgba(46, 52, 53,${opacity}) 77.5%,
    rgba(40, 47, 48,${opacity}) 102.52%
  )`};
  background-size: 200%;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${({ animationType }) =>
    animationType === 'bg' ? backgroundMovement : backgroundOpacityMovement};
  animation-timing-function: linear;
`;

interface Props {
  className?: string;
  type?: string;
}

export function Skeleton({ className, type = 'base' }: Props) {
  const { isLightTheme } = useUiSettings();

  let skeletonVariant;

  switch (type) {
    case 'routing':
      skeletonVariant = (
        <SkeletonItem
          className={clsx(
            'flex-grow-[4] rounded-2xl py-2 text-center text-xs text-black md:mx-1 md:mt-2.5',
            'dark:text-white',
            className
          )}
          isLightTheme={isLightTheme}
          opacity={0.25}
          animationType="bgOpacity"
        >
          Building optimal route
        </SkeletonItem>
      );
      break;
    default:
      skeletonVariant = (
        <SkeletonContainer className={clsx('rounded', className)}>
          <SkeletonItem
            animationType="bg"
            className="h-4 w-[100px] rounded"
            opacity={0.8}
            isLightTheme={isLightTheme}
          />
          <SkeletonItem
            animationType="bg"
            className="h-7 w-full rounded"
            opacity={0.8}
            isLightTheme={isLightTheme}
          />
        </SkeletonContainer>
      );
  }

  return skeletonVariant;
}
