import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from '@/data/products';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:4000/api/wishlist';

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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load wishlist from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetch(`${API_BASE}?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setWishlist(data))
        .catch(() => setWishlist([]));
    } else {
      // Clear wishlist when user is not authenticated
      setWishlist([]);
    }
  }, [isAuthenticated, user?.id]);

  const addToWishlist = async (product: Product): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return false;
    }
    
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id })
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
    if (!isAuthenticated || !user?.id) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
      return false;
    }
    
    try {
      const res = await fetch(`${API_BASE}/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
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
    if (!isAuthenticated || !user?.id) {
      setWishlist([]);
      return;
    }
    
    try {
      const res = await fetch(API_BASE, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
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
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
