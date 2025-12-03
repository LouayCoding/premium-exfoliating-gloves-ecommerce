'use client';

import { Star } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';

export function ProofSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <ScrollReveal direction="up" duration={1.2} delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-avantt font-bold text-[#121212] mb-4">
              Zie het Resultaat
            </h2>
            <p className="text-lg md:text-xl font-avantt text-gray-600">
              Geen filter, gewoon een zachte huid
            </p>
          </div>
        </ScrollReveal>

        {/* Before & After Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Before */}
          <ScrollReveal direction="left" duration={1.2} delay={0.2}>
            <div className="relative group">
              <div className="absolute -top-4 left-4 bg-red-500 text-white px-6 py-2 rounded-full font-avantt font-bold z-10">
                VOOR
              </div>
              <div className="aspect-[4/3] bg-gray-200 rounded-3xl overflow-hidden border border-gray-200">
                <img 
                  src="/images/hds-washandjes-premium-exfoliating-gloves-hero.webp" 
                  alt="Voor behandeling - Droge huid voordat HDS Exfoliating Gloves gebruikt werden"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width="400"
                  height="300"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* After */}
          <ScrollReveal direction="right" duration={1.2} delay={0.3}>
            <div className="relative group">
              <div className="absolute -top-4 left-4 bg-gradient-to-r from-[#D4AF37] to-[#B8941E] text-white px-6 py-2 rounded-full font-avantt font-bold z-10">
                NA
              </div>
              <div className="aspect-[4/3] bg-gray-200 rounded-3xl overflow-hidden border border-gray-200">
                <img 
                  src="/images/hds-washandjes-premium-exfoliating-gloves-hero.webp" 
                  alt="Na behandeling - Gladde zijdezachte huid na gebruik van HDS Premium Exfoliating Gloves"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width="400"
                  height="300"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Customer Photos Grid */}
        <ScrollReveal direction="up" duration={1.2} delay={0.4}>
          <div className="bg-[#fbf9f8] rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-avantt font-bold text-[#121212] text-center mb-8">
              Echte resultaten van echte klanten
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="group relative">
                  <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100">
                    <img 
                      src="/images/hds-exfoliating-gloves-product-showcase.png" 
                      alt={`HDS Exfoliating Gloves klantervaring ${index + 1} - Tevreden klant toont resultaten van premium washandjes`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      width="300"
                      height="300"
                    />
                  </div>
                  {/* Rating overlay */}
                  <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-avantt font-bold">5.0</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA to reviews */}
            <div className="text-center mt-8">
              <a 
                href="#reviews" 
                className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#B8941E] hover:opacity-90 text-white font-avantt font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105"
              >
                Bekijk alle 9,834+ reviews
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
