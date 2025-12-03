/**
 * Error Logging Utility
 * Centralized error logging with console fallback
 */

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  orderId?: string;
  paymentId?: string;
  tempOrderId?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  [key: string]: any;
}

export interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  error?: string;
  stack?: string;
  context?: ErrorContext;
  category: string;
}

/**
 * Generate unique error ID
 */
function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log error with context
 */
export function logError(
  message: string,
  error?: Error | unknown,
  context?: ErrorContext,
  category: string = 'general'
): string {
  const errorId = generateErrorId();
  
  const errorLog: ErrorLog = {
    id: errorId,
    timestamp: new Date(),
    level: 'error',
    message,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    category
  };

  // Console logging for development
  console.error(`[${errorId}] ${message}`, {
    error: errorLog.error,
    context: errorLog.context,
    category: errorLog.category
  });

  if (errorLog.stack) {
    console.error('Stack trace:', errorLog.stack);
  }

  return errorId;
}

/**
 * Log payment-specific errors
 */
export function logPaymentError(
  message: string,
  error?: Error | unknown,
  paymentContext?: {
    paymentId?: string;
    orderId?: string;
    amount?: number;
    method?: string;
    customerEmail?: string;
  }
): string {
  return logError(message, error, paymentContext, 'payment');
}

/**
 * Log checkout-specific errors
 */
export function logCheckoutError(
  message: string,
  error?: Error | unknown,
  checkoutContext?: {
    tempOrderId?: string;
    customerEmail?: string;
    paymentMethod?: string;
    amount?: number;
  }
): string {
  return logError(message, error, checkoutContext, 'checkout');
}

/**
 * Log WooCommerce integration errors
 */
export function logWooCommerceError(
  message: string,
  error?: Error | unknown,
  wooContext?: {
    orderId?: string;
    productId?: string;
    endpoint?: string;
    method?: string;
  }
): string {
  return logError(message, error, wooContext, 'woocommerce');
}

/**
 * Log warning
 */
export function logWarning(
  message: string,
  context?: ErrorContext,
  category: string = 'general'
): string {
  const errorId = generateErrorId();
  
  console.warn(`[${errorId}] ${message}`, {
    context,
    category
  });

  return errorId;
}

/**
 * Log info
 */
export function logInfo(
  message: string,
  context?: ErrorContext,
  category: string = 'general'
): string {
  const errorId = generateErrorId();
  
  console.info(`[${errorId}] ${message}`, {
    context,
    category
  });

  return errorId;
}