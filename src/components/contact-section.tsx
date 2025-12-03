'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <ScrollReveal direction="up" duration={1.2} delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-avantt font-semibold text-[#121212] mb-3">
              Neem contact op
            </h2>
            <p className="text-lg font-avantt text-gray-600">
              We helpen je graag verder met je vragen
            </p>
          </div>
        </ScrollReveal>

        {/* Contact Card - Centered */}
        <ScrollReveal direction="up" duration={1.2} delay={0.2}>
          <div className="max-w-6xl mx-auto bg-[#fbf9f8] rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-5 gap-0">
              
              {/* Left: Product Image (2/5) */}
              <div className="md:col-span-2 p-8 md:p-12 flex items-center justify-center">
                <div className="relative aspect-square flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 w-full">
                  <img 
                    src="/images/hds-exfoliating-gloves-product-showcase.png" 
                    alt="Contact HDS - Premium Exfoliating Gloves voor vragen over washandjes en huidverzorging"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    width="400"
                    height="400"
                  />
                </div>
              </div>

              {/* Right: Contact Form (3/5) */}
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                
                {/* Form Header */}
                <div className="mb-6">
                  <h3 className="text-3xl md:text-4xl font-avantt font-bold text-[#121212] mb-3">
                    Stuur ons een bericht
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-avantt text-gray-600">
                      4.9 ⭐ (9,834 reviews)
                    </span>
                  </div>

                  <p className="text-base font-avantt text-gray-600 leading-relaxed">
                    Heb je een vraag over onze producten? Vul het formulier in en we nemen snel contact op.
                  </p>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                  
                  {/* Name Field */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Naam"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-avantt text-base text-[#121212] placeholder:text-gray-400 focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition-all"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-mailadres"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-avantt text-base text-[#121212] placeholder:text-gray-400 focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition-all"
                      required
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Onderwerp"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-avantt text-base text-[#121212] placeholder:text-gray-400 focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition-all"
                      required
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Je bericht..."
                      rows={3}
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl font-avantt text-base text-[#121212] placeholder:text-gray-400 focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition-all resize-none"
                      required
                    />
                  </div>
                </form>

                {/* CTA Button */}
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-[#1a1a1a] hover:bg-[#121212] text-white font-avantt font-semibold py-3 px-6 rounded-lg text-base uppercase tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-95 mb-6"
                >
                  Verstuur bericht
                </button>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-avantt text-gray-600 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-1">
                    <span>✓</span>
                    <span>Snelle reactie</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>✓</span>
                    <span>Gratis advies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>✓</span>
                    <span>9,834+ reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
