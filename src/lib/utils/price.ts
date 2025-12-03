/**
 * Price utility functions for consistent price handling
 * Handles various formats: €59,95, €24.95, 59.95, etc.
 */

/**
 * Parse price string to number
 * Handles: €59,95, €24.95, 59.95, "€59,95", etc.
 */
export function parsePrice(priceStr: string | number): number {
  if (typeof priceStr === 'number') {
    return priceStr;
  }
  
  if (!priceStr || typeof priceStr !== 'string') {
    console.warn('Invalid price input:', priceStr);
    return 0;
  }
  
  // Remove all non-numeric characters except comma, dot, and minus
  // This handles encoding issues like ??? characters
  let cleanPrice = priceStr
    .replace(/[€$£¥₹₽¢]/g, '') // Remove common currency symbols
    .replace(/[^\d,.-]/g, '') // Remove everything except digits, comma, dot, minus
    .trim();
  
  if (!cleanPrice) {
    console.warn('Empty price after cleaning:', priceStr);
    return 0;
  }
  
  // Handle European format (59,95) vs US format (59.95)
  // If there's both comma and dot, assume comma is thousands separator
  if (cleanPrice.includes(',') && cleanPrice.includes('.')) {
    // Format like 1,234.56 - remove comma (thousands separator)
    cleanPrice = cleanPrice.replace(/,/g, '');
  } else if (cleanPrice.includes(',')) {
    // European format: 59,95 -> 59.95
    const parts = cleanPrice.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      // Likely decimal comma (59,95)
      cleanPrice = cleanPrice.replace(',', '.');
    } else {
      // Likely thousands separator (1,234)
      cleanPrice = cleanPrice.replace(/,/g, '');
    }
  }
  
  const parsed = parseFloat(cleanPrice);
  
  if (isNaN(parsed)) {
    console.warn('Failed to parse price:', priceStr, '-> cleaned:', cleanPrice);
    return 0;
  }
  
  return parsed;
}

/**
 * Format number as price string
 */
export function formatPrice(price: number, currency: string = '€', locale: string = 'nl-NL'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === '€' ? 'EUR' : 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  } catch (error) {
    // Fallback formatting
    const formatted = price.toFixed(2).replace('.', ',');
    return `${currency}${formatted}`;
  }
}

/**
 * Calculate total from cart items
 */
export function calculateCartTotal(items: Array<{ price: string | number; quantity: number }>): number {
  return items.reduce((sum, item) => {
    const price = parsePrice(item.price);
    return sum + (price * item.quantity);
  }, 0);
}

/**
 * Validate price format
 */
export function isValidPrice(priceStr: string): boolean {
  const parsed = parsePrice(priceStr);
  return !isNaN(parsed) && parsed >= 0;
}

/**
 * Debug price parsing (for development)
 */
export function debugPrice(priceStr: string): void {
  console.log('🔍 Price Debug:', {
    input: priceStr,
    parsed: parsePrice(priceStr),
    formatted: formatPrice(parsePrice(priceStr))
  });
}
