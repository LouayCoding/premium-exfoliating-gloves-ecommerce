import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { StaggerContainer } from '@/components/motion/stagger-container';
import { StaggerItem } from '@/components/motion/stagger-item';

export function ExpertSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Image */}
          <ScrollReveal direction="left" distance={80} duration={1.5} delay={0.2} className="order-1 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden h-[28rem] md:h-[32rem] lg:h-[36rem]">
              <img 
                src="/images/hds-washandjes-premium-exfoliating-gloves-hero.webp" 
                alt="Huidverzorging expert demonstreert HDS Premium Exfoliating Gloves - Professionele exfoliatie technieken"
                className="w-full h-full object-cover scale-105"
                loading="lazy"
                width="600"
                height="500"
              />
            </div>
          </ScrollReveal>

          {/* Content */}
          <StaggerContainer staggerDelay={0.2} className="order-2 lg:order-2 space-y-6">
            
            {/* Title */}
            <StaggerItem direction="right" distance={60} duration={1.4}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-avantt font-medium text-[#121212] leading-none">
                Vertrouwd door experts. Bewezen door wetenschap.
              </h2>
            </StaggerItem>

            {/* Expert Info */}
            <StaggerItem direction="right" distance={50} duration={1.3}>
              <div className="space-y-4">
                <p className="text-base md:text-lg font-avantt text-gray-700 leading-relaxed">
                  Dr. Sarah de Vries, dermatoloog en wereldautoriteit op huidverzorging, over waarom exfoliatie essentieel is voor gezonde huid – en waarom het HDS Washandje haar topkeuze is.
                </p>

                {/* Quote */}
                <blockquote className="text-base md:text-lg font-avantt text-gray-700 leading-relaxed italic">
                  "Wetenschap toont aan dat exfoliatie zowel de kwaliteit als uitstraling van de huid verbetert. Het geeft je toegang tot diepere celvernieuwing – het is een gamechanger. Ik gebruik washandjes al meer dan een decennium, en het HDS Washandje sinds een paar maanden. De unieke weeftechniek is vooral cruciaal voor gevoelige huid."
                </blockquote>
              </div>
            </StaggerItem>

            {/* CTA Button */}
            <StaggerItem direction="right" distance={40} duration={1.2}>
              <div className="pt-4">
                <button 
                  onClick={() => {
                    const shopSection = document.getElementById('shop');
                    if (shopSection) {
                      shopSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-[#1a1a1a] hover:bg-[#0f0f0f] text-white font-avantt font-semibold px-6 py-3 rounded-lg text-sm uppercase tracking-wide transition-all duration-300 hover:scale-[1.02]"
                >
                  Shop HDS Washandje
                </button>
              </div>
            </StaggerItem>

          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
