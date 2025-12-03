/**
 * WooCommerce Orders Service
 * Handles order creation and management via WooCommerce REST API
 */

import { wooConfig, getWooCommerceAuth } from '../../../woocommerce.config';
import { parsePrice } from '@/lib/utils/price';

export interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

export interface CustomerData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  postcode: string;
  city: string;
  country: string;
}

export interface OrderData {
  items: OrderItem[];
  customer: CustomerData;
  subtotal: number;
  shipping: number;
  priorityFee?: number;
  total: number;
  paymentMethod: string;
  paymentMethodTitle?: string;
  emailOptIn?: boolean;
}

export interface WooCommerceOrder {
  id: number;
  order_key: string;
  status: string;
  total: string;
  date_created: string;
  payment_url?: string;
}

/**
 * Create order in WooCommerce
 */
export async function createWooCommerceOrder(orderData: OrderData, paymentId?: string): Promise<WooCommerceOrder> {
  try {
    // Prepare WooCommerce order payload
    const wooOrderData = {
      payment_method: orderData.paymentMethod, // Use Mollie gateway directly
      payment_method_title: orderData.paymentMethodTitle || getPaymentMethodTitle(orderData.paymentMethod),
      set_paid: true,
      status: 'processing',
      currency: wooConfig.currency,
      
      // Customer billing information
      billing: {
        first_name: orderData.customer.firstName,
        last_name: orderData.customer.lastName,
        address_1: orderData.customer.address,
        address_2: orderData.customer.apartment || '',
        city: orderData.customer.city,
        postcode: orderData.customer.postcode,
        country: orderData.customer.country,
        email: orderData.customer.email,
      },
      
      // Customer shipping information (same as billing)
      shipping: {
        first_name: orderData.customer.firstName,
        last_name: orderData.customer.lastName,
        address_1: orderData.customer.address,
        address_2: orderData.customer.apartment || '',
        city: orderData.customer.city,
        postcode: orderData.customer.postcode,
        country: orderData.customer.country,
      },
      
      // Order line items
      line_items: orderData.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        name: item.name,
        total: (parsePrice(item.price) * item.quantity).toFixed(2),
      })),
      
      // Shipping lines
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Gratis verzending',
          total: orderData.shipping.toFixed(2),
        }
      ],
      
      // Fee lines (for priority processing)
      ...(orderData.priorityFee && orderData.priorityFee > 0 && {
        fee_lines: [
          {
            name: 'Priority Verwerking',
            total: orderData.priorityFee.toFixed(2),
            tax_status: 'taxable',
          }
        ]
      }),
      
      // Order notes
      customer_note: buildOrderNotes(orderData),
      
      // Meta data
      meta_data: [
        {
          key: '_hds_email_opt_in',
          value: orderData.emailOptIn ? 'yes' : 'no',
        },
        {
          key: '_hds_priority_processing',
          value: orderData.priorityFee && orderData.priorityFee > 0 ? 'yes' : 'no',
        },
        {
          key: '_hds_order_source',
          value: 'nextjs_frontend',
        },
        {
          key: '_hds_order_timestamp',
          value: new Date().toISOString(),
        },
        ...(paymentId ? [{
          key: '_transaction_id',
          value: paymentId,
        }, {
          key: '_mollie_payment_id',
          value: paymentId,
        }] : [])
      ],
    };

    // Make request to WooCommerce REST API
    const response = await fetch(`${wooConfig.restApiEndpoint}/orders`, {
      method: 'POST',
      headers: getWooCommerceAuth(),
      body: JSON.stringify(wooOrderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`WooCommerce API Error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const order: WooCommerceOrder = await response.json();
    
    console.log('✅ Order created in WooCommerce:', {
      id: order.id,
      status: order.status,
      total: order.total,
      key: order.order_key,
    });

    return order;

  } catch (error) {
    console.error('❌ Failed to create WooCommerce order:', error);
    throw error;
  }
}

/**
 * Get order from WooCommerce by ID
 */
export async function getWooCommerceOrder(orderId: number): Promise<WooCommerceOrder> {
  try {
    const response = await fetch(`${wooConfig.restApiEndpoint}/orders/${orderId}`, {
      method: 'GET',
      headers: getWooCommerceAuth(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get order: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get WooCommerce order:', error);
    throw error;
  }
}

/**
 * Update order status in WooCommerce
 */
export async function updateOrderStatus(orderId: number, status: string): Promise<WooCommerceOrder> {
  try {
    const response = await fetch(`${wooConfig.restApiEndpoint}/orders/${orderId}`, {
      method: 'PUT',
      headers: getWooCommerceAuth(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
}

/**
 * Helper function to get payment method title
 */
function getPaymentMethodTitle(method: string): string {
  const titles: Record<string, string> = {
    ideal: 'iDEAL',
    klarna: 'Klarna',
    creditcard: 'Credit Card',
    bancontact: 'Bancontact',
    paypal: 'PayPal',
    bacs: 'Bank Transfer',
  };
  
  return titles[method] || 'Online Payment';
}

/**
 * Build order notes from order data
 */
function buildOrderNotes(orderData: OrderData): string {
  const notes: string[] = [];
  
  if (orderData.priorityFee && orderData.priorityFee > 0) {
    notes.push('🚀 Priority Verwerking - Deze bestelling heeft prioriteit!');
  }
  
  if (orderData.emailOptIn) {
    notes.push('📧 Klant wil updates en spa-tips ontvangen via e-mail');
  }
  
  notes.push(`💳 Betaalmethode: ${getPaymentMethodTitle(orderData.paymentMethod)}`);
  notes.push(`🛒 Bestelling geplaatst via HDS Gloves website`);
  
  return notes.join('\n');
}

/**
 * Test WooCommerce connection
 */
export async function testWooCommerceConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${wooConfig.restApiEndpoint}/system_status`, {
      method: 'GET',
      headers: getWooCommerceAuth(),
    });
    
    return response.ok;
  } catch (error) {
    console.error('WooCommerce connection test failed:', error);
    return false;
  }
}
