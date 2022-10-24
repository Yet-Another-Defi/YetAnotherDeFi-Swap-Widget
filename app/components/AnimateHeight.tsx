import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useMeasure } from '~/hooks/useMeasure';

const Container = styled(motion.div)`
  overflow: hidden;
`;

const variants = {
  open: {
    opacity: 1,
    height: 'auto',
  },
  close: { opacity: 0, height: 0 },
};

interface Props {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: number;
  ease?: string;
}

export function AnimateHeight({ duration, ease = 'easeOut', isOpen, children, className }: Props) {
  const ref = useRef(null);
  const bounds = useMeasure(ref);

  return (
    <Container
      initial={isOpen ? 'open' : 'close'}
      animate={isOpen ? 'open' : 'close'}
      inherit={false}
      variants={variants}
      transition={{
        ease,
        duration: duration ? duration : getAutoHeightDuration(bounds.height ?? 0) / 1000,
      }}
      className={className}
    >
      <div ref={ref}>{children}</div>
    </Container>
  );
}

function getAutoHeightDuration(height: number) {
  if (!height) {
    return 0;
  }
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
