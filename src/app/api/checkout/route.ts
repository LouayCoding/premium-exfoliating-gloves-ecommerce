import { NextRequest, NextResponse } from 'next/server';
import { createWooCommerceOrder, testWooCommerceConnection } from '@/lib/woocommerce/orders';
import type { OrderData, CustomerData } from '@/lib/woocommerce/orders';
import { createMolliePayment, isProductionMode, getApiKeyType } from '@/lib/mollie/client';
import { storeTempOrderData } from '@/lib/storage/order-mapping';
import { parsePrice, calculateCartTotal } from '@/lib/utils/price';
import { logError, logPaymentError } from '@/lib/utils/error-logger';

// Payment method mapping for display purposes
const paymentMethodTitles: Record<string, string> = {
  'ideal': 'iDEAL',
  'creditcard': 'Credit Card',
  'bancontact': 'Bancontact',
  'klarna': 'Klarna Pay Later',
  'paypal': 'PayPal'
};

/**
 * Complete checkout processing with direct Mollie integration
 * Flow: Create Mollie payment → Redirect to Mollie → Webhook creates WooCommerce order
 * POST /api/checkout
 */
export async function POST(request: NextRequest) {
  let customer: any = null;
  let selectedPaymentMethod: string = '';
  
  try {
    const body = await request.json();
    const { items, paymentMethod, priorityProcessing, emailOptIn } = body;
    customer = body.customer;
    selectedPaymentMethod = paymentMethod;

    // Validate required data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    if (!customer || !customer.email || !customer.firstName || !customer.lastName) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Calculate totals with validation
    console.log('🧮 Calculating totals from items:', items);
    
    const subtotal = items.reduce((sum: number, item: any) => {
      // Handle different price formats and encoding issues
      const price = parsePrice(item.price);
      
      console.log('💰 Item price calculation:', {
        originalPrice: item.price,
        parsedPrice: price,
        quantity: item.quantity,
        itemTotal: price * item.quantity
      });
      
      if (isNaN(price)) {
        const errorId = logError(
          'Invalid price detected during checkout',
          new Error(`Invalid price for item ${item.name}: ${item.price}`),
          { item, originalPrice: item.price, parsedPrice: price }
        );
        throw new Error(`Invalid price for item ${item.name}: ${item.price} (Error ID: ${errorId})`);
      }
      
      return sum + (price * item.quantity);
    }, 0);

    const shipping = 0; // Always free shipping
    const priorityFee = priorityProcessing ? 1.95 : 0;
    const total = subtotal + shipping + priorityFee;
    
    console.log('💰 Total calculation breakdown:', {
      subtotal: subtotal,
      shipping: shipping,
      priorityFee: priorityFee,
      total: total,
      isValidTotal: !isNaN(total) && total > 0
    });
    
    if (isNaN(total) || total <= 0) {
      console.error('❌ Invalid total calculated:', total);
      throw new Error(`Invalid total amount: ${total}`);
    }

    // Prepare payment data
    selectedPaymentMethod = paymentMethod || 'ideal';
    const paymentMethodTitle = paymentMethodTitles[selectedPaymentMethod] || 'iDEAL';

    console.log('🎯 Processing checkout with direct Mollie integration:', {
      paymentMethod: selectedPaymentMethod,
      total: total,
      customerEmail: customer.email
    });

    // Prepare customer data for later WooCommerce order creation
    const customerData: CustomerData = {
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: customer.address,
      apartment: customer.apartment,
      postcode: customer.postcode,
      city: customer.city,
      country: customer.country || 'NL',
    };

    // Generate temporary order ID for tracking
    const tempOrderId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare order data for webhook processing
    const orderData = {
      tempOrderId,
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      customer: customerData,
      subtotal,
      shipping,
      priorityFee: priorityFee > 0 ? priorityFee : undefined,
      total,
      paymentMethod: selectedPaymentMethod,
      paymentMethodTitle,
      emailOptIn: emailOptIn || false,
    };

    // Create Mollie payment FIRST (before WooCommerce order)
    // Use environment variable for webhook URL or skip if not available
    const baseUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || request.nextUrl.origin;
    
    // Only use webhook URL if we have a public URL (not localhost)
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
    const webhookUrl = isLocalhost ? undefined : `${baseUrl}/api/webhooks/mollie`;
    
    // Use Cloudflare Tunnel URL for redirect as well
    const redirectBaseUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || request.nextUrl.origin;
    const redirectUrl = `${redirectBaseUrl}/payment/return?temp_order=${tempOrderId}`;
    
    if (webhookUrl) {
      console.log('🔗 Using webhook URL:', webhookUrl);
    } else {
      console.log('⚠️ Skipping webhook URL (localhost detected) - manual status checking required');
    }
    console.log('🔄 Using redirect URL:', redirectUrl);

    // Log all data being sent to Mollie
    const molliePaymentData: any = {
      amount: total,
      description: `HDS Gloves Bestelling - ${customer.firstName} ${customer.lastName}`,
      orderId: tempOrderId,
      customerEmail: customer.email,
      redirectUrl: redirectUrl,
      method: selectedPaymentMethod as any,
      // Don't include orderData in Mollie - use temp storage
    };
    
    // Only add webhook URL if not localhost
    if (webhookUrl) {
      molliePaymentData.webhookUrl = webhookUrl;
    }
    
    
    console.log('📋 Mollie payment data being sent:', molliePaymentData);

    try {
      // Store order data temporarily BEFORE creating Mollie payment
      const orderData = {
        items: items.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          key: item.key,
          image: item.image
        })),
        subtotal,
        shipping,
        priorityFee: priorityFee > 0 ? priorityFee : undefined,
        total,
        paymentMethodTitle,
        emailOptIn: emailOptIn || false
      };
      
      await storeTempOrderData(
        tempOrderId,
        customerData,
        orderData,
        selectedPaymentMethod,
        total
      );

      console.log(`🔑 Creating Mollie payment in ${getApiKeyType()} mode (Production: ${isProductionMode()})`);
      const molliePayment = await createMolliePayment(molliePaymentData);

      console.log('💾 Temporary order data stored for webhook processing:', tempOrderId);

      // Return success with Mollie payment URL
      return NextResponse.json({
        success: true,
        tempOrderId: tempOrderId,
        paymentId: molliePayment.id,
        paymentUrl: molliePayment.checkoutUrl,
        paymentMethod: selectedPaymentMethod,
        paymentMethodTitle: paymentMethodTitle,
        total: total.toFixed(2),
        mollie: true,
        directIntegration: true,
        message: 'Payment created successfully. Redirecting to Mollie...',
      });

    } catch (mollieError) {
      console.error('❌ Mollie payment creation failed:', mollieError);
      
      // Log detailed error information for debugging
      console.error('Payment data that failed:', {
        amount: total,
        description: `HDS Gloves Bestelling - ${customer.firstName} ${customer.lastName}`,
        orderId: tempOrderId,
        customerEmail: customer.email,
        redirectUrl: redirectUrl,
        webhookUrl: webhookUrl,
        method: selectedPaymentMethod
      });
      
      return NextResponse.json(
        { 
          success: false,
          error: 'payment_creation_failed',
          message: 'Er is een fout opgetreden bij het aanmaken van de betaling. Probeer het opnieuw.',
          details: mollieError instanceof Error ? mollieError.message : 'Mollie payment creation failed',
          debugInfo: {
            tempOrderId: tempOrderId,
            amount: total,
            method: selectedPaymentMethod,
            webhookUrl: webhookUrl,
            redirectUrl: redirectUrl
          }
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    const errorId = logError(
      'Checkout processing failed',
      error,
      { 
        customerEmail: customer?.email,
        paymentMethod: selectedPaymentMethod,
        category: 'checkout'
      }
    );
    
    console.error('💥 Checkout processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Checkout processing failed',
        details: error.message,
        success: false,
        errorId
      },
      { status: 500 }
    );
  }
}

/**
 * Create WooCommerce order after successful payment
 * This will be called from the webhook
 */
export async function createOrderAfterPayment(orderData: any, paymentId: string): Promise<any> {
  try {
    console.log('🏪 Creating WooCommerce order after successful payment:', paymentId);

    // Test WooCommerce connection
    const isWooCommerceAvailable = await testWooCommerceConnection();
    
    if (!isWooCommerceAvailable) {
      console.error('❌ WooCommerce is not available for order creation');
      throw new Error('WooCommerce backend is not available');
    }

    // Prepare WooCommerce order data
    const wooOrderData: OrderData = {
      items: orderData.items,
      customer: orderData.customer,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      priorityFee: orderData.priorityFee,
      total: orderData.total,
      paymentMethod: 'mollie_direct', // Custom payment method
      paymentMethodTitle: `${orderData.paymentMethodTitle} (Mollie)`,
      emailOptIn: orderData.emailOptIn,
    };

    // Create order in WooCommerce with payment ID
    const wooOrder = await createWooCommerceOrder(wooOrderData, paymentId);
    
    console.log('✅ WooCommerce order created after payment:', {
      wooOrderId: wooOrder.id,
      molliePaymentId: paymentId,
      total: wooOrder.total,
      status: wooOrder.status
    });

    return {
      wooOrderId: wooOrder.id,
      orderKey: wooOrder.order_key,
      status: wooOrder.status,
      total: wooOrder.total,
    };

  } catch (error) {
    console.error('❌ Failed to create WooCommerce order after payment:', error);
    throw error;
  }
}