import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Get current cart contents
 * GET /api/cart/get
 * 
 * Returns cart data from server-side storage (session/cookies)
 */
export async function GET() {
  try {
    console.log('📦 Cart GET request - checking for stored cart data');
    
    // Try to get cart data from cookies/session
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get('hds-cart-session');
    
    let cartData = {
      items: [],
      totals: {
        total_price: '€0,00'
      }
    };
    
    if (cartCookie) {
      try {
        const parsedCart = JSON.parse(cartCookie.value);
        console.log('📦 Found cart data in session:', parsedCart);
        cartData = parsedCart;
      } catch (error) {
        console.warn('⚠️ Failed to parse cart cookie:', error);
      }
    }
    
    return NextResponse.json({
      success: true,
      cart: cartData,
      message: 'Cart API is available'
    });
  } catch (error) {
    console.error('❌ Get cart error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get cart' },
      { status: 500 }
    );
  }
}
