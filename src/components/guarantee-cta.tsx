'use client';

import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { useCart } from '@/contexts/cart-context';

export function GuaranteeCTA() {
  const { addToCart, openCart } = useCart();

  const handleCTA = () => {
    // Scroll to product section
    const productSection = document.getElementById('shop');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-transparent">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Final CTA - Goud */}
        <ScrollReveal direction="up" duration={1} delay={0.2}>
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-xl p-6 md:p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl md:text-2xl font-avantt font-bold text-[#1a1a1a] mb-2">
                Klaar voor zijdezachte huid?
              </h2>
              <p className="text-sm font-avantt text-[#1a1a1a]/80 mb-4">
                Sluit je aan bij 9,834+ tevreden klanten
              </p>

              {/* CTA Button */}
              <button
                onClick={handleCTA}
                className="w-full md:w-auto bg-[#1a1a1a] hover:bg-black text-white font-avantt font-bold py-3 px-8 rounded-lg text-sm uppercase tracking-wide transition-all duration-200 mb-4"
              >
                Bekijk producten
              </button>

              {/* Mini trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-avantt text-[#1a1a1a]/70">
                <span>✓ Gratis verzending</span>
                <span>✓ 30 dagen garantie</span>
                <span>✓ 9,834+ klanten</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
