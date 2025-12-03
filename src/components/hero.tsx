'use client';

import { Star } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for coordinated animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animate stars with stagger
      if (starsRef.current) {
        const stars = starsRef.current.querySelectorAll('.star');
        tl.fromTo(
          stars,
          { scale: 0, rotation: -180, opacity: 0 },
          { 
            scale: 1, 
            rotation: 0, 
            opacity: 1, 
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)'
          },
          0.3
        );
      }

      // Animate rating text
      if (ratingRef.current) {
        tl.fromTo(
          ratingRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.8 },
          0.5
        );
      }

      // Animate heading with split text effect
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 100, scale: 0.8 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1.2,
            ease: 'power4.out'
          },
          0.7
        );
      }

      // Animate subtitle
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.2
        );
      }

      // Animate button with bounce
      if (buttonRef.current) {
        tl.fromTo(
          buttonRef.current,
          { opacity: 0, y: 30, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.8,
            ease: 'back.out(1.5)'
          },
          1.5
        );
      }

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative rounded-xl overflow-hidden" 
      style={{backgroundImage: 'url(/images/hds-washandjes-premium-exfoliating-gloves-hero.webp)', backgroundSize: 'cover', backgroundPosition: 'center'}}
      role="banner"
      aria-label="HDS Premium Exfoliating Gloves - Luxe spa ervaring thuis"
    >
      {/* Gradient Overlay - licht naar donker */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      
      <div className="w-full relative z-10">
        <div className="px-8 md:px-12 py-12 md:py-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left min-h-[500px] md:min-h-[550px] justify-end md:justify-center">
          
            <div className="space-y-4 max-w-2xl">
              
              {/* Rating */}
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
                <div ref={starsRef} className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span ref={ratingRef} className="text-sm font-avantt text-white">
                  4.8/5 (2.847 reviews)
                </span>
              </div>

              {/* Main Heading */}
              <div className="mb-4">
                <h1 
                  ref={headingRef}
                  className="font-screamer font-medium text-[80px] md:text-[120px] lg:text-[150px] leading-[0.8] text-white tracking-normal"
                >
                  LUXE SPA<br />THUIS
                </h1>
              </div>

              {/* Subtitle */}
              <p 
                ref={subtitleRef}
                className="text-[20px] md:text-[24px] font-avantt font-medium text-white max-w-md leading-tight mb-6 mx-auto md:mx-0"
              >
                Ontdek het HDS Washandje™ — professionele exfoliatie voor zijdezachte huid.
              </p>

              {/* CTA Button */}
              <button 
                ref={buttonRef}
                onClick={() => {
                  const shopSection = document.getElementById('shop');
                  if (shopSection) {
                    shopSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] hover:from-[#C19B2E] hover:to-[#E0C038] text-[#1a1a1a] font-avantt font-bold px-8 py-3 rounded-lg text-base uppercase tracking-wide transition-all duration-300 hover:scale-[1.02]"
              >
                Shop HDS Washandje
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
