'use client';

import { Check, Sparkles, Truck, Users } from 'lucide-react';

export function TrustBar() {
  const trustItems = [
    {
      icon: Sparkles,
      text: "100% Natuurzijde"
    },
    {
      icon: Check,
      text: "Zichtbaar in 3 min"
    },
    {
      icon: Users,
      text: "9,834+ Klanten"
    },
    {
      icon: Truck,
      text: "Vandaag besteld, morgen in huis"
    }
  ];

  return (
    <section className="py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-3 text-center md:text-left"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-[#1a1a1a]" strokeWidth={2.5} />
              </div>
              <span className="text-xs md:text-sm font-avantt font-bold text-gray-900 leading-tight">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
