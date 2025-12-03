'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeSession, storeApiRequest } from '@/lib/woocommerce/session';
import type { Cart as WooCart, CartItem as WooCartItem } from '@/lib/woocommerce/types';
import { calculateCartTotal, formatPrice } from '@/lib/utils/price';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  quantity: number;
  image: string;
  key?: string; // WooCommerce cart item key
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  total: string;
  isWooCommerceMode: boolean; // Track if WooCommerce is available
}

interface CartContextType {
  state: CartState;
  addToCart: (productId: number, quantity?: number) => Promise<boolean>;
  removeFromCart: (key: string) => Promise<boolean>;
  updateQuantity: (key: string, quantity: number) => Promise<boolean>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

// No mock data - only use real WooCommerce data

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    isOpen: false,
    loading: false,
    total: '€0,00',
    isWooCommerceMode: false,
  });

  // Load cart from localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('hds-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('💾 Loading cart from localStorage:', parsedCart);
        setState(prev => ({
          ...prev,
          items: parsedCart.items || [],
          total: parsedCart.total || '€0,00'
        }));
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Failed to load cart from localStorage:', error);
    }
    return false;
  };

  // Save cart to localStorage
  const saveCartToStorage = (items: any[], total: string) => {
    try {
      const cartData = { items, total, timestamp: Date.now() };
      localStorage.setItem('hds-cart', JSON.stringify(cartData));
      console.log('💾 Cart saved to localStorage:', cartData);
    } catch (error) {
      console.warn('⚠️ Failed to save cart to localStorage:', error);
    }
  };

  // Initialize cart functionality via our API (avoids CORS issues)
  useEffect(() => {
    const init = async () => {
      console.log('🔄 Initializing cart via API...');
      
      // First, try to load from localStorage
      const hasLocalCart = loadCartFromStorage();
      
      try {
        // Test if our cart API is working
        const response = await fetch('/api/cart/get');
        const isApiWorking = response.ok;
        
        console.log('📊 Cart API test result:', {
          isApiWorking,
          status: response.status,
          hasLocalCart
        });
        
        setState(prev => ({ 
          ...prev, 
          isWooCommerceMode: isApiWorking,
          loading: false
        }));
        
        if (isApiWorking) {
          console.log('✅ Cart API is working - ready for cart operations');
          // If no local cart, try to load from API
          if (!hasLocalCart) {
            const data = await response.json();
            if (data.success && data.cart && data.cart.items && data.cart.items.length > 0) {
              const items = data.cart.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.totals?.line_total || `€${item.price}`,
                quantity: item.quantity,
                image: item.images?.[0]?.src || '/images/hds-exfoliating-gloves-product-showcase.png',
                key: item.key,
              }));
              
              const total = data.cart.totals?.total_price || '€0,00';
              
              setState(prev => ({
                ...prev,
                items,
                total
              }));
              
              // Save to localStorage for future refreshes
              saveCartToStorage(items, total);
            }
          }
        } else {
          console.warn('⚠️ Cart API not working - using localStorage only');
        }
      } catch (error) {
        console.error('❌ Cart API initialization failed:', error);
        setState(prev => ({ 
          ...prev, 
          isWooCommerceMode: false,
          loading: false
        }));
      }
    };
    init();
  }, []);

  // WooCommerce-only mode - no local cart functionality

  // Refresh cart (WooCommerce only)
  const refreshCart = async () => {
    if (!state.isWooCommerceMode) {
      console.error('WooCommerce is not available - cannot refresh cart');
      return;
    }

    try {
      const cart = await storeApiRequest<WooCart>('/cart');
      
      // Convert WooCommerce cart items to our format
      const items: CartItem[] = cart.items.map((item: WooCartItem) => ({
        id: item.id,
        name: item.name,
        price: item.totals.line_total,
        quantity: item.quantity,
        image: item.images[0]?.src || '/images/hds-exfoliating-gloves-product-showcase.png',
        key: item.key,
      }));

      setState(prev => ({
        ...prev,
        items,
        total: cart.totals.total_price || '€0,00',
      }));
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    }
  };

  // Add item to cart (WooCommerce only)
  const addToCart = async (productId: number, quantity: number = 1): Promise<boolean> => {
    console.log('🛒 addToCart called', {
      productId,
      quantity,
      isWooCommerceMode: state.isWooCommerceMode,
      storeApiEndpoint: process.env.NEXT_PUBLIC_STORE_API_ENDPOINT
    });
    
    if (!state.isWooCommerceMode) {
      console.error('❌ Cart API is not available', {
        isWooCommerceMode: state.isWooCommerceMode
      });
      return false;
    }

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      console.log('📡 Making cart API call via our backend...', {
        productId,
        quantity
      });
      
      // Use our own API endpoint to avoid CORS issues
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Cart API response:', result);
      
      if (result.success) {
        // Convert WooCommerce cart to our format
        if (result.cart && result.cart.items) {
          const items = result.cart.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.totals?.line_total || `€${item.price}`,
            quantity: item.quantity,
            image: item.images?.[0]?.src || '/images/hds-exfoliating-gloves-product-showcase.png',
            key: item.key,
          }));
          
          const total = result.cart.totals?.total_price || '€0,00';
          
          setState(prev => ({
            ...prev,
            items,
            total,
            isOpen: true,
            loading: false
          }));
          
          // Save to localStorage for persistence
          saveCartToStorage(items, total);
        }
        
        return true;
      } else {
        throw new Error(result.error || 'Cart operation failed');
      }
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  // Remove item from cart via API
  const removeFromCart = async (key: string): Promise<boolean> => {
    if (!state.isWooCommerceMode) {
      console.error('Cart API is not available - cannot remove from cart');
      return false;
    }

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch(`/api/cart/remove?key=${key}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.cart) {
        const items = result.cart.items?.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.totals?.line_total || `€${item.price}`,
          quantity: item.quantity,
          image: item.images?.[0]?.src || '/images/hds-exfoliating-gloves-product-showcase.png',
          key: item.key,
        })) || [];
        
        const total = result.cart.totals?.total_price || '€0,00';
        
        setState(prev => ({
          ...prev,
          items,
          total,
          loading: false
        }));
        
        // Save to localStorage for persistence
        if (items.length > 0) {
          saveCartToStorage(items, total);
        } else {
          localStorage.removeItem('hds-cart');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  // Update item quantity via API
  const updateQuantity = async (key: string, quantity: number): Promise<boolean> => {
    if (quantity === 0) {
      return removeFromCart(key);
    }

    if (!state.isWooCommerceMode) {
      console.error('Cart API is not available - cannot update quantity');
      return false;
    }

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, quantity }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.cart) {
        const items = result.cart.items?.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.totals?.line_total || `€${item.price}`,
          quantity: item.quantity,
          image: item.images?.[0]?.src || '/images/hds-exfoliating-gloves-product-showcase.png',
          key: item.key,
        })) || [];
        
        const total = result.cart.totals?.total_price || '€0,00';
        
        setState(prev => ({
          ...prev,
          items,
          total,
          loading: false
        }));
        
        // Save to localStorage for persistence
        saveCartToStorage(items, total);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  const clearCart = () => {
    if (!state.isWooCommerceMode) {
      console.error('WooCommerce is not available - cannot clear cart');
      return;
    }
    
    // Clear cart via WooCommerce API (could be enhanced with actual API call)
    setState(prev => ({ ...prev, items: [], total: '€0,00' }));
    localStorage.removeItem('hds-cart');
  };

  const openCart = () => {
    setState(prev => ({ ...prev, isOpen: true }));
  };

  const closeCart = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const toggleCart = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
