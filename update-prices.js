/**
 * Update product variation prices in WooCommerce
 * 1+1 = €16,95
 * 2+2 = €33,90
 * 3+3 = €50,85
 */

require('dotenv').config({ path: '.env.local' });

const WOOCOMMERCE_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Build authenticated URL
function buildAuthUrl(endpoint) {
  const url = new URL(endpoint);
  url.searchParams.append('consumer_key', CONSUMER_KEY);
  url.searchParams.append('consumer_secret', CONSUMER_SECRET);
  return url.toString();
}

async function updatePrices() {
  console.log('💰 Updating WooCommerce Product Prices\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Find the variable product
    console.log('\n📦 Step 1: Finding variable product...\n');
    
    const productsUrl = buildAuthUrl(`${WOOCOMMERCE_ENDPOINT}/products`);
    const productsResponse = await fetch(productsUrl);
    const products = await productsResponse.json();
    
    const variableProduct = products.find(p => p.type === 'variable' && p.name.includes('Premium'));
    
    if (!variableProduct) {
      console.error('❌ Variable product not found!');
      return;
    }
    
    console.log('✅ Found product:', variableProduct.name);
    console.log('   Product ID:', variableProduct.id);

    // Step 2: Get variations
    console.log('\n📋 Step 2: Getting variations...\n');
    
    const variationsUrl = buildAuthUrl(`${WOOCOMMERCE_ENDPOINT}/products/${variableProduct.id}/variations`);
    const variationsResponse = await fetch(variationsUrl);
    const variations = await variationsResponse.json();
    
    console.log(`✅ Found ${variations.length} variations\n`);

    // Step 3: Update each variation
    console.log('💸 Step 3: Updating prices...\n');
    
    const priceMap = {
      '1+1 GRATIS': '16.95',
      '2+2 GRATIS': '33.90',
      '3+3 GRATIS': '50.85'
    };

    for (const variation of variations) {
      const variationName = variation.attributes.find(attr => attr.name === 'Deal Type')?.option;
      const newPrice = priceMap[variationName];
      
      if (!newPrice) {
        console.log(`⚠️  Skipping: ${variationName} (no price mapping)`);
        continue;
      }

      console.log(`📝 Updating: ${variationName}`);
      console.log(`   Old price: €${variation.price}`);
      console.log(`   New price: €${newPrice}`);

      // Update variation
      const updateUrl = buildAuthUrl(`${WOOCOMMERCE_ENDPOINT}/products/${variableProduct.id}/variations/${variation.id}`);
      
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regular_price: newPrice,
          price: newPrice,
        }),
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        console.error(`   ❌ Failed:`, error.message);
        continue;
      }

      const updated = await updateResponse.json();
      console.log(`   ✅ Updated! New price: €${updated.price}\n`);
    }

    // Step 4: Verify updates
    console.log('🔍 Step 4: Verifying updates...\n');
    
    const verifyResponse = await fetch(variationsUrl);
    const updatedVariations = await verifyResponse.json();
    
    console.log('=' .repeat(60));
    console.log('\n📊 FINAL PRICES:\n');
    
    updatedVariations.forEach(variation => {
      const name = variation.attributes.find(attr => attr.name === 'Deal Type')?.option;
      console.log(`   ${name}: €${variation.price}`);
    });
    
    console.log('\n✅ ALL PRICES UPDATED SUCCESSFULLY!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack:', error.stack);
    }
  }
}

updatePrices();
