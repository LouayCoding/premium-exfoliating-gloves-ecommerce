'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, Instagram, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [customerName, setCustomerName] = useState('daar');
  const [customerEmail, setCustomerEmail] = useState('jouw@email.com');
  
  const orderId = orderData?.orderId || searchParams.get('order_id') || '12345';

  useEffect(() => {
    // Get order data from multiple sources
    const lastOrder = localStorage.getItem('lastOrder');
    const checkoutCart = localStorage.getItem('checkoutCart');
    const tempOrder = localStorage.getItem('tempOrder');
    
    // Check URL parameters for payment info
    const paymentId = searchParams.get('payment_id');
    const tempOrderId = searchParams.get('temp_order');
    const paymentStatus = searchParams.get('status');
    
    if (lastOrder) {
      const order = JSON.parse(lastOrder);
      setOrderData(order);
      if (order.customer?.name) setCustomerName(order.customer.name);
      if (order.customer?.email) setCustomerEmail(order.customer.email);
    } else if (tempOrder) {
      // Use temp order data (we have everything we need)
      const order = JSON.parse(tempOrder);
      setOrderData({
        orderId: tempOrderId || 'TEMP-ORDER',
        paymentId: paymentId,
        status: paymentStatus || 'paid',
        total: order.total,
        paymentMethod: order.paymentMethod,
        items: [{ name: 'HDS Premium Washandje', quantity: 1, price: order.total }]
      });
      console.log('📦 Using temp order data for success page:', order);
    } else if (checkoutCart) {
      // Fallback to checkout cart data
      const cart = JSON.parse(checkoutCart);
      setOrderData({ items: cart });
    }
    
    // Clear localStorage after use
    localStorage.removeItem('lastOrder');
    localStorage.removeItem('checkoutCart');
    
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500); // Faster loading
    return () => clearTimeout(timer);
  }, [searchParams]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        
        {/* Section 1: Reassurance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full blur-2xl opacity-50"></div>
              <CheckCircle className="w-20 h-20 text-green-500 relative" strokeWidth={2} />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-avantt font-bold text-[#121212] mb-4">
            Bedankt, {customerName}!<br />
            Je bestelling is bevestigd.
          </h1>
          <p className="text-xl font-avantt text-gray-600 mb-12">
            Je hebt een geweldige keuze gemaakt. De eerste stap naar een zijdezachte huid is gezet.
          </p>

          {/* What Happens Now */}
          <div className="bg-gray-50 rounded-2xl p-8 text-left max-w-2xl mx-auto">
            <h2 className="text-2xl font-avantt font-bold text-[#121212] mb-6 text-center">
              WAT GEBEURT ER NU?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-avantt font-bold text-[#121212] mb-1">
                    Bevestiging Gemaild
                  </h3>
                  <p className="text-sm font-avantt text-gray-600">
                    We hebben de orderbevestiging (#{orderId}) zojuist naar <span className="font-semibold">{customerEmail}</span> gestuurd.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Package className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-avantt font-bold text-[#121212] mb-1">
                    Priority Inpakken
                  </h3>
                  <p className="text-sm font-avantt text-gray-600">
                    Jouw bestelling wordt nu (met prioriteit) ingepakt door ons team.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Truck className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-avantt font-bold text-[#121212] mb-1">
                    Morgen in Huis
                  </h3>
                  <p className="text-sm font-avantt text-gray-600">
                    Je ontvangt zo snel mogelijk je Track & Trace. Je pakketje ligt morgen op de mat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Community */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-16 text-center"
        >
          <div className="flex justify-center mb-6">
            <Heart className="w-12 h-12 text-pink-600" />
          </div>
          <h2 className="text-3xl font-avantt font-bold text-[#121212] mb-4">
            Je hoort nu officieel bij de #HDSglow Community.
          </h2>
          <p className="text-lg font-avantt text-gray-700 mb-8 max-w-2xl mx-auto">
            We willen jouw transformatie zien! Deel een foto of video van jouw 'voor & na' of de "rollende huid" (je weet wat we bedoelen 😉) en tag <span className="font-bold">@HDSGloves</span> op Instagram of TikTok.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://instagram.com/hdsgloves"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-avantt font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Instagram className="w-5 h-5" />
              <span>Volg ons op Instagram</span>
            </a>
            <a
              href="https://tiktok.com/@hdsgloves"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#121212] hover:bg-black text-white font-avantt font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Volg ons op TikTok</span>
            </a>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-avantt font-bold text-[#121212] mb-2">
            Perfect! Je bent helemaal klaar.
          </h3>
          <p className="text-lg font-avantt text-gray-600 mb-8">
            We kijken ernaar uit om je te verwelkomen bij de #HDSglow community!
          </p>
          <Link
            href="/"
            className="inline-block bg-[#121212] hover:bg-black text-white font-avantt font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
          >
            Terug naar Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
