import { NextResponse } from 'next/server';
import { getAllHDSProducts } from '@/lib/woocommerce/products';
import { getCachedProducts, setCachedProducts, getCacheInfo } from '@/lib/product-cache';

/**
 * Server-side WooCommerce Products API
 * This bypasses CORS issues by making the request from the server
 */
export async function GET() {
  try {
    console.log('🔍 API: Fetching products via server-side...');
    
    // Try cache first
    let products = getCachedProducts();
    let fromCache = true;
    
    if (!products) {
      console.log('📦 Cache miss - fetching from WooCommerce...');
      products = await getAllHDSProducts();
      setCachedProducts(products);
      fromCache = false;
    }
    
    const cacheInfo = getCacheInfo();
    console.log('✅ API: Products fetched successfully:', products.length, fromCache ? '(from cache)' : '(fresh)');
    
    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      fromCache,
      cacheInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ API: Error fetching products:', error);
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Force refresh products (bypass any caching)
 */
export async function POST() {
  try {
    console.log('🔄 API: Force refresh products...');
    
    const products = await getAllHDSProducts();
    
    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      refreshed: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ API: Error refreshing products:', error);
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
