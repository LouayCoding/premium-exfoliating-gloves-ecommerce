import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface UpdateCartItemRequest {
  key: string;
  quantity: number;
}

/**
 * Update cart item quantity
 * POST /api/cart/update
 */
export async function POST(request: NextRequest) {
  try {
    const body: UpdateCartItemRequest = await request.json();
    const { key, quantity } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Cart item key is required' },
        { status: 400 }
      );
    }

    // Get existing cart from cookies
    const cookieStore = await cookies();
    const existingCartCookie = cookieStore.get('hds-cart-session');
    let existingCart: { items: any[], totals: { total_price: string } } = { items: [], totals: { total_price: '€0,00' } };
    
    if (existingCartCookie) {
      try {
        existingCart = JSON.parse(existingCartCookie.value);
      } catch (error) {
        console.warn('⚠️ Failed to parse existing cart cookie');
      }
    }

    // Find and update item with matching key
    const itemIndex = existingCart.items.findIndex((item: any) => item.key === key);
    
    if (itemIndex >= 0) {
      existingCart.items[itemIndex].quantity = quantity;
      
      // Recalculate total
      const totalQuantity = existingCart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      
      // Handle price as either string or number
      const firstItemPrice = existingCart.items[0].price;
      const priceNumber = typeof firstItemPrice === 'string' 
        ? parseFloat(firstItemPrice.replace('€', '').replace(',', '.'))
        : parseFloat(firstItemPrice.toString());
        
      const newTotal = `€${(priceNumber * totalQuantity).toFixed(2).replace('.', ',')}`;
      existingCart.totals.total_price = newTotal;
    }

    // Save updated cart to cookie
    const response = NextResponse.json({
      success: true,
      cart: existingCart,
    });
    
    response.cookies.set('hds-cart-session', JSON.stringify(existingCart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update cart' },
      { status: 500 }
    );
  }
}
