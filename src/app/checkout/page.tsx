'use client';

import { useEffect, useState, useRef } from 'react';
import { useCart } from '@/contexts/cart-context';
import { Lock, Clock, Check, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';
import { calculateCartTotal } from '@/lib/utils/price';

export default function CheckoutPage() {
  const { state } = useCart();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [paymentMethod, setPaymentMethod] = useState('ideal');
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);

  // Load cart from localStorage or context
  useEffect(() => {
    console.log('🛒 Loading cart data...', { 
      localStorage: localStorage.getItem('checkoutCart'),
      contextItems: state.items 
    });
    
    const savedCart = localStorage.getItem('checkoutCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      console.log('📦 Using saved cart:', parsedCart);
      setCartItems(parsedCart);
    } else if (state.items.length > 0) {
      console.log('📦 Using context cart:', state.items);
      setCartItems(state.items);
    } else {
      console.log('❌ No cart data found, redirecting to home');
      // Redirect if no cart data
      router.push('/');
    }
  }, [state.items, router]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Pulse animation on timer
  useEffect(() => {
    if (timerRef.current && timeLeft <= 60) {
      gsap.to(timerRef.current, {
        scale: 1.05,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const subtotal = calculateCartTotal(cartItems);

  const shipping = 0; // Always free shipping
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('🚀 Checkout form submitted!');
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Get form data from the form element
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      // Prepare customer data
      const customer = {
        email: formData.get('email') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        address: formData.get('address') as string,
        apartment: formData.get('apartment') as string,
        postcode: formData.get('postcode') as string,
        city: formData.get('city') as string,
        country: formData.get('country') as string || 'NL',
      };

      // Validate required fields
      console.log('🔍 Validating customer data:', customer);
      
      const missingFields = [];
      if (!customer.email) missingFields.push('email');
      if (!customer.firstName) missingFields.push('firstName');
      if (!customer.lastName) missingFields.push('lastName');
      if (!customer.address) missingFields.push('address');
      if (!customer.postcode) missingFields.push('postcode');
      if (!customer.city) missingFields.push('city');
      
      if (missingFields.length > 0) {
        console.log('❌ Missing required fields:', missingFields);
        alert(`Vul alle verplichte velden in: ${missingFields.join(', ')}`);
        setIsProcessing(false);
        return;
      }
      
      console.log('✅ All required fields present');

      // Prepare order data for API
      const orderData = {
        items: cartItems,
        customer: customer,
        paymentMethod: paymentMethod,
        emailOptIn: emailOptIn,
      };

      console.log('🛒 Submitting order:', orderData);

      // Submit to checkout API
      console.log('📡 Making API call to /api/checkout...');
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('📡 API response status:', response.status);
      const result = await response.json();
      console.log('📡 API response data:', result);
      
      // Log full response for debugging
      if (!response.ok) {
        console.error('❌ API returned error status:', response.status);
        console.error('❌ Error details:', result);
      }

      // Pre-store temp order data immediately after getting response
      if (result.success && result.tempOrderId && result.paymentId) {
        const tempOrderData = {
          tempOrderId: result.tempOrderId,
          paymentId: result.paymentId,
          total: result.total,
          paymentMethod: result.paymentMethod,
          timestamp: Date.now()
        };
        
        localStorage.setItem('tempOrder', JSON.stringify(tempOrderData));
        console.log('💾 Pre-stored temp order data:', tempOrderData);
        
        // Verify storage worked
        const stored = localStorage.getItem('tempOrder');
        console.log('🔍 Verification - stored data:', stored);
      }

      if (result.success) {
        console.log('✅ Order processed successfully:', result);
        
        // Save order data for success page
        const successData = {
          orderId: result.orderId,
          orderKey: result.orderKey,
          status: result.status,
          total: result.total,
          items: cartItems,
          customer: customer,
          woocommerce: result.woocommerce,
          mollie: result.mollie,
          paymentMethod: result.paymentMethod,
          paymentUrl: result.paymentUrl,
        };
        localStorage.setItem('lastOrder', JSON.stringify(successData));
        
        // Clear cart after successful order
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hds-cart');
          localStorage.removeItem('checkoutCart');
        }
        
        console.log('🎯 Redirecting to Mollie payment:', result.paymentUrl);
        
        // Direct Mollie integration - redirect to Mollie checkout
        if (result.directIntegration && result.paymentUrl) {
          // localStorage already stored above, just redirect
          console.log('🔄 Redirecting to Mollie payment...');
          window.location.href = result.paymentUrl;
        } else {
          // Fallback to old flow or error
          router.push(result.successUrl || '/success');
        }
      } else {
        console.error('❌ Order failed:', result);
        
        // Handle different error types
        if (result.error === 'service_unavailable') {
          alert('🚨 Webshop Storing\n\nOnze webshop ondervindt momenteel technische problemen. Probeer het over een paar minuten opnieuw of neem contact met ons op.\n\nSorry voor het ongemak!');
        } else if (result.error === 'order_creation_failed') {
          alert('❌ Bestelling Mislukt\n\nEr is een fout opgetreden bij het verwerken van je bestelling. Controleer je gegevens en probeer het opnieuw.\n\nAls het probleem aanhoudt, neem dan contact met ons op.');
        } else {
          alert(`Bestelling mislukt: ${result.message || result.error || 'Onbekende fout'}`);
        }
        
        setIsProcessing(false);
      }

    } catch (error) {
      console.error('💥 Checkout error:', error);
      alert('Er is een fout opgetreden bij het verwerken van je bestelling. Probeer het opnieuw.');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-avantt font-bold text-gray-900 mb-4">
            Je winkelwagen is leeg
          </h1>
          <p className="text-gray-600 mb-6">
            Voeg eerst producten toe aan je winkelwagen
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#121212] text-white px-6 py-3 rounded-full font-avantt font-semibold hover:bg-black transition-colors"
          >
            Terug naar winkel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* One-Page Form - wraps entire checkout */}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column - Form Fields - EERST op mobiel */}
            <div className="order-1 lg:order-1">
              

              {/* Form Fields - Clean zonder card */}
              <div>
              
              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-xl md:text-2xl font-avantt font-bold text-[#121212] mb-6">
                  Contact
                </h3>
                <input
                  type="email"
                  name="email"
                  placeholder="E-mailadres"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-avantt text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
                <label className="flex items-center mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailOptIn}
                    onChange={(e) => setEmailOptIn(e.target.checked)}
                    className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] accent-[#D4AF37]"
                  />
                  <span className="ml-2 text-sm font-avantt text-gray-600">
                    Stuur mij updates & spa-tips via e-mail
                  </span>
                </label>
              </div>

              {/* Divider */}
              <div className="my-8"></div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h3 className="text-xl md:text-2xl font-avantt font-bold text-[#121212] mb-6">
                  Verzending
                </h3>
                <div className="space-y-4">
                  <select
                    name="country"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-avantt text-gray-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    defaultValue="NL"
                  >
                    <option value="NL">Nederland</option>
                    <option value="BE">België</option>
                  </select>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Voornaam"
                      required
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-avantt text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Achternaam"
                      required
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-avantt text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>

                  <input
                    type="text"
                    name="address"
                    placeholder="Adres"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-avantt text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />

                  <input
                    type="text"
                    name="apartment"
                    placeholder="Appartement (optioneel)"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-avantt text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="postcode"
                      placeholder="Postcode"
                      required
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-avantt text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="Stad"
                      required
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-avantt text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>

                </div>
                
                {/* Shipping Method - Clean */}
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-lg p-4 flex items-center justify-between mt-4">
                  <div>
                    <div className="font-avantt font-bold text-[#1a1a1a]">
                      PostNL
                    </div>
                    <div className="text-sm font-avantt text-[#1a1a1a]/70">
                      Vandaag besteld, morgen in huis
                    </div>
                  </div>
                  <div className="font-avantt font-bold text-[#1a1a1a]">
                    GRATIS
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-8"></div>

              {/* Payment Method */}
              <div className="mb-0">
                <h3 className="text-xl md:text-2xl font-avantt font-bold text-[#121212] mb-6">
                  Betaling
                </h3>
                <div className="space-y-3">
                  {['ideal', 'klarna', 'creditcard', 'bancontact', 'paypal'].map((method) => (
                    <label
                      key={method}
                      className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-[#D4AF37] hover:ring-1 hover:ring-[#D4AF37] transition-all duration-200"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-[#D4AF37] border-gray-300 focus:ring-[#D4AF37]"
                      />
                      <span className="ml-3 font-avantt font-semibold text-[#121212] capitalize">
                        {method === 'ideal' ? 'iDEAL' : method}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              </div>
            </div>

          {/* Right Column - Order Summary - TWEEDE op mobiel */}
          <div className="order-2 lg:order-2">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm lg:sticky lg:top-24">
              
              <h3 className="text-xl md:text-2xl font-avantt font-bold text-[#121212] mb-6">
                Jouw bestelling
              </h3>

              {/* Products */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-xs font-avantt font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-avantt font-semibold text-[#121212]">
                        {item.name}
                      </div>
                    </div>
                    <div className="font-avantt font-bold text-[#121212]">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>


              {/* Cost Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm font-avantt">
                  <span className="text-gray-600">Subtotaal</span>
                  <span className="font-semibold text-[#121212]">€{subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-avantt">
                  <span className="text-gray-600">Verzending</span>
                  <span className="font-semibold text-green-600">
                    Gratis
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex items-center justify-between">
                  <span className="text-lg font-avantt font-bold text-[#121212]">Totaal (incl. BTW)</span>
                  <span className="text-2xl font-avantt font-bold text-[#121212]">€{total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Checkout Button - Touch-friendly */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full min-h-[56px] bg-[#121212] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-avantt font-bold py-5 rounded-full text-base md:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 mb-6 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Bezig met verwerken...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>JA, VOLTOOI MIJN BESTELLING</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="flex flex-col items-center space-y-2 text-xs font-avantt text-gray-600 text-center">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>30 Dagen Zijdezacht-Garantie</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>100% Beveiligde SSL-Betaling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Eenvoudig Retourneren</span>
                </div>
              </div>
            </div>
          </div>

          </div>
        </form>
      </div>
      
      {/* Simple Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 font-avantt">
              © 2025 HDS Gloves. Alle rechten voorbehouden.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600 font-avantt">
              <a href="#privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#algemene-voorwaarden" className="hover:text-gray-900 transition-colors">Algemene Voorwaarden</a>
              <a href="mailto:info@hdsgloves.nl" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 font-avantt">Veilig betalen met:</span>
              <div className="flex items-center space-x-1">
                {/* iDEAL */}
                <div className="h-5 w-8 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 32 20" className="h-3 w-5">
                    <rect width="32" height="20" fill="#CC0066"/>
                    <text x="16" y="13" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">iDEAL</text>
                  </svg>
                </div>
                
                {/* Visa */}
                <div className="h-5 w-8 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 32 20" className="h-3 w-5">
                    <rect width="32" height="20" fill="#1A1F71"/>
                    <text x="16" y="13" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">VISA</text>
                  </svg>
                </div>
                
                {/* Mastercard */}
                <div className="h-5 w-8 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 32 20" className="h-3 w-5">
                    <rect width="32" height="20" fill="white"/>
                    <circle cx="12" cy="10" r="4.5" fill="#EB001B"/>
                    <circle cx="20" cy="10" r="4.5" fill="#F79E1B"/>
                    <path d="M16 6.5c1.2 1 2 2.5 2 3.5s-.8 2.5-2 3.5c-1.2-1-2-2.5-2-3.5s.8-2.5 2-3.5z" fill="#FF5F00"/>
                  </svg>
                </div>
                
                {/* PayPal */}
                <div className="h-5 w-8 bg-white rounded border border-gray-200 flex items-center justify-center">
                  <svg viewBox="0 0 32 20" className="h-3 w-5">
                    <rect width="32" height="20" fill="#003087"/>
                    <text x="16" y="13" textAnchor="middle" fill="#009CDE" fontSize="6" fontWeight="bold">PayPal</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
