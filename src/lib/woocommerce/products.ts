/**
 * Direct WooCommerce Product Service
 * Laadt producten direct van WooCommerce zonder caching
 */

import { wooConfig, buildWooApiUrl } from '../../../woocommerce.config';

export interface Product {
  id: number;
  name: string;
  price: number;
  regularPrice?: number;
  salePrice?: number;
  stock: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  onSale: boolean;
  type?: string;
  parentId?: number;
}

// No fallback data - always use real WooCommerce data or show error

/**
 * Get product from WooCommerce
 */
export async function getProduct(productId: number): Promise<Product | null> {
  // Throw error if no WooCommerce credentials
  if (!wooConfig.consumerKey || !wooConfig.consumerSecret) {
    throw new Error('WooCommerce credentials niet geconfigureerd');
  }

  try {
    const url = buildWooApiUrl(`/products/${productId}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Product not found is acceptable
      }
      throw new Error(`WooCommerce API error: ${response.status}`);
    }

    const wooProduct = await response.json();
    
    return {
      id: wooProduct.id,
      name: wooProduct.name,
      price: parseFloat(wooProduct.price),
      regularPrice: wooProduct.regular_price ? parseFloat(wooProduct.regular_price) : undefined,
      salePrice: wooProduct.sale_price ? parseFloat(wooProduct.sale_price) : undefined,
      stock: wooProduct.stock_quantity || 0,
      stockStatus: wooProduct.stock_status,
      onSale: wooProduct.on_sale
    };
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    throw error; // Re-throw instead of using fallback
  }
}

/**
 * Get multiple products
 */
export async function getProducts(productIds: number[]): Promise<(Product | null)[]> {
  return Promise.all(productIds.map(id => getProduct(id)));
}

/**
 * Get product price only
 */
export async function getProductPrice(productId: number): Promise<number | null> {
  const product = await getProduct(productId);
  return product?.price || null;
}

/**
 * Get product stock only
 */
export async function getProductStock(productId: number): Promise<{ stock: number; status: string } | null> {
  const product = await getProduct(productId);
  if (!product) return null;
  
  return {
    stock: product.stock,
    status: product.stockStatus
  };
}

/**
 * Get product variations for a variable product
 */
async function getProductVariations(productId: number): Promise<Product[]> {
  try {
    const url = buildWooApiUrl(`/products/${productId}/variations`, { per_page: 100 });
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch variations for product ${productId}`);
      return [];
    }

    const variations = await response.json();
    
    return variations.map((variation: any) => {
      // Get the variation name from attributes
      const variationName = variation.attributes && variation.attributes.length > 0
        ? variation.attributes[0].option
        : `Variation ${variation.id}`;
      
      return {
        id: variation.id,
        name: variationName,
        price: parseFloat(variation.price),
        regularPrice: variation.regular_price ? parseFloat(variation.regular_price) : undefined,
        salePrice: variation.sale_price ? parseFloat(variation.sale_price) : undefined,
        stock: variation.stock_quantity || 0,
        stockStatus: variation.stock_status,
        onSale: variation.on_sale,
        type: 'variation',
        parentId: productId
      };
    });
  } catch (error) {
    console.error(`Error fetching variations for product ${productId}:`, error);
    return [];
  }
}

/**
 * Get all HDS products from WooCommerce
 */
export async function getAllHDSProducts(): Promise<Product[]> {
  console.log('🔍 getAllHDSProducts called');
  console.log('🔧 WooCommerce config:', {
    restApiEndpoint: wooConfig.restApiEndpoint,
    hasConsumerKey: !!wooConfig.consumerKey,
    hasConsumerSecret: !!wooConfig.consumerSecret,
  });

  // Throw error if no WooCommerce credentials
  if (!wooConfig.consumerKey || !wooConfig.consumerSecret) {
    throw new Error('WooCommerce credentials niet geconfigureerd. Check je .env.local bestand.');
  }

  // Throw error if no endpoints configured
  if (!wooConfig.restApiEndpoint) {
    throw new Error('WooCommerce REST API endpoint niet geconfigureerd. Check je .env.local bestand.');
  }

  try {
    const url = buildWooApiUrl('/products', { per_page: 100, status: 'publish' });
    console.log('📡 Fetching from URL:', url.substring(0, 100) + '...');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('📊 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ WooCommerce API Error:', errorText);
      
      if (response.status === 401) {
        throw new Error('WooCommerce authenticatie gefaald. Check je API credentials.');
      } else if (response.status === 404) {
        throw new Error('WooCommerce API endpoint niet gevonden. Check je NEXT_PUBLIC_REST_API_ENDPOINT.');
      } else if (response.status >= 500) {
        throw new Error('WooCommerce server error. Probeer later opnieuw.');
      } else {
        throw new Error(`WooCommerce API error: ${response.status} - ${errorText}`);
      }
    }

    const wooProducts = await response.json();
    console.log('📦 Raw WooCommerce products:', wooProducts);
    
    if (!Array.isArray(wooProducts)) {
      throw new Error('Onverwacht response format van WooCommerce API');
    }

    if (wooProducts.length === 0) {
      throw new Error('Geen producten gevonden in WooCommerce');
    }
    
    // Check for variable products and get their variations
    const allProducts: Product[] = [];
    
    for (const wooProduct of wooProducts) {
      if (wooProduct.type === 'variable') {
        // Get variations for this variable product
        console.log(`📋 Fetching variations for: ${wooProduct.name}`);
        const variations = await getProductVariations(wooProduct.id);
        allProducts.push(...variations);
      } else {
        // Regular simple product
        allProducts.push({
          id: wooProduct.id,
          name: wooProduct.name,
          price: parseFloat(wooProduct.price),
          regularPrice: wooProduct.regular_price ? parseFloat(wooProduct.regular_price) : undefined,
          salePrice: wooProduct.sale_price ? parseFloat(wooProduct.sale_price) : undefined,
          stock: wooProduct.stock_quantity || 0,
          stockStatus: wooProduct.stock_status,
          onSale: wooProduct.on_sale,
          type: wooProduct.type
        });
      }
    }

    console.log('✅ Transformed products (including variations):', allProducts);
    return allProducts;
  } catch (error) {
    console.error('❌ Failed to fetch all HDS products:', error);
    
    // Re-throw the error instead of falling back to static data
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Onbekende fout bij ophalen van producten van WooCommerce');
    }
  }
}
