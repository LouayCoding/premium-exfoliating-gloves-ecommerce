'use client';

import { motion } from 'framer-motion';

interface StaggerItemProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  distance?: number;
  duration?: number;
  className?: string;
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

export function StaggerItem({
  children,
  direction = 'up',
  distance = 40,
  duration = 1.0,
  className = '',
}: StaggerItemProps) {
  const variants = getVariants(direction, distance);

  return (
    <motion.div
      className={className}
      variants={variants}
      transition={{
        duration: duration,
        ease: [0.25, 0.1, 0.0, 1.0],
      }}
    >
      {children}
    </motion.div>
  );
}












