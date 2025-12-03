/**
 * Simple in-memory product cache
 * Prevents repeated API calls to WooCommerce
 */

import { Product } from '@/lib/woocommerce/products';

interface ProductCache {
  products: Product[];
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

let cache: ProductCache | null = null;
const CACHE_TTL = 30 * 1000; // 30 seconds

/**
 * Get products from cache or return null if expired/empty
 */
export function getCachedProducts(): Product[] | null {
  if (!cache) {
    console.log('📦 No product cache found');
    return null;
  }

  const now = Date.now();
  const isExpired = (now - cache.timestamp) > cache.ttl;

  if (isExpired) {
    console.log('📦 Product cache expired, clearing...');
    cache = null;
    return null;
  }

  console.log('📦 Using cached products:', cache.products.length);
  return cache.products;
}

/**
 * Store products in cache
 */
export function setCachedProducts(products: Product[]): void {
  cache = {
    products,
    timestamp: Date.now(),
    ttl: CACHE_TTL
  };
  console.log('📦 Products cached:', products.length);
}

/**
 * Clear the product cache
 */
export function clearProductCache(): void {
  cache = null;
  console.log('📦 Product cache cleared');
}

/**
 * Get cache info for debugging
 */
export function getCacheInfo() {
  if (!cache) {
    return { cached: false, count: 0, age: 0 };
  }

  return {
    cached: true,
    count: cache.products.length,
    age: Date.now() - cache.timestamp,
    ttl: cache.ttl
  };
}
