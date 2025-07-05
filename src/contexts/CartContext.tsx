import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from '@/data/products';

type CartItem = Product & {
  quantity: number;
};

// TODO: Replace with real user authentication
const USER_ID = 1;
const API_BASE = 'https://manglasportsbackend.onrender.com/api/cart';

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

  // Load cart from backend on initial render
  useEffect(() => {
    fetch(`${API_BASE}?userId=${USER_ID}`)
      .then(res => res.json())
      .then(data => setCart(data.map((item: any) => ({ ...item.product, quantity: item.quantity }))))
      .catch(() => setCart([]));
  }, []);

  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
    if (quantity < 1) return false;
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, productId: product.id, quantity })
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
    try {
      const res = await fetch(`${API_BASE}/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID })
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
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, quantity })
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
    try {
      const res = await fetch(API_BASE, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID })
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
      return total + (item.numericPrice * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        isInCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
