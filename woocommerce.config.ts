/**
 * WooCommerce Configuration
 * Configuratie voor WooCommerce REST API integratie
 */

export interface WooCommerceConfig {
  restApiEndpoint: string;
  consumerKey: string;
  consumerSecret: string;
  currency: string;
}

// Load configuration from environment variables
export const wooConfig: WooCommerceConfig = {
  restApiEndpoint: process.env.NEXT_PUBLIC_REST_API_ENDPOINT || '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'EUR',
};

/**
 * Generate WooCommerce authentication headers
 * Uses Basic Auth for WooCommerce REST API
 */
export function getWooCommerceAuth(): Record<string, string> {
  if (!wooConfig.consumerKey || !wooConfig.consumerSecret) {
    throw new Error('WooCommerce credentials niet geconfigureerd');
  }

  // Create Basic Auth token
  const credentials = Buffer.from(
    `${wooConfig.consumerKey}:${wooConfig.consumerSecret}`
  ).toString('base64');

  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Build WooCommerce API URL with query parameters
 * Some servers don't support Basic Auth headers, so we use query params
 */
export function buildWooApiUrl(endpoint: string, params: Record<string, any> = {}): string {
  const baseUrl = wooConfig.restApiEndpoint;
  
  // Build URL - endpoint already includes /wp-json/wc/v3
  const url = new URL(`${baseUrl}${endpoint}`);
  
  // Add consumer key and secret as query parameters
  url.searchParams.append('consumer_key', wooConfig.consumerKey);
  url.searchParams.append('consumer_secret', wooConfig.consumerSecret);
  
  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  
  return url.toString();
}

/**
 * Validate WooCommerce configuration
 */
export function validateWooConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!wooConfig.restApiEndpoint) {
    errors.push('NEXT_PUBLIC_REST_API_ENDPOINT is niet ingesteld');
  }

  if (!wooConfig.consumerKey) {
    errors.push('WOOCOMMERCE_CONSUMER_KEY is niet ingesteld');
  }

  if (!wooConfig.consumerSecret) {
    errors.push('WOOCOMMERCE_CONSUMER_SECRET is niet ingesteld');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
