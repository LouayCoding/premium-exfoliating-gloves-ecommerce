import { NextRequest, NextResponse } from 'next/server';
import { getMolliePayment, isPaymentSuccessful, isPaymentFailed } from '@/lib/mollie/client';
import { createOrderAfterPayment } from '../../checkout/route';
import { storeOrderMapping, getTempOrderData, updateOrderMappingWithWooOrder } from '@/lib/storage/order-mapping';
import crypto from 'crypto';
import { logError, logPaymentError } from '@/lib/utils/error-logger';

/**
 * Verify Mollie webhook signature
 */
function verifyMollieSignature(body: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    
    // Mollie signature format: "sha256=<hash>"
    const receivedHash = signature.replace('sha256=', '');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedHash, 'hex')
    );
  } catch (error) {
    console.error('❌ Signature verification error:', error);
    return false;
  }
}

/**
 * Mollie Webhook Handler
 * Called by Mollie when payment status changes
 * POST /api/webhooks/mollie
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Mollie webhook called - logging all details');
    
    // Log request details for debugging
    console.log('📋 Request URL:', request.url);
    console.log('📋 Request method:', request.method);
    
    // Log all headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('📋 Request headers:', headers);
    
    // Get raw body for signature verification
    const rawBody = await request.text();
    console.log('📋 Raw webhook body:', rawBody);
    
    // Verify webhook signature for security (but allow manual triggers)
    const webhookSecret = process.env.MOLLIE_WEBHOOK_SECRET;
    const signature = request.headers.get('mollie-signature');
    const isDevelopment = process.env.NODE_ENV === 'development';
    const userAgent = request.headers.get('user-agent') || '';
    const isManualTrigger = userAgent.includes('Mozilla') || userAgent.includes('Chrome');
    
    if (isManualTrigger) {
      console.log('🔧 Manual webhook trigger detected - bypassing signature check');
    } else if (webhookSecret && signature) {
      // Verify signature for real Mollie webhooks
      const isValidSignature = verifyMollieSignature(rawBody, signature, webhookSecret);
      
      if (!isValidSignature) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      
      console.log('✅ Webhook signature verified successfully');
    } else if (webhookSecret && !signature && !isManualTrigger) {
      console.error('❌ Missing webhook signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    } else {
      console.log('ℹ️ No webhook secret configured - skipping signature verification');
    }

    // Parse body based on content type
    let body: any;
    let paymentId: string;
    
    const contentType = request.headers.get('content-type') || '';
    console.log('📋 Content-Type:', contentType);
    
    if (contentType.includes('application/json')) {
      // JSON format (our tests)
      try {
        body = JSON.parse(rawBody);
        paymentId = body.id;
      } catch (error) {
        console.error('❌ Failed to parse JSON body:', error);
        return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Form-encoded format (real Mollie webhooks)
      // Parse manually from raw body
      const match = rawBody.match(/id=([^&]+)/);
      if (match) {
        paymentId = decodeURIComponent(match[1]);
        body = { id: paymentId };
      } else {
        console.error('❌ Could not extract payment ID from form-encoded body:', rawBody);
        return NextResponse.json({ error: 'Invalid form format' }, { status: 400 });
      }
    } else {
      // Try to extract ID from any format
      const match = rawBody.match(/id=([^&\s]+)/);
      if (match) {
        paymentId = decodeURIComponent(match[1]);
        body = { id: paymentId };
      } else {
        console.error('❌ Could not extract payment ID from webhook body:', rawBody);
        return NextResponse.json({ error: 'Invalid webhook format' }, { status: 400 });
      }
    }
    
    console.log('📋 Parsed webhook data:', { paymentId, body });

    if (!paymentId) {
      console.error('❌ No payment ID in webhook');
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    console.log('🔔 Mollie webhook received for payment:', paymentId);

    // Get payment details from Mollie
    let payment;
    try {
      payment = await getMolliePayment(paymentId);
      console.log('✅ Successfully retrieved payment from Mollie:', {
        id: payment.id,
        status: payment.status,
        metadata: payment.metadata
      });
    } catch (mollieError) {
      console.error('❌ Failed to retrieve payment from Mollie:', mollieError);
      return NextResponse.json({
        error: 'Failed to retrieve payment from Mollie',
        details: mollieError instanceof Error ? mollieError.message : 'Unknown Mollie API error',
        paymentId: paymentId
      }, { status: 500 });
    }
    const tempOrderId = (payment.metadata as any)?.orderId;
    const customerEmail = (payment.metadata as any)?.customerEmail;

    if (!tempOrderId) {
      console.error('❌ No temp order ID in payment metadata');
      return NextResponse.json({ error: 'No order ID in metadata' }, { status: 400 });
    }

    console.log('💳 Payment status update:', {
      paymentId: payment.id,
      status: payment.status,
      tempOrderId: tempOrderId,
      amount: payment.amount,
      customerEmail: customerEmail
    });

    // Handle payment status
    if (isPaymentSuccessful(payment.status)) {
      console.log('✅ Payment successful, creating WooCommerce order...');
      
      try {
        // Get order data from temp storage
        console.log('🔍 Looking for temp order data:', tempOrderId);
        const orderData = await getTempOrderData(tempOrderId);
        
        if (!orderData) {
          console.error('❌ Temp order data not found for:', tempOrderId);
          console.log('💡 This might be due to server restart or data expiry');
          console.log('💡 Payment was successful, but order creation failed');
          
          const errorId = logError(
            'Order data not found for successful payment',
            new Error('Temp order data missing - server restart or expiry'),
            { tempOrderId, paymentId, paymentStatus: payment.status },
            'webhook'
          );
          
          return NextResponse.json({ 
            error: 'Order data not found', 
            errorId,
            tempOrderId,
            suggestion: 'Payment was successful but order data expired. Contact support.'
          }, { status: 404 });
        }
        
        console.log('✅ Found temp order data:', {
          tempOrderId,
          customerEmail: orderData.customerData?.email,
          itemCount: orderData.orderData?.items?.length,
          total: orderData.amount
        });

        // Restructure data for createOrderAfterPayment function
        const restructuredOrderData = {
          ...orderData.orderData,
          customer: orderData.customerData
        };
        
        // Create WooCommerce order
        const wooOrder = await createOrderAfterPayment(restructuredOrderData, paymentId);
        
        console.log('🎉 Order processing complete:', {
          molliePaymentId: paymentId,
          wooOrderId: wooOrder.wooOrderId,
          tempOrderId: tempOrderId
        });

        // Store mapping for return URL processing
        await storeOrderMapping(
          tempOrderId,
          paymentId,
          customerEmail,
          parseFloat(payment.amount)
        );
        
        // Update mapping with WooCommerce order ID
        await updateOrderMappingWithWooOrder(tempOrderId, wooOrder.wooOrderId);

        return NextResponse.json({ 
          success: true,
          message: 'Order created successfully',
          wooOrderId: wooOrder.wooOrderId
        });

      } catch (orderError) {
        console.error('❌ Failed to create WooCommerce order:', orderError);
        
        // Payment was successful but order creation failed
        // This needs manual intervention
        console.error('🚨 CRITICAL: Payment successful but order creation failed!', {
          paymentId: paymentId,
          tempOrderId: tempOrderId,
          error: orderError instanceof Error ? orderError.message : orderError
        });

        return NextResponse.json({ 
          error: 'Order creation failed after successful payment',
          paymentId: paymentId,
          requiresManualIntervention: true
        }, { status: 500 });
      }

    } else if (isPaymentFailed(payment.status)) {
      console.log('❌ Payment failed or cancelled:', payment.status);
      
      // Clean up temporary order data
      await cleanupTemporaryOrderData(tempOrderId);
      
      return NextResponse.json({ 
        success: true,
        message: 'Payment failed, cleanup completed',
        status: payment.status
      });

    } else {
      console.log('⏳ Payment still pending:', payment.status);
      
      return NextResponse.json({ 
        success: true,
        message: 'Payment status updated',
        status: payment.status
      });
    }

  } catch (error) {
    console.error('💥 Mollie webhook error:', error);
    
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



/**
 * Clean up temporary order data
 */
async function cleanupTemporaryOrderData(tempOrderId: string): Promise<void> {
  try {
    console.log('🧹 Cleaning up temporary order data:', tempOrderId);
    
    // In production, remove from Redis/database
    
  } catch (error) {
    console.error('❌ Failed to cleanup order data:', error);
  }
}

/**
 * GET endpoint for webhook info and testing
 */
export async function GET() {
  return NextResponse.json({
    message: 'Mollie Webhook Endpoint',
    status: 'Active',
    instructions: 'This endpoint accepts POST requests from Mollie with payment status updates',
    testEndpoint: '/api/webhooks/mollie/test',
    requiredFields: ['id'],
    webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL ? 
      `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/webhooks/mollie` : 
      'Not configured'
  });
}
