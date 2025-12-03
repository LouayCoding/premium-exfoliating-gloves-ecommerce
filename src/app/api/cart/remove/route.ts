import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Remove item from cart
 * DELETE /api/cart/remove
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

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

    // Remove item with matching key
    existingCart.items = existingCart.items.filter((item: any) => item.key !== key);
    
    // Recalculate total
    if (existingCart.items.length > 0) {
      const totalQuantity = existingCart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      
      // Handle price as either string or number
      const firstItemPrice = existingCart.items[0].price;
      const priceNumber = typeof firstItemPrice === 'string' 
        ? parseFloat(firstItemPrice.replace('€', '').replace(',', '.'))
        : parseFloat(firstItemPrice.toString());
        
      const newTotal = `€${(priceNumber * totalQuantity).toFixed(2).replace('.', ',')}`;
      existingCart.totals.total_price = newTotal;
    } else {
      existingCart.totals.total_price = '€0,00';
    }

    // Save updated cart to cookie
    const response = NextResponse.json({
      success: true,
      cart: existingCart,
    });
    
    if (existingCart.items.length > 0) {
      response.cookies.set('hds-cart-session', JSON.stringify(existingCart), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
    } else {
      // Clear cookie if cart is empty
      response.cookies.delete('hds-cart-session');
    }
    
    return response;
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove item' },
      { status: 500 }
    );
  }
}
