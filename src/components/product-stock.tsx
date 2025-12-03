/**
 * Smart Product Stock Component met real-time updates
 */

'use client';

import { useProductStock } from '@/hooks/use-product';
import { Package, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface ProductStockProps {
  productId: number;
  fallbackStock?: number;
  className?: string;
  showIcon?: boolean;
  showCount?: boolean;
  realTime?: boolean;
  pollInterval?: number;
}

export function ProductStock({ 
  productId, 
  fallbackStock = 100,
  className = "",
  showIcon = true,
  showCount = true,
  realTime = false,
  pollInterval = 60000
}: ProductStockProps) {
  const { stock, status, isLoading, error } = useProductStock(productId);

  const displayStock = stock !== null ? stock : fallbackStock;
  const displayStatus = status || 'instock';
  const hasLiveData = stock !== null;

  // Determine stock level and styling
  const getStockInfo = () => {
    if (displayStatus === 'outofstock') {
      return {
        text: 'Uitverkocht',
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        icon: AlertTriangle,
        urgent: true
      };
    }

    if (displayStatus === 'onbackorder') {
      return {
        text: 'Op bestelling',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        icon: Clock,
        urgent: false
      };
    }

    // In stock - check quantity levels
    if (displayStock <= 5) {
      return {
        text: showCount ? `Nog ${displayStock} op voorraad!` : 'Beperkte voorraad',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200',
        icon: AlertTriangle,
        urgent: true
      };
    }

    if (displayStock <= 20) {
      return {
        text: showCount ? `${displayStock} op voorraad` : 'Op voorraad',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        icon: Package,
        urgent: false
      };
    }

    return {
      text: 'Op voorraad',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      icon: CheckCircle,
      urgent: false
    };
  };

  const stockInfo = getStockInfo();
  const Icon = stockInfo.icon;

  if (isLoading && !hasLiveData) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-gray-400 text-sm">Voorraad laden...</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${stockInfo.bgColor} ${className}`}>
      {showIcon && (
        <Icon className={`w-4 h-4 ${stockInfo.color}`} />
      )}
      
      <span className={`text-sm font-medium ${stockInfo.color}`}>
        {stockInfo.text}
      </span>

      {/* Live data indicator - removed for cleaner UI */}

      {/* Urgent indicator */}
      {stockInfo.urgent && (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      )}

    </div>
  );
}
