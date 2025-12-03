'use client';

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { StaggerContainer } from '@/components/motion/stagger-container';
import { StaggerItem } from '@/components/motion/stagger-item';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
  };

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Image */}
          <ScrollReveal direction="right" distance={80} duration={1.5} delay={0.2} className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 h-80 md:h-96 lg:h-[28rem]">
              <img 
                src="/images/hds-premium-exfoliating-gloves-hero-image.png" 
                alt="HDS Premium Exfoliating Gloves collectie - Professionele washandjes voor luxe huidverzorging thuis"
                className="w-full h-full object-cover"
                loading="lazy"
                width="600"
                height="400"
              />
            </div>
          </ScrollReveal>

          {/* Content */}
          <StaggerContainer staggerDelay={0.2} className="order-1 lg:order-2 space-y-6">
            
            {/* Title */}
            <StaggerItem direction="left" distance={60} duration={1.4}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-avantt font-medium text-[#121212] leading-tight">
                Krijg 10% korting op je eerste bestelling
              </h2>
            </StaggerItem>

            {/* Description */}
            <StaggerItem direction="left" distance={50} duration={1.3}>
              <p className="text-base md:text-lg font-avantt text-gray-700 leading-relaxed">
                Meld je aan voor onze nieuwsbrief om als eerste te horen over nieuwe producten, exclusieve kortingen, winacties en meer. Plus, geniet van 10% korting op je eerste bestelling.
              </p>
            </StaggerItem>

            {/* Email Form */}
            <StaggerItem direction="left" distance={40} duration={1.2}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@provider.com"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg font-avantt text-base focus:outline-none focus:ring-2 focus:ring-[#121212] focus:border-transparent pr-12"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#121212] hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            </StaggerItem>

            {/* Privacy Notice */}
            <StaggerItem direction="left" distance={30} duration={1.1}>
              <p className="text-sm font-avantt text-gray-500 leading-relaxed">
                Wanneer je je aanmeldt voor onze e-mails ontvang je marketingberichten.{' '}
                <a href="#privacy" className="underline hover:no-underline">
                  Lees meer hierover in ons privacybeleid
                </a>
                .
              </p>
            </StaggerItem>

          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
