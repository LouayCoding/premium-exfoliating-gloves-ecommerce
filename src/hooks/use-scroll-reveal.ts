'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface ScrollRevealOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

interface ScrollRevealState {
  isInView: boolean;
  hasBeenInView: boolean;
  isReversing: boolean;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ScrollRevealState>({
    isInView: false,
    hasBeenInView: false,
    isReversing: false,
  });

  // Mobile-optimized settings
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const mobileThreshold = isMobile ? 0.1 : (options.threshold || 0.2);

  const isInView = useInView(ref, {
    amount: mobileThreshold,
  });

  const prevScrollY = useRef(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > prevScrollY.current ? 'down' : 'up';
      setScrollDirection(direction);
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setState(prev => {
      const newState = { ...prev };
      
      if (isInView && !prev.hasBeenInView) {
        // First time entering view
        newState.isInView = true;
        newState.hasBeenInView = true;
        newState.isReversing = false;
      } else if (isInView && prev.hasBeenInView) {
        // Re-entering view (coming back from top)
        newState.isInView = true;
        newState.isReversing = scrollDirection === 'up';
      } else if (!isInView && prev.hasBeenInView && !options.triggerOnce) {
        // Leaving view - trigger reverse animation
        newState.isInView = false;
        newState.isReversing = scrollDirection === 'up';
      }
      
      return newState;
    });
  }, [isInView, scrollDirection, options.triggerOnce]);

  return {
    ref,
    ...state,
    scrollDirection,
  };
}
