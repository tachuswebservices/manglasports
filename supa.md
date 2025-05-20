# Supabase Implementation Guide for Mangla Sports & Associates

This guide provides a comprehensive step-by-step plan for implementing Supabase as a complete backend solution for the Mangla Sports & Associates e-commerce platform. Supabase will handle product management, user authentication, inventory tracking, and more.

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Initial Setup](#phase-1-initial-setup)
3. [Phase 2: Product Management](#phase-2-product-management)
4. [Phase 3: Authentication & User Accounts](#phase-3-authentication--user-accounts)
5. [Phase 4: Inventory Management](#phase-4-inventory-management)
6. [Phase 5: Admin Interface](#phase-5-admin-interface)
7. [Phase 6: Order Processing](#phase-6-order-processing)
8. [Phase 7: Deployment & Optimization](#phase-7-deployment--optimization)
9. [Maintenance & Future Enhancements](#maintenance--future-enhancements)

## Overview

Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database
- Authentication system
- Storage for files and images
- Real-time subscriptions
- Edge functions (serverless)
- All with a generous free tier

This solution will replace:
- JSON files for product data
- Local state management for auth
- Manual inventory tracking
- And provide a robust backend without requiring advanced backend knowledge

## Phase 1: Initial Setup

### 1.1 Create a Supabase Project

1. Sign up at [supabase.com](https://supabase.com) (free tier available)
2. Create a new project with a name (e.g., "mangla-sports")
3. Note your project URL and anon key (public API key)

### 1.2 Set Up Project Connection

1. Install Supabase client in your React project:
   ```
   npm install @supabase/supabase-js
   ```

2. Create a client connection file (`/src/lib/supabase.ts`):
   ```typescript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = 'https://your-project-id.supabase.co';
   const supabaseAnonKey = 'your-anon-key';

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

### 1.3 Set Up Environment Variables

1. Create a `.env` file (and add to `.gitignore`):
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Update the supabase client to use environment variables:
   ```typescript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   ```

## Phase 2: Product Management

### 2.1 Create Database Tables

1. In Supabase Dashboard, go to SQL Editor
2. Create Categories Table:
   ```sql
   CREATE TABLE categories (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR NOT NULL,
     slug VARCHAR NOT NULL UNIQUE,
     description TEXT,
     image_url VARCHAR,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. Create Products Table:
   ```sql
   CREATE TABLE products (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR NOT NULL,
     slug VARCHAR NOT NULL UNIQUE,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     numeric_price DECIMAL(10,2) NOT NULL,
     category_id UUID REFERENCES categories(id),
     in_stock BOOLEAN DEFAULT true,
     stock_quantity INTEGER DEFAULT 0,
     is_new_arrival BOOLEAN DEFAULT false,
     is_best_seller BOOLEAN DEFAULT false,
     image_url VARCHAR,
     additional_images JSONB,
     specifications JSONB,
     features JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### 2.2 Create Database Indexes

```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_stock ON products(in_stock);
CREATE INDEX idx_products_new_arrival ON products(is_new_arrival);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
```

### 2.3 Migrate Existing Product Data

1. Create a migration script (`scripts/migrate-products.js`):
   ```javascript
   import { supabase } from '../src/lib/supabase';
   import { products } from '../src/data/products';
   import { categories } from '../src/data/categories';

   async function migrateCategories() {
     for (const category of categories) {
       const { data, error } = await supabase
         .from('categories')
         .insert({
           name: category.title,
           slug: category.slug,
           description: category.description || '',
           image_url: category.image || ''
         });
         
       if (error) console.error('Error adding category:', error);
     }
     console.log('Categories migration complete');
   }

   async function migrateProducts() {
     // Get category IDs from Supabase
     const { data: categoryData } = await supabase
       .from('categories')
       .select('id, slug');
       
     const categoryMap = {};
     categoryData.forEach(cat => {
       categoryMap[cat.slug] = cat.id;
     });
     
     for (const product of products) {
       const categoryId = categoryMap[product.category];
       
       if (!categoryId) {
         console.warn(`No category found for ${product.name}, category: ${product.category}`);
         continue;
       }
       
       const { data, error } = await supabase
         .from('products')
         .insert({
           name: product.name,
           slug: product.id,
           description: product.description || '',
           price: product.price,
           numeric_price: product.numericPrice,
           category_id: categoryId,
           in_stock: product.inStock,
           stock_quantity: product.stockQuantity || 10,
           is_new_arrival: product.isNewArrival || false,
           is_best_seller: product.isBestSeller || false,
           image_url: product.image,
           additional_images: product.images || [],
           specifications: product.specifications || {},
           features: product.features || []
         });
         
       if (error) console.error('Error adding product:', error);
     }
     console.log('Products migration complete');
   }

   async function migrate() {
     await migrateCategories();
     await migrateProducts();
   }

   migrate();
   ```

2. Run migration script:
   ```
   node scripts/migrate-products.js
   ```

### 2.4 Update Product Fetching in React

1. Create a new API service (`/src/lib/api.ts`):
   ```typescript
   import { supabase } from './supabase';

   export async function getProducts() {
     const { data, error } = await supabase
       .from('products')
       .select(`
         *,
         categories:category_id (name, slug)
       `)
       .order('name');
       
     if (error) throw error;
     return data;
   }

   export async function getNewArrivals() {
     const { data, error } = await supabase
       .from('products')
       .select(`
         *,
         categories:category_id (name, slug)
       `)
       .eq('is_new_arrival', true)
       .order('created_at', { ascending: false })
       .limit(8);
       
     if (error) throw error;
     return data;
   }

   export async function getBestSellers() {
     const { data, error } = await supabase
       .from('products')
       .select(`
         *,
         categories:category_id (name, slug)
       `)
       .eq('is_best_seller', true)
       .limit(8);
       
     if (error) throw error;
     return data;
   }

   export async function getProductsByCategory(categorySlug) {
     const { data, error } = await supabase
       .from('products')
       .select(`
         *,
         categories:category_id (name, slug)
       `)
       .eq('categories.slug', categorySlug);
       
     if (error) throw error;
     return data;
   }

   export async function getProductDetail(slug) {
     const { data, error } = await supabase
       .from('products')
       .select(`
         *,
         categories:category_id (name, slug)
       `)
       .eq('slug', slug)
       .single();
       
     if (error) throw error;
     return data;
   }
   ```

## Phase 3: Authentication & User Accounts

### 3.1 Set Up Authentication Tables

Supabase automatically creates auth tables when you create a project.

### 3.2 Configure Auth Providers

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Email authentication
3. Optionally enable social login providers (Google, Facebook)

### 3.3 Create User Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a secure RLS policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

### 3.4 Create Auth Context

1. Create an auth context (`/src/contexts/AuthContext.tsx`):
   ```typescript
   import React, { createContext, useContext, useEffect, useState } from 'react';
   import { supabase } from '@/lib/supabase';
   import { User, Session } from '@supabase/supabase-js';

   type AuthContextType = {
     user: User | null;
     session: Session | null;
     loading: boolean;
     signIn: (email: string, password: string) => Promise<void>;
     signUp: (email: string, password: string) => Promise<void>;
     signOut: () => Promise<void>;
     updateProfile: (data: any) => Promise<void>;
   };

   const AuthContext = createContext<AuthContextType | undefined>(undefined);

   export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [user, setUser] = useState<User | null>(null);
     const [session, setSession] = useState<Session | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       // Get initial session
       const getInitialSession = async () => {
         const { data, error } = await supabase.auth.getSession();
         setSession(data.session);
         setUser(data.session?.user ?? null);
         setLoading(false);
       };

       getInitialSession();

       // Listen for auth changes
       const { data: authListener } = supabase.auth.onAuthStateChange(
         (event, session) => {
           setSession(session);
           setUser(session?.user ?? null);
           setLoading(false);
         }
       );

       return () => {
         authListener.subscription.unsubscribe();
       };
     }, []);

     const signIn = async (email: string, password: string) => {
       const { error } = await supabase.auth.signInWithPassword({ email, password });
       if (error) throw error;
     };

     const signUp = async (email: string, password: string) => {
       const { error } = await supabase.auth.signUp({ email, password });
       if (error) throw error;
     };

     const signOut = async () => {
       const { error } = await supabase.auth.signOut();
       if (error) throw error;
     };

     const updateProfile = async (data: any) => {
       const { error } = await supabase
         .from('profiles')
         .upsert(
           { 
             id: user?.id,
             ...data,
             updated_at: new Date()
           },
           { onConflict: 'id' }
         );
       
       if (error) throw error;
     };

     const value = {
       user,
       session,
       loading,
       signIn,
       signUp,
       signOut,
       updateProfile
     };

     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
   };

   export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
       throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
   };
   ```

2. Add the AuthProvider to your App.tsx:
   ```tsx
   // In App.tsx
   import { AuthProvider } from './contexts/AuthContext';

   const App = () => (
     <QueryClientProvider client={queryClient}>
       <ThemeProvider>
         <TooltipProvider>
           <AuthProvider>
             <WishlistProvider>
               <CartProvider>
                 {/* ... rest of your app */}
               </CartProvider>
             </WishlistProvider>
           </AuthProvider>
         </TooltipProvider>
       </ThemeProvider>
     </QueryClientProvider>
   );
   ```

### 3.5 Create Login/Signup Pages

1. Create Login Page (`/src/pages/Login.tsx`)
2. Create Signup Page (`/src/pages/Signup.tsx`)
3. Create Account Page (`/src/pages/Account.tsx`)
4. Add routes to App.tsx

## Phase 4: Inventory Management

### 4.1 Create Inventory Table

```sql
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  quantity_change INTEGER NOT NULL,
  stock_before INTEGER NOT NULL,
  stock_after INTEGER NOT NULL,
  reason VARCHAR,
  type VARCHAR CHECK (type IN ('sale', 'restock', 'adjustment')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the product's stock quantity
  UPDATE products
  SET stock_quantity = stock_quantity + NEW.quantity_change,
      in_stock = (stock_quantity + NEW.quantity_change > 0),
      updated_at = NOW()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stock when inventory logs are added
CREATE TRIGGER update_stock_after_inventory_log
AFTER INSERT ON inventory_logs
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();
```

### 4.2 Create Inventory API Functions

Add to `/src/lib/api.ts`:

```typescript
export async function updateInventory(productId, quantityChange, reason, type) {
  // First get current stock
  const { data: product } = await supabase
    .from('products')
    .select('stock_quantity')
    .eq('id', productId)
    .single();
    
  if (!product) throw new Error('Product not found');
  
  const stockBefore = product.stock_quantity;
  const stockAfter = stockBefore + quantityChange;
  
  // Log the inventory change
  const { error } = await supabase
    .from('inventory_logs')
    .insert({
      product_id: productId,
      quantity_change: quantityChange,
      stock_before: stockBefore,
      stock_after: stockAfter,
      reason,
      type,
      created_by: supabase.auth.user()?.id
    });
    
  if (error) throw error;
  
  return { stockBefore, stockAfter };
}
```

## Phase 5: Admin Interface

### 5.1 Create Admin Pages

1. `/src/pages/admin/Dashboard.tsx`
2. `/src/pages/admin/Products.tsx`
3. `/src/pages/admin/Inventory.tsx`
4. `/src/pages/admin/Orders.tsx`

### 5.2 Create Admin Role and Policies

```sql
-- Create an admin role
INSERT INTO auth.roles (name) VALUES ('admin');

-- Example RLS policy allowing admins to access all products
CREATE POLICY "Admins can do anything with products"
  ON products
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );
```

### 5.3 Create Simple Admin Inventory Management

Create a straightforward form in `/src/pages/admin/Inventory.tsx` for:
- Searching products
- Updating stock quantities 
- Logging reason for changes
- Viewing stock history

## Phase 6: Order Processing

### 6.1 Create Orders Tables

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  status VARCHAR CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  payment_intent_id VARCHAR,
  payment_status VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to update inventory when orders are placed
CREATE OR REPLACE FUNCTION create_inventory_log_from_order()
RETURNS TRIGGER AS $$
BEGIN
  -- For each product in the order, create an inventory log entry
  INSERT INTO inventory_logs (
    product_id,
    quantity_change,
    stock_before,
    stock_after,
    reason,
    type,
    created_by
  )
  SELECT
    NEW.product_id,
    -NEW.quantity, -- negative because it's a sale
    p.stock_quantity,
    p.stock_quantity - NEW.quantity,
    'Order ' || NEW.order_id,
    'sale',
    (SELECT user_id FROM orders WHERE id = NEW.order_id)
  FROM products p
  WHERE p.id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_inventory_log_after_order
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION create_inventory_log_from_order();
```

### 6.2 Create Order Processing API Functions

Add to `/src/lib/api.ts`:

```typescript
export async function createOrder(orderData) {
  // Start a transaction
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: supabase.auth.user()?.id,
      status: 'pending',
      total_amount: orderData.totalAmount,
      shipping_address: orderData.shippingAddress,
      payment_status: 'pending'
    })
    .single();
    
  if (orderError) throw orderError;
  
  // Add order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_time: item.price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
    
  if (itemsError) throw itemsError;
  
  return order;
}
```

## Phase 7: Deployment & Optimization

### 7.1 Set Up Frontend Optimizations

1. Implement React Query for data fetching and caching:
   ```typescript
   import { useQuery } from 'react-query';
   import { getProducts } from '@/lib/api';

   export function useProducts() {
     return useQuery('products', getProducts, {
       staleTime: 1000 * 60 * 5, // 5 minutes
     });
   }
   ```

2. Implement image optimization and lazy loading
3. Set up pagination for product lists

### 7.2 Configure Supabase Edge Functions

For specialized backend needs, create Edge Functions:

1. Install Supabase CLI:
   ```
   npm i -g supabase
   ```

2. Initialize Supabase functions:
   ```
   supabase functions new process-payment
   ```

3. Create a payment processing function (`./supabase/functions/process-payment/index.ts`)

### 7.3 Deploy to Netlify, Vercel, or similar

1. Connect your GitHub repository
2. Configure build settings
3. Set environment variables (Supabase URL & key)
4. Deploy

## Maintenance & Future Enhancements

### Regular Maintenance
1. Set up regular database backups
2. Monitor API usage and limits
3. Implement error tracking

### Future Enhancements
1. Add product variants (sizes, colors)
2. Implement search functionality with Supabase's full-text search
3. Set up analytics for purchase trends
4. Add customer reviews and ratings
5. Implement promotional discounts and coupons

## Conclusion

This implementation plan provides a complete roadmap for migrating your Mangla Sports e-commerce platform to Supabase. By following these steps, you'll create a robust, scalable system that:

1. Handles product management effectively
2. Provides secure user authentication
3. Manages inventory for both online and offline sales
4. Creates a simple admin interface for non-technical users
5. Processes orders and maintains history

All this while maintaining a user-friendly interface for store managers and customers alike.
