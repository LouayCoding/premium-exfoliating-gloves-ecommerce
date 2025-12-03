/**
 * Smart Product Price Component met real-time caching
 */

'use client';

import { useProductPrice } from '@/hooks/use-product';
import { Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface ProductPriceProps {
  productId: number;
  fallbackPrice: number;
  className?: string;
  showSource?: boolean;
  realTime?: boolean;
  pollInterval?: number;
}

export function ProductPrice({ 
  productId, 
  fallbackPrice, 
  className = "",
  showSource = false,
  realTime = false,
  pollInterval = 30000
}: ProductPriceProps) {
  const { price, isLoading, error } = useProductPrice(productId);

  // Use real-time updates if enabled
  // Note: We could extend this to use useRealTimePrice hook
  
  const displayPrice = price !== null ? price : fallbackPrice;
  const hasLiveData = price !== null;

  if (isLoading && !hasLiveData) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-gray-400">€{fallbackPrice.toFixed(2)}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Main Price */}
      <div className="flex items-center space-x-2">
        <span className="font-bold text-xl">
          €{displayPrice.toFixed(2)}
        </span>
      </div>

      {/* Status Indicators - Only show if showSource is enabled */}
      {showSource && (
        <div className="flex items-center space-x-1">
          <div className="group relative">
            {hasLiveData ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-gray-400" />
            )}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {hasLiveData ? 'Live prijs' : 'Cached prijs'}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
