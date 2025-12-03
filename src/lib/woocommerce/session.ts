/**
 * WooCommerce Session Handler
 * Manages cart sessions using WooCommerce Store API
 */

const STORE_API_ENDPOINT = process.env.NEXT_PUBLIC_STORE_API_ENDPOINT || '';
const SESSION_COOKIE_NAME = 'wc_session_token';

export interface WooSession {
  token: string;
  expires: number;
}

/**
 * Get session token from cookies
 */
export const getSessionToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(c => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`));
  
  if (!sessionCookie) return null;
  
  const token = sessionCookie.split('=')[1];
  return token || null;
};

/**
 * Set session token in cookies
 */
export const setSessionToken = (token: string, expiryDays: number = 7): void => {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  
  document.cookie = `${SESSION_COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

/**
 * Clear session token
 */
export const clearSessionToken = (): void => {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Initialize WooCommerce session
 */
export const initializeSession = async (): Promise<string | null> => {
  // Skip initialization if no endpoint is configured
  if (!STORE_API_ENDPOINT) {
    console.warn('WooCommerce Store API endpoint not configured. Running in local mode.');
    return null;
  }

  try {
    console.log('🔄 Attempting to connect to WooCommerce Store API:', `${STORE_API_ENDPOINT}/cart`);
    
    const response = await fetch(`${STORE_API_ENDPOINT}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    console.log('📊 WooCommerce Store API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ WooCommerce Store API error:', errorText);
      throw new Error(`Failed to initialize session: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 WooCommerce cart data:', data);

    // Extract session token from response headers
    const sessionHeader = response.headers.get('woocommerce-session');
    console.log('🔑 Session header:', sessionHeader);
    
    if (sessionHeader) {
      const token = sessionHeader.replace('Session ', '');
      setSessionToken(token);
      console.log('✅ Session token saved');
      return token;
    }

    // If no session header but response is OK, WooCommerce is available
    // Some WooCommerce setups don't use session headers for guest carts
    console.log('⚠️ No session header but WooCommerce is responding - assuming available');
    return 'no-session-but-available';
  } catch (error) {
    console.error('❌ Session initialization error:', error);
    return null;
  }
};

/**
 * Make authenticated request to WooCommerce Store API
 */
export const storeApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Throw error if no endpoint is configured
  if (!STORE_API_ENDPOINT) {
    throw new Error('WooCommerce Store API endpoint not configured. Please set NEXT_PUBLIC_STORE_API_ENDPOINT in your environment variables.');
  }

  const sessionToken = getSessionToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(sessionToken && { 'woocommerce-session': `Session ${sessionToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${STORE_API_ENDPOINT}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Store API request failed: ${response.status} ${response.statusText}`);
  }

  // Update session token if provided in response
  const newSessionHeader = response.headers.get('woocommerce-session');
  if (newSessionHeader) {
    const newToken = newSessionHeader.replace('Session ', '');
    setSessionToken(newToken);
  }

  return response.json();
};
