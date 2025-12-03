import { useState, useEffect, useCallback } from 'react';
import { initializeSession } from '@/lib/woocommerce/session';
import type { Cart } from '@/lib/woocommerce/types';

/**
 * Hook for managing WooCommerce cart
 * Syncs with WooCommerce backend session
 */
export function useWooCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session and load cart
  useEffect(() => {
    const init = async () => {
      try {
        await initializeSession();
        await fetchCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize cart');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Fetch current cart
  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch('/api/cart/get');
      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
        setError(null);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
        setError(null);
        return true;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update cart item quantity
  const updateCartItem = useCallback(async (key: string, quantity: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, quantity }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
        setError(null);
        return true;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback(async (key: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cart/remove?key=${key}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
        setError(null);
        return true;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    refreshCart: fetchCart,
  };
}
