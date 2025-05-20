import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Product } from '@/data/products';

interface WishlistButtonProps {
  product: Omit<Product, 'inWishlist'> & { inWishlist?: boolean };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  className = '',
  size = 'md',
  showTooltip = true,
  onToggle,
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Sync with wishlist state
  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [isInWishlist, product.id]);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-10 w-10', // Reduce lg size for a more compact look
  };

  const iconSize = {
    sm: 18,
    md: 22,
    lg: 22, // Reduce icon size for large button
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isWishlisted) {
        const removed = removeFromWishlist(product.id);
        if (removed) {
          toast.success('Removed from wishlist');
          setIsWishlisted(false);
          onToggle?.(false);
        }
      } else {
        const added = addToWishlist(product);
        if (added) {
          toast.success('Added to wishlist');
          setIsWishlisted(true);
          onToggle?.(true);
        } else {
          toast.info('Product is already in your wishlist');
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const button = (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center rounded-full border border-transparent',
        'bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-md',
        'transition-colors duration-200',
        isWishlisted 
          ? 'text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 border-rose-300 dark:border-rose-400' 
          : 'text-gray-700 hover:text-rose-500 dark:text-gray-200 dark:hover:text-rose-400 border-gray-300 dark:border-gray-700',
        'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-mangla-gold',
        sizeClasses[size],
        className,
        'opacity-100',
        'min-w-0 min-h-0' // Prevents oversized button
      )}
      whileTap={{ scale: 0.9 }}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <motion.span
        key={isWishlisted ? 'filled' : 'outline'}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isWishlisted ? (
          <Heart className={size} size={iconSize[size]} fill="currentColor" />
        ) : (
          <Heart className={size} size={iconSize[size]} />
        )}
      </motion.span>
    </motion.button>
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          <p>{isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
