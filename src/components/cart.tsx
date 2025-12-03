'use client';

import { useCart } from '@/contexts/cart-context';
import { X, Plus, Minus, ShoppingBag, Lock, Check } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { calculateCartTotal } from '@/lib/utils/price';

export function Cart() {
  const { state, updateQuantity, removeFromCart, closeCart } = useCart();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const subtotal = calculateCartTotal(state.items);
  
  const progressPercentage = 100; // Always 100% for free shipping
  const amountToFreeShipping = 0; // Always 0 since shipping is always free

  // Prevent body scroll when cart is open on mobile
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [state.isOpen]);

  // Animate progress bar on mount and when subtotal changes
  useEffect(() => {
    if (progressBarRef.current && state.isOpen) {
      gsap.fromTo(
        progressBarRef.current,
        { width: '0%' },
        { width: `${progressPercentage}%`, duration: 1, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, [state.isOpen, progressPercentage]);


  const handleUpdateQuantity = async (key: string, quantity: number) => {
    await updateQuantity(key, quantity);
  };

  const handleRemoveItem = async (key: string) => {
    await removeFromCart(key);
  };

  const handleClose = () => {
    closeCart();
  };

  const handleCheckout = () => {
    // Save cart items to localStorage before navigation
    localStorage.setItem('checkoutCart', JSON.stringify(state.items));
    // Navigate to checkout page
    window.location.href = '/checkout';
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <motion.div
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Backdrop - Desktop: covers area left of cart, Mobile: covers full screen */}
          <div 
            className="absolute inset-0 bg-black/50 md:right-96 lg:right-[28rem]"
            onClick={handleClose}
          />

          {/* Cart Panel - Met witte safe area */}
          <motion.div 
            className="absolute top-0 right-0 h-full z-10 w-full md:w-96 lg:w-[28rem] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring',
              damping: 30,
              stiffness: 300,
              duration: 0.3
            }}
            style={{ 
              backgroundColor: 'white',
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 pb-4 md:pb-6 bg-white shadow-sm">
          <h2 className="text-lg md:text-xl font-avantt font-bold text-gray-900">
            Winkelwagen ({state.items.length})
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Sluit winkelwagen"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Free Shipping Badge */}
        {state.items.length > 0 && (
          <div className="px-4 md:px-6 py-4 flex justify-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-avantt font-bold text-[#1a1a1a]">
                Gratis verzending
              </span>
            </div>
          </div>
        )}

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            // Empty Cart
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-avantt font-medium text-gray-600 mb-2">
                Je winkelwagen is leeg
              </h3>
              <p className="text-sm font-avantt text-gray-500 mb-6">
                Voeg producten toe om te beginnen met winkelen
              </p>
              <button
                onClick={handleClose}
                className="bg-gray-900 hover:bg-black text-white font-avantt font-semibold px-6 py-3 rounded-lg text-sm uppercase tracking-wide transition-colors duration-200"
              >
                Verder winkelen
              </button>
            </div>
          ) : (
            // Cart Items
            <div className="p-3 md:p-6 space-y-4 md:space-y-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 md:space-x-4">
                  
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-sm font-avantt font-medium text-[#121212] mb-1 leading-tight">
                      {item.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-2 md:mb-3">
                      <span className="text-sm font-avantt font-medium text-gray-700">
                        {item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs font-avantt text-gray-400 line-through">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <motion.button
                          onClick={() => handleUpdateQuantity(item.key || `item-${item.id}`, item.quantity - 1)}
                          className="p-1.5 md:p-2 hover:bg-gray-50 transition-colors duration-200"
                          aria-label="Verminder aantal"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </motion.button>
                        <motion.span 
                          className="px-2 md:px-3 py-1.5 md:py-2 text-sm font-avantt font-medium text-[#121212] min-w-[1.5rem] md:min-w-[2rem] text-center"
                          key={item.quantity}
                          initial={{ scale: 1.2, color: '#ef4444' }}
                          animate={{ scale: 1, color: '#121212' }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.quantity}
                        </motion.span>
                        <motion.button
                          onClick={() => handleUpdateQuantity(item.key || `item-${item.id}`, item.quantity + 1)}
                          className="p-1.5 md:p-2 hover:bg-gray-50 transition-colors duration-200"
                          aria-label="Verhoog aantal"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => handleRemoveItem(item.key || `item-${item.id}`)}
                        className="text-xs font-avantt text-gray-500 hover:text-red-500 transition-colors duration-200 underline"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Verwijderen
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-200 px-4 md:px-6 pt-4 md:pt-6 pb-6 space-y-3 md:space-y-4 bg-white">
            
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base font-avantt font-medium text-gray-700">
                Subtotaal
              </span>
              <span className="text-sm md:text-base font-avantt font-semibold text-[#121212]">
                €{subtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base font-avantt font-medium text-gray-700">
                Verzending
              </span>
              <span className="text-sm md:text-base font-avantt font-semibold text-green-600">
                Gratis
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 pt-2 md:pt-3">
              {/* Total */}
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-base md:text-lg font-avantt font-bold text-[#121212]">
                  Totaal
                </span>
                <span className="text-lg md:text-2xl font-avantt font-bold text-[#121212]">
                  €{subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Checkout Button - Goud */}
            <button 
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] hover:from-[#C19B2E] hover:to-[#E0C038] disabled:opacity-50 disabled:cursor-not-allowed text-[#1a1a1a] font-avantt font-bold py-4 rounded-lg text-sm uppercase tracking-wide transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-[#D4AF37]/20"
            >
              {isCheckoutLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1a1a1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Bezig met laden...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Afrekenen</span>
                </>
              )}
            </button>

            {/* Trust Elements */}
            <div className="flex items-center justify-center space-x-4 text-xs font-avantt text-gray-600">
              <div className="flex items-center space-x-1">
                <Check className="w-4 h-4 text-gray-900" />
                <span>30 dagen garantie</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4 text-gray-900" />
                <span>Veilig betalen</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-3 md:pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {/* iDEAL */}
                <div className="h-6 w-10 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 40 24" className="h-4 w-6">
                    <rect width="40" height="24" fill="#CC0066"/>
                    <text x="20" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">iDEAL</text>
                  </svg>
                </div>
                
                {/* Visa */}
                <div className="h-6 w-10 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 40 24" className="h-4 w-6">
                    <rect width="40" height="24" fill="#1A1F71"/>
                    <text x="20" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">VISA</text>
                  </svg>
                </div>
                
                {/* Mastercard */}
                <div className="h-6 w-10 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 40 24" className="h-4 w-6">
                    <rect width="40" height="24" fill="white"/>
                    <circle cx="15" cy="12" r="6" fill="#EB001B"/>
                    <circle cx="25" cy="12" r="6" fill="#F79E1B"/>
                    <path d="M20 7.5c1.5 1.2 2.5 3 2.5 4.5s-1 3.3-2.5 4.5c-1.5-1.2-2.5-3-2.5-4.5s1-3.3 2.5-4.5z" fill="#FF5F00"/>
                  </svg>
                </div>
                
                {/* PayPal */}
                <div className="h-6 w-10 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 40 24" className="h-4 w-6">
                    <rect width="40" height="24" fill="#003087"/>
                    <path d="M8 8h6c2 0 3 1 3 3s-1 3-3 3h-3l-1 4h-2l2-10zm18 0h6c2 0 3 1 3 3s-1 3-3 3h-3l-1 4h-2l2-10z" fill="#009CDE"/>
                    <path d="M8 8h6c2 0 3 1 3 3s-1 3-3 3h-3l-1 4h-2l2-10zm18 0h6c2 0 3 1 3 3s-1 3-3 3h-3l-1 4h-2l2-10z" fill="#012169"/>
                  </svg>
                </div>
                
                {/* Klarna */}
                <div className="h-6 w-10 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 40 24" className="h-4 w-6">
                    <rect width="40" height="24" fill="#FFB3C7"/>
                    <text x="20" y="16" textAnchor="middle" fill="#000" fontSize="7" fontWeight="bold">Klarna</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={handleClose}
              className="w-full text-center text-sm font-avantt text-gray-600 hover:text-gray-900 transition-colors duration-200 underline"
            >
              Verder winkelen
            </button>
          </div>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
