'use client';

import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  triggerOnce?: boolean;
}

const getVariants = (direction: string, distance: number) => {
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
    up: {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: distance },
    },
    down: {
      hidden: { opacity: 0, y: -distance },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -distance },
    },
    left: {
      hidden: { opacity: 0, x: distance },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: distance },
    },
    right: {
      hidden: { opacity: 0, x: -distance },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -distance },
    },
  };

  return variants[direction as keyof typeof variants] || variants.fade;
};

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 1.2, // Extra slow duration
  distance = 60,
  className = '',
  triggerOnce = false,
}: ScrollRevealProps) {
  const { ref, isInView, hasBeenInView, isReversing } = useScrollReveal({
    triggerOnce,
    threshold: 0.1,
  });

  // Mobile optimizations
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const mobileDuration = isMobile ? duration * 0.8 : duration; // Slightly faster on mobile
  const mobileDistance = isMobile ? distance * 0.7 : distance; // Shorter distance on mobile
  const mobileDelay = isMobile ? delay * 0.6 : delay; // Shorter delay on mobile

  const variants = getVariants(direction, mobileDistance);

  // Determine animation state
  let animateState = 'hidden';
  if (isInView) {
    animateState = 'visible';
  } else if (hasBeenInView && !triggerOnce) {
    animateState = 'exit';
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={animateState}
      variants={variants}
      transition={{
        duration: mobileDuration,
        delay: mobileDelay,
        ease: [0.25, 0.1, 0.0, 1.0], // Custom bezier for elegant motion
      }}
    >
      {children}
    </motion.div>
  );
}
