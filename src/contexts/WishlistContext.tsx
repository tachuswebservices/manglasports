import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from '@/data/products';

// TODO: Replace with real user authentication
const USER_ID = 1;

const API_BASE = 'https://manglasportsbackend.onrender.com/api/wishlist';

type WishlistContextType = {
  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
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

  // Load wishlist from backend on initial render
  useEffect(() => {
    fetch(`${API_BASE}?userId=${USER_ID}`)
      .then(res => res.json())
      .then(data => setWishlist(data))
      .catch(() => setWishlist([]));
  }, []);

  const addToWishlist = async (product: Product): Promise<boolean> => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, productId: product.id })
      });
      if (res.ok) {
        setWishlist(prev => [...prev, product]);
        toast.success('Added to wishlist');
        return true;
      } else {
        toast.error('Failed to add to wishlist');
        return false;
      }
    } catch {
      toast.error('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID })
      });
      if (res.ok) {
        setWishlist(prev => prev.filter(item => item.id !== productId));
        toast.success('Removed from wishlist');
        return true;
      } else {
        toast.error('Failed to remove from wishlist');
        return false;
      }
    } catch {
      toast.error('Failed to remove from wishlist');
      return false;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = async () => {
    try {
      const res = await fetch(API_BASE, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID })
      });
      if (res.ok) {
        setWishlist([]);
        toast.success('Wishlist cleared');
      } else {
        toast.error('Failed to clear wishlist');
      }
    } catch {
      toast.error('Failed to clear wishlist');
    }
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
