/**
 * Test checkout API direct
 */

const testCheckout = async () => {
  const orderData = {
    items: [
      {
        id: 123,
        name: 'Premium Exfoliating Gloves - 2+2 GRATIS',
        price: '€19,99',
        quantity: 1,
        image: 'https://example.com/image.jpg'
      }
    ],
    customer: {
      email: 'test@test.nl',
      firstName: 'Test',
      lastName: 'Gebruiker',
      address: 'Teststraat 1',
      apartment: '',
      postcode: '1234AB',
      city: 'Amsterdam',
      country: 'NL'
    },
    paymentMethod: 'ideal',
    emailOptIn: false
  };

  console.log('🧪 Testing checkout API...\n');
  console.log('📤 Sending order data:', JSON.stringify(orderData, null, 2));

  try {
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('\n📡 Response status:', response.status);
    const result = await response.json();
    console.log('📡 Response data:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ Checkout successful!');
      console.log('   Payment ID:', result.paymentId);
      console.log('   Payment URL:', result.paymentUrl);
      console.log('   Temp Order ID:', result.tempOrderId);
    } else {
      console.log('\n❌ Checkout failed!');
      console.log('   Error:', result.error);
      console.log('   Message:', result.message);
      console.log('   Details:', result.details);
    }

  } catch (error) {
    console.error('\n💥 Request failed:', error.message);
  }
};

testCheckout();
