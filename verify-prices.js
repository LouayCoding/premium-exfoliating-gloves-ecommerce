/**
 * Verify all product prices
 */

require('dotenv').config({ path: '.env.local' });

const WOOCOMMERCE_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

function buildAuthUrl(endpoint) {
  const url = new URL(endpoint);
  url.searchParams.append('consumer_key', CONSUMER_KEY);
  url.searchParams.append('consumer_secret', CONSUMER_SECRET);
  return url.toString();
}

async function verifyPrices() {
  console.log('🔍 Verifying Product Prices\n');
  console.log('=' .repeat(60));

  try {
    // Get product
    const productsUrl = buildAuthUrl(`${WOOCOMMERCE_ENDPOINT}/products`);
    const productsResponse = await fetch(productsUrl);
    const products = await productsResponse.json();
    const variableProduct = products.find(p => p.type === 'variable' && p.name.includes('Premium'));

    // Get variations
    const variationsUrl = buildAuthUrl(`${WOOCOMMERCE_ENDPOINT}/products/${variableProduct.id}/variations`);
    const variationsResponse = await fetch(variationsUrl);
    const variations = await variationsResponse.json();

    console.log('\n📊 CURRENT PRICES:\n');
    
    const expectedPrices = {
      '1+1 GRATIS': '16.95',
      '2+2 GRATIS': '33.90',
      '3+3 GRATIS': '50.85'
    };

    variations.forEach(variation => {
      const name = variation.attributes.find(attr => attr.name === 'Deal Type')?.option;
      const currentPrice = variation.price;
      const expectedPrice = expectedPrices[name];
      const isCorrect = currentPrice === expectedPrice;
      
      console.log(`${isCorrect ? '✅' : '❌'} ${name}:`);
      console.log(`   Current:  €${currentPrice}`);
      console.log(`   Expected: €${expectedPrice}`);
      console.log('');
    });

    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyPrices();
