'use client';

import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useState } from 'react';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { StaggerContainer } from '@/components/motion/stagger-container';
import { StaggerItem } from '@/components/motion/stagger-item';

const socialVideos = [
  {
    id: 1,
    title: "Shop HDS Washandje Pro",
    subtitle: "Mijn huid heeft nog nooit zo zacht aangevoeld",
    thumbnail: "/images/hds-premium-exfoliating-gloves-hero-image.png"
  },
  {
    id: 2,
    title: "Shop HDS Washandje",
    subtitle: "eindelijk kan ik mijn benen laten zien zonder schaamte",
    thumbnail: "/images/hds-premium-exfoliating-gloves-hero-image.png"
  },
  {
    id: 3,
    title: "Shop HDS Deluxe Set",
    subtitle: "Ze hebben het ontwerp opnieuw uitgevonden voor gevoelige huid",
    thumbnail: "/images/hds-premium-exfoliating-gloves-hero-image.png"
  },
  {
    id: 4,
    title: "Shop HDS Wellness Kit",
    subtitle: "Ongelooflijk comfortabel",
    thumbnail: "/images/hds-premium-exfoliating-gloves-hero-image.png"
  },
  {
    id: 5,
    title: "Shop HDS Spa Collection",
    subtitle: "Ik merk echt het verschil met gewone washandjes",
    thumbnail: "/images/hds-premium-exfoliating-gloves-hero-image.png"
  }
];

export function SocialProofSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % socialVideos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + socialVideos.length) % socialVideos.length);
  };

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <ScrollReveal direction="up" duration={1.4} delay={0.1}>
          <div className="flex items-start justify-between mb-12">
            <div>
              <p className="text-sm font-avantt text-gray-600 mb-2">
                Zie de @hdsgloves lifestyle in actie
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-avantt font-medium text-[#121212] leading-tight">
                Sluit je aan bij 640K+ tevreden klanten
              </h2>
            </div>
            
            {/* Navigation Arrows */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                aria-label="Previous videos"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                aria-label="Next videos"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Video Grid */}
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {socialVideos.map((video, index) => (
            <StaggerItem key={video.id} direction="up" distance={50} duration={1.2} className="group cursor-pointer">
              
              {/* Video Thumbnail */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-all duration-200">
                    <Play className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" />
                  </div>
                </div>

                {/* Text Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-avantt font-medium leading-tight">
                    {video.subtitle}
                  </p>
                </div>
              </div>

              {/* Video Title */}
              <h3 className="text-sm font-avantt font-medium text-[#121212] hover:underline">
                {video.title} →
              </h3>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Mobile Dots Navigation */}
        <ScrollReveal direction="fade" delay={0.6} duration={1.0}>
          <div className="flex justify-center mt-8 md:hidden">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(socialVideos.length / 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 2)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    Math.floor(currentIndex / 2) === index ? 'bg-[#121212]' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
