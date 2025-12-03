/**
 * Simple Order Mapping Storage
 * In-memory storage for temporary order data
 */

interface OrderMapping {
  tempOrderId: string;
  paymentId: string;
  wooOrderId?: number;
  customerEmail: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

interface TempOrderData {
  tempOrderId: string;
  customerData: any;
  orderData: any;
  paymentMethod: string;
  amount: number;
  createdAt: Date;
}

// In-memory storage (will be lost on server restart)
const orderMappings = new Map<string, OrderMapping>();
const tempOrders = new Map<string, TempOrderData>();

/**
 * Store temporary order data
 */
export async function storeTempOrderData(
  tempOrderId: string,
  customerData: any,
  orderData: any,
  paymentMethod: string,
  amount: number
): Promise<void> {
  const tempOrder: TempOrderData = {
    tempOrderId,
    customerData,
    orderData,
    paymentMethod,
    amount,
    createdAt: new Date()
  };

  // Store in both memory (fast) and Supabase (persistent)
  tempOrders.set(tempOrderId, tempOrder);
  
  try {
    // Also store in Supabase for persistence across server restarts
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/temp_orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          temp_order_id: tempOrderId,
          customer: customerData,
          items: orderData.items,
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          priority_fee: orderData.priorityFee || null,
          total: orderData.total,
          payment_method: paymentMethod,
          payment_method_title: orderData.paymentMethodTitle || paymentMethod,
          email_opt_in: orderData.emailOptIn || false,
          created_at: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        console.warn('⚠️ Failed to store temp order in Supabase, using memory only');
      } else {
        console.log('✅ Temp order stored in both memory and Supabase');
      }
    }
  } catch (error) {
    console.warn('⚠️ Supabase storage failed, using memory only:', error);
  }
  
  // Clean up old entries (older than 1 hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [id, order] of tempOrders.entries()) {
    if (order.createdAt < oneHourAgo) {
      tempOrders.delete(id);
    }
  }
}

/**
 * Get temporary order data
 */
export async function getTempOrderData(tempOrderId: string): Promise<TempOrderData | null> {
  // First try memory (fastest)
  const memoryData = tempOrders.get(tempOrderId);
  if (memoryData) {
    console.log('✅ Found temp order in memory');
    return memoryData;
  }
  
  // Fallback to Supabase if not in memory
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      console.log('🔍 Looking for temp order in Supabase:', tempOrderId);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/temp_orders?temp_order_id=eq.${tempOrderId}`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const supabaseOrder = data[0];
          const tempOrder: TempOrderData = {
            tempOrderId: supabaseOrder.temp_order_id,
            customerData: supabaseOrder.customer,
            orderData: {
              items: supabaseOrder.items,
              subtotal: supabaseOrder.subtotal,
              shipping: supabaseOrder.shipping,
              priorityFee: supabaseOrder.priority_fee,
              total: supabaseOrder.total,
              paymentMethodTitle: supabaseOrder.payment_method_title,
              emailOptIn: supabaseOrder.email_opt_in
            },
            paymentMethod: supabaseOrder.payment_method,
            amount: supabaseOrder.total,
            createdAt: new Date(supabaseOrder.created_at)
          };
          
          // Store back in memory for faster access
          tempOrders.set(tempOrderId, tempOrder);
          console.log('✅ Found temp order in Supabase and cached in memory');
          return tempOrder;
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to retrieve from Supabase:', error);
  }
  
  console.log('❌ Temp order not found in memory or Supabase');
  return null;
}

/**
 * Store order mapping
 */
export async function storeOrderMapping(
  tempOrderId: string,
  paymentId: string,
  customerEmail: string,
  amount: number
): Promise<void> {
  const mapping: OrderMapping = {
    tempOrderId,
    paymentId,
    customerEmail,
    amount,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  orderMappings.set(tempOrderId, mapping);
}

/**
 * Get order mapping by temp order ID
 */
export async function getOrderMapping(tempOrderId: string): Promise<OrderMapping | null> {
  return orderMappings.get(tempOrderId) || null;
}

/**
 * Get order mapping by payment ID
 */
export async function getOrderMappingByPaymentId(paymentId: string): Promise<OrderMapping | null> {
  for (const mapping of orderMappings.values()) {
    if (mapping.paymentId === paymentId) {
      return mapping;
    }
  }
  return null;
}

/**
 * Update order mapping with WooCommerce order ID
 */
export async function updateOrderMappingWithWooOrder(
  tempOrderId: string,
  wooOrderId: number
): Promise<void> {
  const mapping = orderMappings.get(tempOrderId);
  if (mapping) {
    mapping.wooOrderId = wooOrderId;
    mapping.updatedAt = new Date();
    orderMappings.set(tempOrderId, mapping);
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  tempOrderId: string,
  status: OrderMapping['status']
): Promise<void> {
  const mapping = orderMappings.get(tempOrderId);
  if (mapping) {
    mapping.status = status;
    mapping.updatedAt = new Date();
    orderMappings.set(tempOrderId, mapping);
  }
}

/**
 * Clean up old mappings
 */
export async function cleanupOldMappings(): Promise<void> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  for (const [id, mapping] of orderMappings.entries()) {
    if (mapping.createdAt < oneDayAgo) {
      orderMappings.delete(id);
    }
  }
}