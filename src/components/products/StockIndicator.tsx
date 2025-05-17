import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StockLevel = 'high' | 'medium' | 'low' | 'out-of-stock';

interface StockIndicatorProps {
  level: StockLevel;
  compact?: boolean;
  quantity?: number;
  className?: string;
}

const StockIndicator: React.FC<StockIndicatorProps> = ({
  level,
  compact = false,
  quantity,
  className
}) => {
  // Determine text and icon based on stock level
  const getStockInfo = () => {
    switch (level) {
      case 'high':
        return {
          icon: <CheckCircle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />,
          text: compact ? 'In Stock' : 'In Stock - Ready to Ship',
          color: 'text-green-500'
        };
      case 'medium':
        return {
          icon: <CheckCircle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />,
          text: compact ? 'In Stock' : `In Stock (${quantity || 'Limited Quantity'})`,
          color: 'text-green-500'
        };
      case 'low':
        return {
          icon: <AlertCircle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />,
          text: compact ? 'Low Stock' : `Low Stock - Order Soon${quantity ? ` (${quantity} left)` : ''}`,
          color: 'text-amber-500'
        };
      case 'out-of-stock':
      default:
        return {
          icon: <XCircle className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />,
          text: 'Out of Stock',
          color: 'text-red-500'
        };
    }
  };

  const { icon, text, color } = getStockInfo();

  return (
    <div className={cn('flex items-center', color, className)}>
      {icon}
      <span className={`${compact ? 'text-xs' : 'text-sm'}`}>{text}</span>
    </div>
  );
};

export default StockIndicator;
