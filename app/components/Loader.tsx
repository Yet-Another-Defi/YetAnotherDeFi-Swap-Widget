import React from 'react';
import styled from 'styled-components';

import { useUiSettings } from '~/UiProvider';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 5px;
  margin: auto;
  overflow: hidden;
`;

const AnimatedDiv = styled.div<{ color: string }>`
  ${({ color }) => {
    return `
        position: relative;
        left: -9999px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        box-shadow: 9984px 0 0 0 ${color}, 9999px 0 0 0 ${color}, 10014px 0 0 0 ${color};
        animation: load 1.5s infinite linear;

        @keyframes load {
            0% {
            box-shadow: 9984px 0 0 -1px ${color}, 9999px 0 0 1px ${color}, 10014px 0 0 -1px ${color};
            }
            50% {
            box-shadow: 10014px 0 0 -1px ${color}, 9984px 0 0 -1px ${color}, 9999px 0 0 1px ${color};
            }
            100% {
            box-shadow: 9999px 0 0 1px ${color}, 10014px 0 0 -1px ${color}, 9984px 0 0 -1px ${color};
        }
  }
`;
  }}
`;

interface Props {
  color?: string;
}

export const Loader: React.FC<Props> = ({ color, ...props }) => {
  const { isLightTheme } = useUiSettings();
  const defaultColor = isLightTheme ? '#000' : '#fff';
  return (
    <Container {...props}>
      <AnimatedDiv color={color ?? defaultColor} />
    </Container>
  );
};
