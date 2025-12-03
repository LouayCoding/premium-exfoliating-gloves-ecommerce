/**
 * Fix 3+3 GRATIS price specifically
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

async function fix3Plus3Price() {
  console.log('🔧 Fixing 3+3 GRATIS price to €50.85\n');

  try {
    // Get product
    const productsUrl = buildAuthUrl(`${WOOCOMMERCE_ENDPOINT}/products`);
    const productsResponse = await fetch(productsUrl);
    const products = await productsResponse.json();
    const variableProduct = products.find(p => p.type === 'variable' && p.name.includes('Premium'));
    
    console.log('Product ID:', variableProduct.id);

    // Get variations
    const variationsUrl = buildAuthUrl(`${WOOCOMMERCE_ENDPOINT}/products/${variableProduct.id}/variations`);
    const variationsResponse = await fetch(variationsUrl);
    const variations = await variationsResponse.json();

    // Find 3+3 variation
    const variation3plus3 = variations.find(v => {
      const dealType = v.attributes.find(attr => attr.name === 'Deal Type')?.option;
      return dealType === '3+3 GRATIS';
    });

    if (!variation3plus3) {
      console.error('❌ 3+3 GRATIS variation not found!');
      return;
    }

    console.log('Found variation:', variation3plus3.id);
    console.log('Current price:', variation3plus3.price);
    console.log('Current regular_price:', variation3plus3.regular_price);

    // Update with explicit values
    const updateUrl = buildAuthUrl(`${WOOCOMMERCE_ENDPOINT}/products/${variableProduct.id}/variations/${variation3plus3.id}`);
    
    const updateData = {
      regular_price: '50.85',
      sale_price: '',
      price: '50.85'
    };

    console.log('\nSending update:', updateData);

    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      console.error('❌ Update failed:', error);
      return;
    }

    const updated = await updateResponse.json();
    console.log('\n✅ Updated successfully!');
    console.log('New price:', updated.price);
    console.log('New regular_price:', updated.regular_price);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fix3Plus3Price();
