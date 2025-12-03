import { NextResponse } from 'next/server';
import { getAllHDSProducts } from '@/lib/woocommerce/products';

/**
 * Get all HDS products
 * GET /api/products
 */
export async function GET() {
  try {
    const products = await getAllHDSProducts();
    
    return NextResponse.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
