'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Hoe vaak moet ik 'm gebruiken?",
      answer: "1-2 keer per week voor de beste resultaten. Je huid heeft tijd nodig om te herstellen tussen sessies. Bij gevoelige huid? Start met 1 keer per week."
    },
    {
      question: "Is dit voor een gevoelige huid?",
      answer: "Ja! Gemaakt van 100% natuurzijde - perfect voor zelfs de meest gevoelige huid. Geen agressieve chemicaliën, geen microplastics. Wel even rustig aan doen in het begin."
    },
    {
      question: "Hoe maak ik de glove schoon?",
      answer: "Super simpel: Spoel 'm uit met warm water na elk gebruik. Laat drogen aan de lucht. Klaar. Voor een diepe reiniging: 1x per maand in de wasmachine op 30°C (geen wasverzachter)."
    },
    {
      question: "Wanneer vervang ik 'm?",
      answer: "Na 3-6 maanden intensief gebruik. Je merkt het zelf: de textuur wordt zachter en minder effectief. Daarom kiezen slimme klanten direct voor een 2- of 3-pack - dan heb je altijd een verse."
    }
  ];

  return (
    <section className="bg-transparent">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-avantt font-bold text-gray-900 mb-3">
            Veelgestelde Vragen
          </h2>
          <p className="text-base font-avantt text-gray-600">
            Alles wat je moet weten
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-white rounded-lg overflow-hidden transition-all duration-200 ${
                  isOpen 
                    ? 'ring-2 ring-[#D4AF37]' 
                    : 'ring-1 ring-gray-200 hover:ring-gray-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-base font-avantt font-bold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]' : 'bg-gray-100'
                  }`}>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#1a1a1a]' : 'text-gray-600'
                      }`}
                    />
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <p className="text-sm font-avantt text-gray-600 leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
