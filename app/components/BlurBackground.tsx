import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Background = styled(motion.div)`
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  height: 100vh;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 3;
  overflow: hidden;
`;

interface Props {
  className?: string;
}

export function BlurBackground({ className }: Props) {
  return (
    <Background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    />
  );
}
