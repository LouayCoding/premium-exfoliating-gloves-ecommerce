/**
 * Quick test om Mollie API key te verifiëren
 */

require('dotenv').config({ path: '.env.local' });
const { createMollieClient } = require('@mollie/api-client');

const apiKey = process.env.MOLLIE_API_KEY;

console.log('🔑 Testing Mollie API Key...');
console.log('API Key:', apiKey ? apiKey.substring(0, 15) + '...' : 'NOT SET');

if (!apiKey) {
  console.error('❌ MOLLIE_API_KEY not found in .env.local');
  process.exit(1);
}

const mollieClient = createMollieClient({ apiKey });

async function testMollieConnection() {
  try {
    console.log('\n📡 Testing Mollie API connection...');
    
    // Test 1: Get payment methods
    console.log('\n1️⃣ Fetching available payment methods...');
    const methods = await mollieClient.methods.list();
    console.log('✅ Available payment methods:', methods.map(m => m.id).join(', '));
    
    // Test 2: Create a test payment
    console.log('\n2️⃣ Creating test payment...');
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: '10.00',
      },
      description: 'Test payment from HDS Gloves',
      redirectUrl: 'http://localhost:3000/test',
      // No webhookUrl for localhost
    });
    
    console.log('✅ Test payment created successfully!');
    console.log('   Payment ID:', payment.id);
    console.log('   Status:', payment.status);
    console.log('   Checkout URL:', payment.getCheckoutUrl());
    
    console.log('\n✅ All tests passed! Mollie API is working correctly.');
    console.log('\n🎯 You can test the payment at:', payment.getCheckoutUrl());
    
  } catch (error) {
    console.error('\n❌ Mollie API test failed:', error.message);
    if (error.field) {
      console.error('   Field:', error.field);
    }
    if (error.statusCode) {
      console.error('   Status Code:', error.statusCode);
    }
    process.exit(1);
  }
}

testMollieConnection();
