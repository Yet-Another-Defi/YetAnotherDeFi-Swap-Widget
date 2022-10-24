import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  isVisible: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: number;
  isExit?: boolean;
}

export function FadeInAnimation({
  isVisible,
  children,
  isExit = true,
  duration = 0.3,
  className,
}: Props) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={isExit ? { opacity: 0 } : {}}
          transition={{ duration }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
