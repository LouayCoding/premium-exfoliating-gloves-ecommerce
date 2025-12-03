'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Enhanced mobile detection
    const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Initialize Lenis with recommended best practice settings
    lenisRef.current = new Lenis({
      duration: isMobile ? 0.3 : 1.8, // Zeer snelle scroll op mobile
      easing: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, // Cubic easing voor natuurlijke feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !isMobile, // Native touch op mobile
      wheelMultiplier: isMobile ? 1.0 : 0.8,
      touchMultiplier: isMobile ? 2.0 : 1.0, // Maximale responsive touch op mobile
      syncTouch: isMobile,
      syncTouchLerp: isMobile ? 0.2 : 0.1, // Directe tracking op mobile
      infinite: false,
      wrapper: window,
      content: document.documentElement,
    });

    // Animation loop
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle resize to adjust settings dynamically
    const handleResize = () => {
      if (lenisRef.current) {
        const newIsMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        lenisRef.current.options.duration = newIsMobile ? 0.3 : 1.8;
        lenisRef.current.options.touchMultiplier = newIsMobile ? 2.0 : 1.0;
        lenisRef.current.options.smoothWheel = !newIsMobile;
        lenisRef.current.options.syncTouch = newIsMobile;
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <>{children}</>;
}
