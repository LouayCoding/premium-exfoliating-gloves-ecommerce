'use client';

import { Sparkles, Heart, Sun, Star } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';

export function ProblemSolution() {

  const benefits = [
    {
      icon: Sparkles,
      benefit: "Zijdezachte Huid",
      description: "Verwijdert moeiteloos dode huidcellen voor een stralende, zachte teint"
    },
    {
      icon: Heart,
      benefit: "Gladde Benen",
      description: "Voorkomt en vermindert ingegroeide haartjes voor perfect gladde benen"
    },
    {
      icon: Sun,
      benefit: "Perfecte Tan",
      description: "Creëert de ideale, egale basis voor een vlekkeloze self-tan"
    },
    {
      icon: Star,
      benefit: "Natuurlijke Glow",
      description: "Stimuleert de bloedsomloop voor een gezonde, stralende huid"
    }
  ];

  return (
    <section className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <ScrollReveal direction="up" duration={1} delay={0.1}>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-avantt font-bold text-gray-900 mb-3">
              Waarom HDS Washandje?
            </h2>
            <p className="text-base font-avantt text-gray-600 max-w-2xl mx-auto">
              De voordelen die 9,834+ klanten al ervaren
            </p>
          </div>
        </ScrollReveal>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((item, index) => (
            <ScrollReveal 
              key={index}
              direction="up" 
              duration={1.2} 
              delay={0.2 + (index * 0.1)}
            >
              <div className="text-center group transition-all duration-300">
                {/* Icon - Goud */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-[#1a1a1a]" strokeWidth={2} />
                  </div>
                </div>

                {/* Benefit */}
                <h3 className="text-base font-avantt font-bold text-gray-900 mb-2">
                  {item.benefit}
                </h3>

                {/* Description */}
                <p className="text-sm font-avantt text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Banner - Goud */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-xl p-8 md:p-10 text-center">
            <h3 className="text-xl md:text-2xl font-avantt font-bold text-[#1a1a1a] mb-3">
              Klaar voor zijdezachte huid?
            </h3>
            <p className="text-base font-avantt text-[#1a1a1a]/80 mb-6">
              Sluit je aan bij 9,834+ tevreden klanten
            </p>
            <button
              onClick={() => {
                const shopSection = document.getElementById('shop');
                if (shopSection) {
                  shopSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#1a1a1a] hover:bg-black text-white font-avantt font-bold py-3 px-8 rounded-lg text-sm uppercase tracking-wide transition-all duration-200"
            >
              Bekijk producten
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
