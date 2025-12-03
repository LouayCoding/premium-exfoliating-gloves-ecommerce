import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { ProblemSolution } from "@/components/problem-solution";
import { HowItWorks } from "@/components/how-it-works";
import { ProductsSection } from "@/components/products-section";
import { FAQSection } from "@/components/faq-section";
import { GuaranteeCTA } from "@/components/guarantee-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-white">
        {/* 1. Hero - Full screen attention grabber */}
        <section id="home" className="pt-2 md:pt-4 pb-6 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <Hero />
          </div>
        </section>

        {/* 2. Trust Bar - Subtle social proof */}
        <TrustBar />

        {/* 3. PRODUCTEN - Direct zichtbaar! */}
        <section id="shop" className="py-10 md:py-16">
          <ProductsSection />
        </section>

        {/* 4. Benefits - Key features */}
        <section id="voordelen" className="py-10 md:py-16 bg-gray-50">
          <ProblemSolution />
        </section>

        {/* 5. How It Works - Simple explanation */}
        <section id="hoe-het-werkt" className="py-10 md:py-16">
          <HowItWorks />
        </section>

        {/* 6. FAQ - Remove objections */}
        <section id="faq" className="py-10 md:py-16 bg-gray-50">
          <FAQSection />
        </section>

        {/* 7. Guarantee - Final trust builder */}
        <section id="garantie" className="py-10 md:py-16">
          <GuaranteeCTA />
        </section>
      </main>
      <Footer />
    </>
  );
}
