import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from '@/data/products';

type WishlistContextType = {
  wishlist: Product[];
  addToWishlist: (product: Product) => boolean;
  removeFromWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('manglaSportsWishlist');
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist) as Product[];
        // Ensure all products have required fields
        const validProducts = parsed.filter((item): item is Product => {
          return (
            typeof item?.id === 'string' &&
            typeof item?.name === 'string' &&
            typeof item?.price === 'string' &&
            typeof item?.image === 'string' &&
            typeof item?.category === 'string' &&
            typeof item?.rating === 'number' &&
            typeof item?.inStock === 'boolean' &&
            typeof item?.brand === 'string'
          );
        });
        setWishlist(validProducts);
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('manglaSportsWishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isInitialized]);

  const addToWishlist = (product: Product): boolean => {
    let added = false;
    
    setWishlist((prevWishlist) => {
      // Check if product is already in wishlist
      if (prevWishlist.some(item => item.id === product.id)) {
        return prevWishlist;
      }
      
      added = true;
      return [...prevWishlist, product];
    });
    
    return added;
  };

  const removeFromWishlist = (productId: string): boolean => {
    let removed = false;
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some(item => item.id === productId);
      if (!exists) return prevWishlist;
      
      removed = true;
      return prevWishlist.filter(item => item.id !== productId);
    });
    return removed;
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast.success('Wishlist cleared', {
      duration: 2000 // 2 seconds
    });
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist,
        clearWishlist 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
