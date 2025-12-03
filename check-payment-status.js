/**
 * Check payment status via Mollie API
 * Usage: node check-payment-status.js tr_xxxxx
 */

require('dotenv').config({ path: '.env.local' });
const { createMollieClient } = require('@mollie/api-client');

const apiKey = process.env.MOLLIE_API_KEY;
const mollieClient = createMollieClient({ apiKey });

const paymentId = process.argv[2];

if (!paymentId) {
  console.error('❌ Please provide a payment ID');
  console.log('Usage: node check-payment-status.js tr_xxxxx');
  process.exit(1);
}

async function checkPaymentStatus() {
  console.log('🔍 Checking payment status...\n');
  
  try {
    const payment = await mollieClient.payments.get(paymentId);
    
    console.log('✅ Payment found!\n');
    console.log('=' .repeat(60));
    console.log('Payment ID:', payment.id);
    console.log('Status:', payment.status);
    console.log('Amount:', payment.amount.value, payment.amount.currency);
    console.log('Description:', payment.description);
    console.log('Method:', payment.method || 'Not selected');
    console.log('Created:', payment.createdAt);
    
    if (payment.paidAt) {
      console.log('Paid at:', payment.paidAt);
    }
    if (payment.canceledAt) {
      console.log('Canceled at:', payment.canceledAt);
    }
    if (payment.failedAt) {
      console.log('Failed at:', payment.failedAt);
    }
    if (payment.expiresAt) {
      console.log('Expires at:', payment.expiresAt);
    }
    
    console.log('\nMetadata:', payment.metadata);
    console.log('=' .repeat(60));
    
    // Status explanation
    console.log('\n📊 Status explanation:');
    switch (payment.status) {
      case 'open':
        console.log('   ⏳ Payment is waiting for customer to complete');
        break;
      case 'paid':
        console.log('   ✅ Payment was successful!');
        break;
      case 'failed':
        console.log('   ❌ Payment failed');
        break;
      case 'canceled':
        console.log('   🚫 Payment was canceled');
        break;
      case 'expired':
        console.log('   ⌛ Payment expired');
        break;
      case 'pending':
        console.log('   ⏰ Payment is pending');
        break;
      default:
        console.log('   ❓ Unknown status:', payment.status);
    }
    
    if (payment.status === 'open') {
      console.log('\n🔗 Checkout URL:', payment.getCheckoutUrl());
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.statusCode === 404) {
      console.error('   Payment not found. Check the payment ID.');
    }
  }
}

checkPaymentStatus();
