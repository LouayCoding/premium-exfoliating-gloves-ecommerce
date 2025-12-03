/**
 * Simple product hook that loads directly from WooCommerce
 */

import { useState, useEffect } from 'react';
import { getProduct, getProductPrice, getProductStock, Product } from '@/lib/woocommerce/products';

interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

export function useProduct(productId: number): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      try {
        setIsLoading(true);
        setError(null);
        
        const productData = await getProduct(productId);
        
        if (isMounted) {
          setProduct(productData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load product');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { product, isLoading, error };
}

interface UseProductPriceResult {
  price: number | null;
  isLoading: boolean;
  error: string | null;
}

export function useProductPrice(productId: number): UseProductPriceResult {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPrice() {
      try {
        setIsLoading(true);
        setError(null);
        
        const priceData = await getProductPrice(productId);
        
        if (isMounted) {
          setPrice(priceData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load price');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPrice();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { price, isLoading, error };
}

interface UseProductStockResult {
  stock: number | null;
  status: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useProductStock(productId: number): UseProductStockResult {
  const [stock, setStock] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStock() {
      try {
        setIsLoading(true);
        setError(null);
        
        const stockData = await getProductStock(productId);
        
        if (isMounted) {
          setStock(stockData?.stock || null);
          setStatus(stockData?.status || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load stock');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStock();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { stock, status, isLoading, error };
}
