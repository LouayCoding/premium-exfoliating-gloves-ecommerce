import { createMollieClient, PaymentStatus } from '@mollie/api-client';

// Determine which API key to use based on environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
const testApiKey = process.env.MOLLIE_API_KEY;
const liveApiKey = process.env.MOLLIE_LIVE_API_KEY;

// Choose the appropriate API key
const apiKey = isProduction ? liveApiKey : testApiKey;

const keyType = isProduction ? 'LIVE' : 'TEST';

// Only log in development mode
if (process.env.NODE_ENV === 'development' && apiKey) {
  console.log(`🔑 Mollie ${keyType} API Key configured:`, apiKey.substring(0, 10) + '...');
  console.log(`🌍 Environment: ${process.env.NODE_ENV}, Vercel: ${process.env.VERCEL_ENV}, Production: ${isProduction}`);
}

// Create client with dummy key if not set (will fail at runtime if used)
const mollieClient = createMollieClient({
  apiKey: apiKey || 'test_dummy',
});

export interface MolliePaymentData {
  amount: number;
  description: string;
  orderId: string;
  customerEmail: string;
  redirectUrl: string;
  webhookUrl?: string; // Make webhook optional
  method?: 'ideal' | 'creditcard' | 'bancontact' | 'klarna' | 'paypal';
}

export interface MolliePaymentResult {
  id: string;
  checkoutUrl: string;
  status: PaymentStatus;
  amount: string;
}

/**
 * Check if we're running in production mode
 */
export function isProductionMode(): boolean {
  return isProduction;
}

/**
 * Get current API key type for logging/debugging
 */
export function getApiKeyType(): string {
  return keyType;
}

/**
 * Create a new Mollie payment
 */
export async function createMolliePayment(data: MolliePaymentData): Promise<MolliePaymentResult> {
  // Runtime check for API key
  if (!apiKey || apiKey === 'test_dummy') {
    const missingKey = isProduction ? 'MOLLIE_LIVE_API_KEY' : 'MOLLIE_API_KEY';
    throw new Error(`${missingKey} environment variable is not set`);
  }

  try {
    console.log('🎯 Creating Mollie payment with full data:', {
      amount: data.amount,
      amountType: typeof data.amount,
      amountFormatted: data.amount.toFixed(2),
      method: data.method,
      orderId: data.orderId,
      customerEmail: data.customerEmail,
      description: data.description,
      redirectUrl: data.redirectUrl,
      webhookUrl: data.webhookUrl
    });

    const paymentData: any = {
      amount: {
        currency: 'EUR',
        value: data.amount.toFixed(2),
      },
      description: data.description,
      redirectUrl: data.redirectUrl,
      metadata: {
        orderId: data.orderId,
        customerEmail: data.customerEmail,
        // Don't store full orderData in metadata - use temp storage instead
      },
    };

    // In development mode, don't specify method to get test payment screen
    if (process.env.NODE_ENV === 'development') {
      console.log('🧪 Development mode: Creating test payment without specific method');
      // Don't add method - this will show Mollie's test payment selection screen
    } else {
      // In production, use the specified payment method
      paymentData.method = data.method as any;
      console.log('🏭 Production mode: Using specified payment method:', data.method);
    }

    // Only add webhook URL if provided and reachable
    if (data.webhookUrl) {
      paymentData.webhookUrl = data.webhookUrl;
      console.log('🔗 Webhook URL added to payment:', data.webhookUrl);
    } else {
      console.log('⚠️ No webhook URL provided - manual status checking required');
    }

    console.log('📤 Sending payment data to Mollie API:', JSON.stringify(paymentData, null, 2));

    const payment = await mollieClient.payments.create(paymentData);
    
    console.log('📥 Mollie API response received:', {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      method: payment.method,
      description: payment.description
    });

    console.log('✅ Mollie payment created:', {
      id: payment.id,
      status: payment.status,
      checkoutUrl: payment.getCheckoutUrl()
    });

    return {
      id: payment.id,
      checkoutUrl: payment.getCheckoutUrl()!,
      status: payment.status,
      amount: payment.amount.value,
    };

  } catch (error) {
    console.error('❌ Mollie payment creation failed:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a Mollie API error with more details
    if (error && typeof error === 'object' && 'status' in error) {
      console.error('Mollie API Error Status:', (error as any).status);
      console.error('Mollie API Error Details:', (error as any).detail || (error as any).details);
      console.error('Mollie API Error Field:', (error as any).field);
      console.error('Mollie API Error Links:', (error as any).links);
    }
    
    // Log the payment data that failed (reconstructed)
    console.error('Failed payment data (reconstructed):', JSON.stringify({
      amount: { currency: 'EUR', value: data.amount.toFixed(2) },
      description: data.description,
      redirectUrl: data.redirectUrl,
      method: data.method,
      metadata: { orderId: data.orderId, customerEmail: data.customerEmail },
      webhookUrl: data.webhookUrl
    }, null, 2));
    
    // Log original input data
    console.error('Original input data:', {
      amount: data.amount,
      description: data.description,
      orderId: data.orderId,
      customerEmail: data.customerEmail,
      redirectUrl: data.redirectUrl,
      webhookUrl: data.webhookUrl,
      method: data.method
    });
    
    throw new Error(`Mollie payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get payment status from Mollie
 */
export async function getMolliePayment(paymentId: string) {
  try {
    const payment = await mollieClient.payments.get(paymentId);
    
    return {
      id: payment.id,
      status: payment.status,
      amount: payment.amount.value,
      description: payment.description,
      metadata: payment.metadata,
      paidAt: payment.paidAt,
      failedAt: payment.failedAt,
      canceledAt: payment.canceledAt,
      expiresAt: payment.expiresAt,
    };
  } catch (error) {
    console.error('❌ Failed to get Mollie payment:', error);
    throw error;
  }
}

/**
 * Check if payment is successful
 */
export function isPaymentSuccessful(status: PaymentStatus): boolean {
  return status === PaymentStatus.paid;
}

/**
 * Check if payment failed
 */
export function isPaymentFailed(status: PaymentStatus): boolean {
  return [
    PaymentStatus.failed,
    PaymentStatus.canceled,
    PaymentStatus.expired
  ].includes(status);
}

/**
 * Check if payment is pending
 */
export function isPaymentPending(status: PaymentStatus): boolean {
  return [
    PaymentStatus.open,
    PaymentStatus.pending,
    PaymentStatus.authorized
  ].includes(status);
}
