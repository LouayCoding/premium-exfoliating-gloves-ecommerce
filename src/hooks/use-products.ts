import { useState, useEffect } from 'react';
import { getAllHDSProducts, Product } from '@/lib/woocommerce/products';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch all HDS products from WooCommerce
 */
export function useProducts() {
  const [state, setState] = useState<Omit<ProductsState, 'refresh'>>({
    products: [],
    isLoading: true,
    error: null,
  });

  const fetchProducts = async () => {
    try {
      console.log('🔄 Fetching products via API...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Use our server-side API to avoid CORS issues
      const response = await fetch('/api/woocommerce/products');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Products received via API:', data.products);
      
      if (!data.success || !Array.isArray(data.products)) {
        throw new Error('Invalid response format from products API');
      }
      
      // Sort products by ID to ensure consistent order
      const sortedProducts = data.products.sort((a: any, b: any) => a.id - b.id);
      
      setState({
        products: sortedProducts,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load products',
      }));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    ...state,
    refresh: fetchProducts
  };
}
