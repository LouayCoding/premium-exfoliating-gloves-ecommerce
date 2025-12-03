import { NextRequest, NextResponse } from 'next/server';
import { getMolliePayment, isPaymentSuccessful, isPaymentFailed, isPaymentPending } from '@/lib/mollie/client';
import { getOrderMapping } from '@/lib/storage/order-mapping';

/**
 * Check payment status and order creation status
 * GET /api/payment/status?temp_order=xxx&payment_id=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tempOrderId = searchParams.get('temp_order');
    const paymentId = searchParams.get('payment_id');

    if (!tempOrderId) {
      return NextResponse.json(
        { error: 'Temp order ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking payment status:', { tempOrderId, paymentId });

    // If we have payment ID, check Mollie status
    if (paymentId) {
      try {
        const payment = await getMolliePayment(paymentId);
        
        console.log('💳 Mollie payment status:', {
          id: payment.id,
          status: payment.status,
          amount: payment.amount
        });

        if (isPaymentSuccessful(payment.status)) {
          // Payment successful - check if WooCommerce order was created
          const orderMapping = await getOrderMapping(tempOrderId);
          
          if (orderMapping) {
            return NextResponse.json({
              success: true,
              paymentStatus: 'paid',
              wooOrderId: orderMapping.wooOrderId,
              message: 'Payment successful and order created'
            });
          } else {
            // Payment successful but order not yet created (webhook might still be processing)
            return NextResponse.json({
              success: true,
              paymentStatus: 'paid',
              orderProcessing: true,
              message: 'Payment successful, order being created...'
            });
          }

        } else if (isPaymentFailed(payment.status)) {
          return NextResponse.json({
            success: false,
            paymentStatus: payment.status,
            message: 'Payment failed or was cancelled'
          });

        } else if (isPaymentPending(payment.status)) {
          return NextResponse.json({
            success: true,
            paymentStatus: payment.status,
            message: 'Payment is still being processed'
          });
        }

      } catch (mollieError) {
        console.error('❌ Error checking Mollie payment:', mollieError);
        
        return NextResponse.json({
          success: false,
          error: 'Could not check payment status',
          details: mollieError instanceof Error ? mollieError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // No payment ID - check order mapping only
    const orderMapping = await getOrderMapping(tempOrderId);
    
    if (orderMapping) {
      return NextResponse.json({
        success: true,
        paymentStatus: 'paid',
        wooOrderId: orderMapping.wooOrderId,
        message: 'Order found'
      });
    }
    
    return NextResponse.json({
      success: false,
      paymentStatus: 'unknown',
      message: 'No order information found - payment may have failed to create'
    });

  } catch (error) {
    console.error('💥 Payment status check error:', error);
    
    return NextResponse.json(
      { 
        error: 'Status check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

