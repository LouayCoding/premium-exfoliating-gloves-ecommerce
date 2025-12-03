'use client';

import { Star, Quote } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';

export function ReviewsSection() {
  const reviews = [
    {
      name: "Anouk V.",
      location: "Amsterdam",
      rating: 5,
      text: "Mijn huid was nog nooit zo zacht! Ik gebruik de HDS Washandje nu al 2 maanden en het verschil is ongelooflijk. Mijn ingegroeide haartjes zijn bijna helemaal weg!",
      verified: true
    },
    {
      name: "Sophie L.",
      location: "Rotterdam",
      rating: 5,
      text: "Echt, de dode huid valt er letterlijk af. Bizar! Ik was eerst sceptisch maar dit is echt een game-changer voor mijn huidverzorging routine.",
      verified: true
    },
    {
      name: "Lisa M.",
      location: "Utrecht",
      rating: 5,
      text: "Eindelijk een product dat doet wat het belooft. Mijn huid voelt zijdezacht aan en mijn self-tan gaat er nu perfect op. Absolute aanrader!",
      verified: true
    },
    {
      name: "Emma K.",
      location: "Den Haag",
      rating: 5,
      text: "Ik heb al zoveel scrubs geprobeerd maar dit is echt next level. Mijn 'strawberry legs' zijn nu zo glad. Ik bestel direct nog een pakket!",
      verified: true
    }
  ];

  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#fbf9f8]">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <ScrollReveal direction="up" duration={1.2} delay={0.1}>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <h2 className="text-3xl md:text-5xl font-avantt font-bold text-[#121212] mb-4">
              Wat onze 9,834+ klanten zeggen
            </h2>
            <p className="text-lg md:text-xl font-avantt text-gray-600">
              Echte reviews van echte mensen
            </p>
          </div>
        </ScrollReveal>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {reviews.map((review, index) => (
            <ScrollReveal 
              key={index}
              direction="up" 
              duration={1.2} 
              delay={0.2 + (index * 0.1)}
            >
              <div className="bg-white rounded-3xl p-8 border border-gray-100 transition-all duration-300 relative">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8 w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8941E] rounded-full flex items-center justify-center">
                  <Quote className="w-5 h-5 text-white" fill="currentColor" />
                </div>

                {/* Stars */}
                <div className="flex items-center space-x-1 mb-4 mt-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 font-avantt text-base leading-relaxed mb-6">
                  "{review.text}"
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-avantt font-bold text-[#121212]">
                      {review.name}
                    </div>
                    <div className="text-sm font-avantt text-gray-500">
                      {review.location}
                    </div>
                  </div>
                  {review.verified && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-avantt font-bold">
                      ✓ Geverifieerd
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust Stats */}
        <ScrollReveal direction="up" duration={1.2} delay={0.6}>
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-avantt font-bold text-[#121212] mb-2">
                  9,834+
                </div>
                <div className="text-sm md:text-base font-avantt text-gray-600">
                  Tevreden klanten
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-avantt font-bold text-[#121212] mb-2">
                  4.9
                </div>
                <div className="text-sm md:text-base font-avantt text-gray-600">
                  Gemiddelde score
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-avantt font-bold text-[#121212] mb-2">
                  98%
                </div>
                <div className="text-sm md:text-base font-avantt text-gray-600">
                  Zou aanbevelen
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
