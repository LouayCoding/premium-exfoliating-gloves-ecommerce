'use client';

import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { forwardRef } from 'react';

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  triggerOnce?: boolean;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(({
  children,
  staggerDelay = 0.15,
  className = '',
  triggerOnce = false,
}, externalRef) => {
  const { ref: internalRef, isInView, hasBeenInView } = useScrollReveal({
    triggerOnce,
    threshold: 0.1,
  });

  // Determine animation state
  let animateState = 'hidden';
  if (isInView) {
    animateState = 'visible';
  } else if (hasBeenInView && !triggerOnce) {
    animateState = 'exit';
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: staggerDelay,
        staggerDirection: -1, // Reverse stagger on exit
      },
    },
  };

  return (
    <motion.div
      ref={(node) => {
        // Set internal ref (always RefObject)
        if (internalRef) {
          internalRef.current = node;
        }
        
        // Set external ref (can be RefObject or callback)
        if (typeof externalRef === 'function') {
          externalRef(node);
        } else if (externalRef) {
          externalRef.current = node;
        }
      }}
      className={className}
      initial="hidden"
      animate={animateState}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
});

StaggerContainer.displayName = 'StaggerContainer';

