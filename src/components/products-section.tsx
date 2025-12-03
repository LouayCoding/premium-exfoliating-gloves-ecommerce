'use client';

import { Star, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCart } from '@/contexts/cart-context';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { ProductPrice } from '@/components/product-price';
import { ProductStock } from '@/components/product-stock';
import { useProducts } from '@/hooks/use-products';

// Helper function to determine product attributes based on name/quantity
function getProductAttributes(product: any) {
  const name = product.name.toLowerCase();
  
  // Use the variation name directly (e.g., "1+1 Gratis (2 Paar)")
  let quantity = 1;
  let label = product.name;
  let badge = null;
  let popular = false;
  let discount = null;
  
  // Detect quantity from variation name and create clean labels
  if (name.includes('1+1')) {
    quantity = 2;
    label = "1+1 GRATIS";
    badge = null;
    popular = false;
  } else if (name.includes('2+2')) {
    quantity = 4;
    label = "2+2 GRATIS";
    badge = "POPULAIRSTE KEUZE";
    popular = true;
  } else if (name.includes('3+3')) {
    quantity = 6;
    label = "3+3 GRATIS";
    badge = "BESTE DEAL";
    popular = false;
  }

  // Only show discount if WooCommerce actually has the product on sale
  if (product.onSale && product.regularPrice && product.salePrice) {
    const savings = product.regularPrice - product.salePrice;
    const percentage = Math.round((savings / product.regularPrice) * 100);
    discount = `${percentage}% Korting`;
  }
  
  return {
    id: product.id,
    quantity,
    label,
    price: product.price,
    pricePerItem: product.price / quantity,
    originalPrice: product.onSale && product.regularPrice ? product.regularPrice : null,
    savings: product.onSale && product.regularPrice ? product.regularPrice - product.price : null,
    discount,
    badge,
    popular
  };
}

export function ProductsSection() {
  const { products, isLoading, error, refresh } = useProducts();
  const { addToCart, state } = useCart();

  // Transform WooCommerce products into pack options
  const packOptions = useMemo(() => {
    return products.map(getProductAttributes).sort((a, b) => a.quantity - b.quantity);
  }, [products]);

  const [selectedPack, setSelectedPack] = useState<any>(null);

  // Set default selection when products load
  useMemo(() => {
    if (packOptions.length > 0 && !selectedPack) {
      // Default to "MEEST GEKOZEN" (5 Stuks) if available, otherwise first option
      const defaultPack = packOptions.find(pack => pack.badge === "MEEST GEKOZEN") || packOptions[0];
      setSelectedPack(defaultPack);
    }
  }, [packOptions, selectedPack]);

  const handleAddToCart = async () => {
    console.log('🛒 Add to cart clicked!', {
      selectedPack,
      isWooCommerceMode: state.isWooCommerceMode,
      cartState: state
    });
    
    if (!selectedPack) {
      console.error('❌ Geen product geselecteerd');
      alert('Selecteer eerst een product');
      return;
    }
    
    // Add to WooCommerce cart using real product ID
    const success = await addToCart(selectedPack.id, 1);
    
    if (success) {
      console.log(`✅ Product ${selectedPack.id} toegevoegd aan WooCommerce cart!`);
    } else {
      console.error('❌ Fout bij toevoegen aan cart', {
        productId: selectedPack.id,
        isWooCommerceMode: state.isWooCommerceMode
      });
      
      // Show user-friendly error message
      if (!state.isWooCommerceMode) {
        alert('WooCommerce is momenteel niet beschikbaar. Probeer het later opnieuw.');
      } else {
        alert('Er is een fout opgetreden bij het toevoegen aan de winkelwagen. Probeer het opnieuw.');
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
            <p className="text-gray-600">Producten laden...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Kan producten niet laden
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={refresh}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  🔄 Opnieuw proberen
                </button>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Pagina herladen
                </button>
              </div>
            </div>
            <details className="text-left text-sm text-gray-600">
              <summary className="cursor-pointer font-medium mb-2">Technische details</summary>
              <div className="bg-gray-50 p-3 rounded border text-xs">
                <p><strong>Error:</strong> {error}</p>
                <p><strong>Tijd:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_REST_API_ENDPOINT || 'Niet geconfigureerd'}</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    );
  }

  // No products or no selected pack
  if (packOptions.length === 0 || !selectedPack) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Geen producten beschikbaar</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        
        <ScrollReveal direction="up" duration={1} delay={0.1}>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start max-w-5xl mx-auto">
            
            {/* LEFT: Product Photos */}
            <div className="space-y-4 max-w-md mx-auto md:mx-0">
              {/* Main Product Photo - Volledig zichtbaar */}
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden p-6">
                <img 
                  src="/images/hds-exfoliating-gloves-product-showcase.png" 
                  alt="HDS Premium Exfoliating Gloves - Professionele washandjes voor zijdezachte huid en dode huidcellen verwijdering"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  width="500"
                  height="500"
                />
              </div>
            </div>

            {/* RIGHT: Product Offer */}
            <div className="md:sticky md:top-8">
              {/* Title & Rating */}
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-avantt font-bold text-gray-900 mb-2">
                  HDS Premium Washandje
                </h2>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-avantt text-gray-600">
                    4.9 (9,834 reviews)
                  </span>
                </div>

                <p className="text-base font-avantt text-gray-600 leading-relaxed">
                  Professionele exfoliatie voor zijdezachte huid in 3 minuten.
                </p>
              </div>

              {/* Bundle Options */}
              <div className="mb-6">
                <h3 className="text-sm font-avantt font-bold text-gray-700 mb-4 uppercase tracking-wide">
                  Kies je deal
                </h3>
                <div className="space-y-3">
                  {packOptions.map((pack) => {
                    const isSelected = selectedPack.id === pack.id;
                    const isPopular = pack.badge === "POPULAIRSTE KEUZE";
                    const isBestDeal = pack.badge === "BESTE DEAL";
                    
                    return (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPack(pack)}
                        className={`relative w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-gray-900 bg-white'
                            : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                      >
                        {/* Badge - Goud voor populair */}
                        {isPopular && (
                          <div className="absolute -top-2.5 left-4 px-3 py-1 rounded-md font-avantt font-bold text-xs uppercase tracking-wide bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#1a1a1a]">
                            Populair
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Radio + Label */}
                          <div className="flex items-center space-x-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'border-gray-900 bg-gray-900'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-avantt font-semibold text-base text-gray-900">
                                {pack.label}
                              </div>
                              <div className="text-sm font-avantt text-gray-500 mt-0.5">
                                {pack.quantity} paar
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-avantt font-bold text-lg text-gray-900">
                              <ProductPrice 
                                productId={pack.id}
                                fallbackPrice={pack.price}
                                className="justify-end"
                                showSource={false}
                              />
                            </div>
                            {pack.savings && (
                              <div className="text-xs font-avantt font-medium text-green-600 mt-0.5">
                                Bespaar €{pack.savings.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            {/* Stock Status */}
            <div className="mb-4 flex justify-center">
              <ProductStock 
                productId={selectedPack.id}
                fallbackStock={100}
                showIcon={true}
                showCount={true}
                realTime={true}
              />
            </div>

            {/* CTA Button - Goud en prominent */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] hover:from-[#C19B2E] hover:to-[#E0C038] text-[#1a1a1a] font-avantt font-bold py-4 px-6 rounded-lg text-base uppercase tracking-wide transition-all duration-200 mb-6 shadow-lg shadow-[#D4AF37]/20"
            >
              Toevoegen aan winkelwagen
            </button>

              {/* Trust Elements - Subtiel */}
              <div className="space-y-3 mb-4">
                {/* Guarantee - Simpel */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-gray-900" strokeWidth={2} />
                  <span className="font-avantt">30 dagen geld-terug-garantie</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-gray-900" strokeWidth={2} />
                  <span className="font-avantt">Gratis verzending</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-gray-900" strokeWidth={2} />
                  <span className="font-avantt">9,834+ tevreden klanten</span>
                </div>
              </div>

              {/* Payment Methods - Heel subtiel */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-400 font-avantt">Betaalmethoden:</span>
                  <span className="text-xs text-gray-500 font-avantt">iDEAL</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-500 font-avantt">Klarna</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-500 font-avantt">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
