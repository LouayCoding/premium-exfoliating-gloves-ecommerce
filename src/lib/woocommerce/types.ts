/**
 * TypeScript types for WooCommerce integration
 */

export interface WooCommerceProduct {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  onSale: boolean;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
  stockQuantity?: number;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
}

export interface BundleProduct extends WooCommerceProduct {
  bundledItems: BundledItem[];
}

export interface BundledItem {
  bundledItemId: string;
  productId: number;
  quantity: number;
  discount?: number;
  product: WooCommerceProduct;
}

export interface CartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  price: string;
  totals: {
    line_subtotal: string;
    line_total: string;
  };
  images: Array<{
    src: string;
    alt: string;
  }>;
}

export interface Cart {
  items: CartItem[];
  totals: {
    total_items: string;
    total_items_tax: string;
    total_fees: string;
    total_fees_tax: string;
    total_discount: string;
    total_discount_tax: string;
    total_shipping: string;
    total_shipping_tax: string;
    total_tax: string;
    total_price: string;
  };
  needs_shipping: boolean;
  needs_payment: boolean;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  variation?: Record<string, string>;
}

export interface UpdateCartItemRequest {
  key: string;
  quantity: number;
}
