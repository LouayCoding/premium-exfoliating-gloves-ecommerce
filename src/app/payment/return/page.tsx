'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';

interface PaymentStatus {
  status: 'loading' | 'success' | 'failed' | 'pending' | 'error';
  message?: string;
  orderId?: string;
  orderKey?: string;
  paymentId?: string;
}

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'loading' });
  const [retryCount, setRetryCount] = useState(0);

  const tempOrderId = searchParams.get('temp_order');
  // Mollie adds these parameters automatically to the return URL
  const paymentId = searchParams.get('id'); // Mollie uses 'id' parameter
  const mollieStatus = searchParams.get('status'); // Mollie payment status

  useEffect(() => {
    if (!tempOrderId) {
      setPaymentStatus({
        status: 'error',
        message: 'Geen order informatie gevonden'
      });
      return;
    }

    console.log('🔍 Return URL parameters:', {
      tempOrderId,
      paymentId,
      mollieStatus,
      allParams: Object.fromEntries(searchParams.entries())
    });


    // Check payment status
    checkPaymentStatus();
  }, [tempOrderId, paymentId, mollieStatus]);

  const checkPaymentStatus = async () => {
    try {
      console.log('🔍 Checking payment status for:', { tempOrderId, paymentId, mollieStatus });
      console.log('🔍 All URL parameters:', Object.fromEntries(searchParams.entries()));

      // Try to get payment ID from localStorage if not in URL
      let actualPaymentId = paymentId;
      if (!actualPaymentId) {
        const tempOrderData = localStorage.getItem('tempOrder');
        console.log('📱 Checking localStorage for tempOrder:', tempOrderData);
        if (tempOrderData) {
          try {
            const orderData = JSON.parse(tempOrderData);
            console.log('📱 Parsed tempOrder data:', orderData);
            if (orderData.tempOrderId === tempOrderId) {
              actualPaymentId = orderData.paymentId;
              console.log('📱 Found payment ID in localStorage:', actualPaymentId);
            } else {
              console.warn('⚠️ TempOrderId mismatch:', {
                expected: tempOrderId,
                found: orderData.tempOrderId
              });
            }
          } catch (e) {
            console.error('❌ Could not parse temp order data from localStorage:', e);
          }
        } else {
          console.warn('⚠️ No tempOrder data in localStorage');
        }
      }

      console.log('🎯 Using payment ID for status check:', actualPaymentId);

      // If still no payment ID, show helpful error
      if (!actualPaymentId) {
        console.error('❌ No payment ID available from URL or localStorage');
        console.log('🔍 Available data:', {
          tempOrderId,
          urlPaymentId: paymentId,
          mollieStatus,
          localStorageData: localStorage.getItem('tempOrder'),
          allLocalStorage: Object.keys(localStorage)
        });
        
        // Show error to user
        setPaymentStatus({
          status: 'error',
          message: 'Betaling kon niet worden gevonden. Mogelijk is de betaling niet succesvol aangemaakt.'
        });
        return;
      }

      // Handle Mollie status immediately if available
      if (mollieStatus === 'paid') {
        setPaymentStatus({
          status: 'success',
          message: 'Betaling succesvol! Order wordt verwerkt...'
        });
      } else if (mollieStatus === 'failed' || mollieStatus === 'cancelled' || mollieStatus === 'expired') {
        setPaymentStatus({
          status: 'failed',
          message: `Betaling ${mollieStatus === 'cancelled' ? 'geannuleerd' : 'mislukt'}`
        });
        return; // Don't continue checking if payment clearly failed
      }

      // If we have a payment ID, always trigger webhook manually for test mode reliability
      if (actualPaymentId) {
        console.log('🔧 Triggering webhook manually for payment:', actualPaymentId);
        try {
          const webhookResponse = await fetch('/api/webhooks/mollie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: actualPaymentId })
          });
          
          if (webhookResponse.ok) {
            const webhookData = await webhookResponse.json();
            console.log('✅ Manual webhook trigger successful:', webhookData);
          } else {
            console.warn('⚠️ Manual webhook trigger failed with status:', webhookResponse.status);
          }
        } catch (webhookError) {
          console.warn('⚠️ Manual webhook trigger failed:', webhookError);
        }
      } else {
        console.warn('⚠️ No payment ID available for webhook trigger');
      }

      // Wait longer for webhook processing (especially for test mode)
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Check if order was created (webhook processed)
      const statusUrl = `/api/payment/status?temp_order=${tempOrderId}${actualPaymentId ? `&payment_id=${actualPaymentId}` : ''}`;
      
      const response = await fetch(statusUrl);
      const data = await response.json();

      if (data.success) {
        if (data.wooOrderId) {
          // Order created successfully - redirect immediately
          console.log('✅ Order found, redirecting to success page');
          router.push(`/success?order_id=${data.wooOrderId}&order_key=${data.orderKey}&payment_id=${paymentId}`);

        } else if (data.paymentStatus === 'paid' || data.paymentStatus === 'pending' || data.orderProcessing) {
          // Payment successful but order still processing - don't wait, show success immediately
          console.log('💰 Payment successful, showing success immediately');
          
          // Get order details from localStorage (we have all the info we need)
          const tempOrderData = localStorage.getItem('tempOrder');
          let orderDetails = null;
          
          if (tempOrderData) {
            try {
              orderDetails = JSON.parse(tempOrderData);
            } catch (e) {
              console.warn('Could not parse temp order data');
            }
          }
          
          // Redirect to success page immediately with available data
          const successUrl = `/success?payment_id=${actualPaymentId}&temp_order=${tempOrderId}&status=paid`;
          console.log('🎉 Redirecting to success page immediately:', successUrl);
          router.push(successUrl);

        } else {
          // Payment failed
          setPaymentStatus({
            status: 'failed',
            message: data.message || 'Betaling mislukt'
          });
        }
      } else {
          // If no payment ID but we have temp order, try to check Mollie directly
          if (!actualPaymentId && tempOrderId) {
            console.log('🔄 No payment ID found, but temp order exists. Checking if payment was created...');
            setPaymentStatus({
              status: 'error',
              message: 'Betaling kon niet worden gevonden. Mogelijk is de betaling niet succesvol aangemaakt.'
            });
          } else {
            setPaymentStatus({
              status: 'error',
              message: data.message || 'Fout bij controleren betaling'
            });
          }
        }

    } catch (error) {
      console.error('❌ Error checking payment status:', error);
      setPaymentStatus({
        status: 'error',
        message: 'Fout bij controleren betaling'
      });
    }
  };

  const renderContent = () => {
    switch (paymentStatus.status) {
      case 'loading':
        return (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D4AF37] mx-auto mb-6"></div>
            <h1 className="text-2xl font-avantt font-bold text-[#121212] mb-2">
              Betaling Controleren...
            </h1>
            <p className="text-gray-600">
              Even geduld, we controleren je betaling bij Mollie.
            </p>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-avantt font-bold text-green-600 mb-2">
              Betaling Geslaagd! 🎉
            </h1>
            <p className="text-gray-600 mb-4">
              Je bestelling is succesvol betaald en wordt nu verwerkt.
            </p>
            {paymentStatus.orderId && (
              <p className="text-sm text-gray-500 mb-6">
                Order #{paymentStatus.orderId}
              </p>
            )}
            <div className="flex items-center justify-center space-x-2 text-[#D4AF37]">
              <span className="text-sm font-avantt">Je wordt doorgestuurd naar de bevestiging</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        );

      case 'pending':
        return (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-avantt font-bold text-yellow-600 mb-2">
              Betaling Wordt Verwerkt
            </h1>
            <p className="text-gray-600 mb-4">
              {paymentStatus.message || 'Je betaling wordt nog verwerkt door de bank.'}
            </p>
            <div className="animate-pulse text-sm text-gray-500">
              We controleren automatisch de status...
            </div>
          </motion.div>
        );

      case 'failed':
      case 'error':
        return (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-avantt font-bold text-red-600 mb-2">
              {paymentStatus.status === 'failed' ? 'Betaling Mislukt' : 'Er is iets misgegaan'}
            </h1>
            <p className="text-gray-600 mb-6">
              {paymentStatus.message || 'Er is een probleem opgetreden met je betaling.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-[#121212] text-white px-6 py-3 rounded-full font-avantt font-semibold hover:bg-black transition-colors"
              >
                Probeer Opnieuw
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-avantt font-semibold hover:bg-gray-50 transition-colors"
              >
                Terug naar Home
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderContent()}
        </div>
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-800 text-white text-xs rounded-lg">
            <div>Temp Order: {tempOrderId}</div>
            <div>Payment ID: {paymentId}</div>
            <div>Status: {paymentStatus.status}</div>
          </div>
        )}
      </div>
    </div>
  );
}
