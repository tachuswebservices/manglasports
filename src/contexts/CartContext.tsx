import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from '@/data/products';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

type CartItem = Product & {
  quantity: number;
  offerPrice?: number;
  gst?: number;
};

const API_BASE = 'http://localhost:4000/api/cart';

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  isInCart: (productId: string) => boolean;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetch(`${API_BASE}?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data.map((item: any) => ({ ...item.product, quantity: item.quantity }))))
        .catch(() => setCart([]));
    } else {
      // Clear cart when user is not authenticated
      setCart([]);
    }
  }, [isAuthenticated, user?.id]);

  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return false;
    }
    
    if (quantity < 1) return false;
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity })
      });
      if (res.ok) {
        setCart(prev => {
          const existing = prev.find(item => item.id === product.id);
          if (existing) {
            return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
          } else {
            return [...prev, { ...product, quantity }];
          }
        });
        toast.success(`${product.name} added to cart`);
        return true;
      } else {
        toast.error('Failed to add to cart');
        return false;
      }
    } catch {
      toast.error('Failed to add to cart');
      return false;
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please login to manage cart');
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
        setCart(prev => prev.filter(item => item.id !== productId));
        toast.success('Removed from cart');
        return true;
      } else {
        toast.error('Failed to remove from cart');
        return false;
      }
    } catch {
      toast.error('Failed to remove from cart');
      return false;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please login to manage cart');
      navigate('/login');
      return;
    }
    
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, quantity })
      });
      if (res.ok) {
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
      } else {
        toast.error('Failed to update cart item');
      }
    } catch {
      toast.error('Failed to update cart item');
    }
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.id === productId);
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user?.id) {
      setCart([]);
      return;
    }
    
    try {
      const res = await fetch(API_BASE, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        setCart([]);
        toast.success('Cart cleared');
      } else {
        toast.error('Failed to clear cart');
      }
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.offerPrice || item.numericPrice || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      isInCart,
      clearCart,
      getCartTotal,
      getCartItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
