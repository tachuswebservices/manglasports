import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Product } from '@/data/products';

type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  isInCart: (productId: string) => boolean;
  clearCart: () => void;
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('manglaSportsCart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[];
        // Validate cart items
        const validCart = parsed.filter((item): item is CartItem => {
          return (
            typeof item?.id === 'string' &&
            typeof item?.name === 'string' &&
            typeof item?.price === 'string' &&
            typeof item?.numericPrice === 'number' &&
            typeof item?.image === 'string' &&
            typeof item?.category === 'string' &&
            typeof item?.quantity === 'number' &&
            item.quantity > 0
          );
        });
        setCart(validCart);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('manglaSportsCart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, quantity: number = 1): boolean => {
    if (quantity < 1) return false;
    
    setCart((prevCart) => {
      // Check if product is already in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
    
    toast.success(`${product.name} added to cart`);
    return true;
  };

  const removeFromCart = (productId: string): boolean => {
    let removed = false;
    setCart((prevCart) => {
      const exists = prevCart.some(item => item.id === productId);
      if (!exists) return prevCart;
      
      removed = true;
      return prevCart.filter(item => item.id !== productId);
    });
    
    if (removed) {
      const product = cart.find(item => item.id === productId);
      if (product) {
        toast.success(`${product.name} removed from cart`);
      }
    }
    
    return removed;
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.id === productId);
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
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
