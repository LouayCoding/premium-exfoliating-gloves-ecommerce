/**
 * Complete order test - Create payment and track it
 */

require('dotenv').config({ path: '.env.local' });
const { createMollieClient } = require('@mollie/api-client');

const apiKey = process.env.MOLLIE_API_KEY;
const mollieClient = createMollieClient({ apiKey });

async function completeOrderTest() {
  console.log('🧪 COMPLETE ORDER TEST\n');
  console.log('=' .repeat(60));
  
  // Step 1: Create checkout order via API
  console.log('\n📦 STEP 1: Creating checkout order...\n');
  
  const orderData = {
    items: [
      {
        id: 123,
        name: 'Premium Exfoliating Gloves - 2+2 GRATIS',
        price: '€19,99',
        quantity: 1,
        image: 'https://shop.hdsgloves.nl/image.jpg'
      }
    ],
    customer: {
      email: 'test@hdsgloves.nl',
      firstName: 'Test',
      lastName: 'Klant',
      address: 'Teststraat 123',
      apartment: '',
      postcode: '1234AB',
      city: 'Amsterdam',
      country: 'NL'
    },
    paymentMethod: 'ideal',
    emailOptIn: false
  };

  try {
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    
    if (!result.success) {
      console.error('❌ Checkout failed:', result);
      return;
    }

    console.log('✅ Checkout successful!');
    console.log('   Temp Order ID:', result.tempOrderId);
    console.log('   Payment ID:', result.paymentId);
    console.log('   Total:', result.total);
    console.log('   Payment URL:', result.paymentUrl);

    // Step 2: Get payment details from Mollie
    console.log('\n💳 STEP 2: Fetching payment details from Mollie...\n');
    
    const payment = await mollieClient.payments.get(result.paymentId);
    
    console.log('✅ Payment details retrieved:');
    console.log('   ID:', payment.id);
    console.log('   Status:', payment.status);
    console.log('   Amount:', payment.amount.value, payment.amount.currency);
    console.log('   Description:', payment.description);
    console.log('   Created:', payment.createdAt);
    console.log('   Method:', payment.method || 'Not selected yet');
    
    // Step 3: List recent payments
    console.log('\n📋 STEP 3: Listing recent payments...\n');
    
    const payments = await mollieClient.payments.page({ limit: 5 });
    
    console.log('✅ Recent payments:');
    payments.forEach((p, index) => {
      console.log(`   ${index + 1}. ${p.id} - ${p.status} - €${p.amount.value} - ${p.description}`);
    });

    // Step 4: Show test instructions
    console.log('\n🎯 STEP 4: Test the payment\n');
    console.log('=' .repeat(60));
    console.log('\n📱 Open this URL in your browser to complete the payment:');
    console.log('\n   ' + result.paymentUrl);
    console.log('\n💡 On the Mollie test page:');
    console.log('   - Select a payment method (e.g., iDEAL)');
    console.log('   - Choose "Paid" to simulate successful payment');
    console.log('   - Or choose "Failed" to test error handling');
    
    console.log('\n🔍 After payment, check status with:');
    console.log(`   node check-payment-status.js ${result.paymentId}`);
    
    console.log('\n✅ TEST COMPLETE!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
  }
}

completeOrderTest();
