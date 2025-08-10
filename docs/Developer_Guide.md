# Mangla Sports - Developer Guide

## Table of Contents
1. [Database Structure](#database-structure)
2. [Product Management](#product-management)
   - [Product Categories](#product-categories)
   - [Product Data Structure](#product-data-structure)
   - [Managing New Arrivals & Best Sellers](#managing-new-arrivals--best-sellers)
   - [Product Tags and Badges](#product-tags-and-badges)
3. [Search & Filtering](#search--filtering)
   - [Full-Text Search](#full-text-search)
   - [Filter Implementation](#filter-implementation)
   - [Performance Optimization](#search-performance-optimization)
4. [Inventory Management](#inventory-management)
   - [Stock Tracking](#stock-tracking)
   - [Online/Offline Sales Integration](#onlineoffline-sales-integration)
   - [Inventory Logs](#inventory-logs)
   - [Low Stock Alerts](#low-stock-alerts)
5. [User Features](#user-features)
   - [Cart Persistence](#cart-persistence)
   - [Wishlist Management](#wishlist-management)
   - [Recently Viewed Products](#recently-viewed-products)
6. [User Authentication](#user-authentication)
   - [Role-Based Access Control](#role-based-access-control)
   - [Customer Accounts](#customer-accounts)
   - [Admin Accounts](#admin-accounts)
   - [Security Policies](#security-policies)
7. [Order Processing](#order-processing)
   - [Order Structure](#order-structure)
   - [Order Status Flow](#order-status-flow)
   - [Payment Processing](#payment-processing)
   - [Razorpay Integration](#razorpay-integration)
8. [Email Notifications](#email-notifications)
   - [Email Templates](#email-templates)
   - [Notification Queue](#notification-queue)
   - [Email Service Integration](#email-service-integration)
9. [Admin Interface](#admin-interface)
   - [Product Management](#admin-product-management)
   - [Inventory Updates](#admin-inventory-updates)
   - [Order Management](#admin-order-management)
   - [Analytics Dashboard](#analytics-dashboard)
10. [API Documentation](#api-documentation)
    - [Authentication](#api-authentication)
    - [Products API](#products-api)
    - [Orders API](#orders-api)
    - [User API](#user-api)
11. [Security Best Practices](#security-best-practices)
    - [Input Validation](#input-validation)
    - [Rate Limiting](#rate-limiting)
    - [XSS & CSRF Protection](#xss--csrf-protection)
12. [Performance Optimization](#performance-optimization)
    - [Caching Strategy](#caching-strategy)
    - [Query Optimization](#query-optimization)
    - [CDN Configuration](#cdn-configuration)
13. [Testing Guidelines](#testing-guidelines)
    - [Unit Testing](#unit-testing)
    - [Integration Testing](#integration-testing)
    - [E2E Testing](#e2e-testing)
14. [Deployment & DevOps](#deployment--devops)
    - [Environment Configuration](#environment-configuration)
    - [CI/CD Pipeline](#cicd-pipeline)
    - [Monitoring & Logging](#monitoring--logging)
    - [Backup & Recovery](#backup--recovery)
15. [Migration Strategy](#migration-strategy)
    - [Mock Data Migration](#mock-data-migration)
    - [Production Checklist](#production-checklist)
16. [Development Guidelines](#development-guidelines)
    - [Local Development](#local-development)
    - [Code Standards](#code-standards)
    - [Mobile UI Best Practices](#mobile-ui-best-practices)
17. [Troubleshooting](#troubleshooting)

## Database Structure

The Mangla Sports e-commerce platform uses Supabase as its backend, with the following database structure:

### Core Tables

#### `categories` Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR,
  emoji VARCHAR(10),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `brands` Table
```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL UNIQUE,
  slug VARCHAR NOT NULL UNIQUE,
  logo_url VARCHAR,
  description TEXT,
  website_url VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `products` Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  numeric_price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  is_new_arrival BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_hot BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  image_url VARCHAR,
  additional_images JSONB,
  specifications JSONB,
  features JSONB,
  search_vector tsvector,
  meta_title VARCHAR,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create full-text search index
CREATE INDEX products_search_idx ON products USING GIN (search_vector);

-- Create trigger to update search vector
CREATE OR REPLACE FUNCTION products_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.short_description,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description,'')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_update BEFORE INSERT OR UPDATE
  ON products FOR EACH ROW EXECUTE FUNCTION products_search_trigger();
```

#### `inventory_logs` Table
```sql
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  quantity_change INTEGER NOT NULL,
  stock_before INTEGER NOT NULL,
  stock_after INTEGER NOT NULL,
  reason VARCHAR,
  type VARCHAR CHECK (type IN ('sale', 'restock', 'adjustment', 'return')),
  order_id UUID REFERENCES orders(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `profiles` Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  date_of_birth DATE,
  gender VARCHAR,
  address JSONB,
  shipping_addresses JSONB DEFAULT '[]'::jsonb,
  billing_address JSONB,
  preferences JSONB DEFAULT '{}'::jsonb,
  role VARCHAR DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `carts` Table
```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_id VARCHAR, -- For anonymous users
  items JSONB DEFAULT '[]'::jsonb,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
```

#### `wishlists` Table
```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
```

#### `recently_viewed` Table
```sql
CREATE TABLE recently_viewed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_id VARCHAR, -- For anonymous users
  product_id UUID REFERENCES products(id) NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_recently_viewed_user_id ON recently_viewed(user_id);
CREATE INDEX idx_recently_viewed_session_id ON recently_viewed(session_id);
```

#### `orders` Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  status VARCHAR CHECK (status IN ('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  shipping_address JSONB,
  billing_address JSONB,
  payment_method VARCHAR,
  payment_intent_id VARCHAR,
  payment_status VARCHAR,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

#### `order_items` Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

#### `email_queue` Table
```sql
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  to_email VARCHAR NOT NULL,
  from_email VARCHAR DEFAULT 'noreply@manglasports.com',
  subject VARCHAR NOT NULL,
  template_name VARCHAR NOT NULL,
  template_data JSONB,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_queue_status ON email_queue(status);
```

#### `product_reviews` Table
```sql
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
```

### Database Indexes

```sql
-- Product indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_stock ON products(in_stock);
CREATE INDEX idx_products_price ON products(numeric_price);
CREATE INDEX idx_products_new_arrival ON products(is_new_arrival);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Inventory indexes
CREATE INDEX idx_inventory_logs_product ON inventory_logs(product_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at DESC);
```

### Database Triggers

```sql
-- Update product stock and rating
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity + NEW.quantity_change,
      in_stock = (stock_quantity + NEW.quantity_change > 0),
      updated_at = NOW()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_after_inventory_log
AFTER INSERT ON inventory_logs
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

-- Update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET rating = (
    SELECT AVG(rating)::DECIMAL(2,1)
    FROM product_reviews
    WHERE product_id = NEW.product_id AND is_approved = true
  ),
  review_count = (
    SELECT COUNT(*)
    FROM product_reviews
    WHERE product_id = NEW.product_id AND is_approved = true
  ),
  updated_at = NOW()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
    LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();
```

## Search & Filtering

### Full-Text Search

Implement PostgreSQL full-text search for products:

```typescript
// Search products with full-text search
export async function searchProducts(query: string, filters?: SearchFilters) {
  let searchQuery = supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      brand:brands(name, slug)
    `)
    .textSearch('search_vector', query, {
      type: 'websearch',
      config: 'english'
    });

  // Apply additional filters
  if (filters?.category) {
    searchQuery = searchQuery.eq('category_id', filters.category);
  }
  
  if (filters?.minPrice !== undefined) {
    searchQuery = searchQuery.gte('numeric_price', filters.minPrice);
  }
  
  if (filters?.maxPrice !== undefined) {
    searchQuery = searchQuery.lte('numeric_price', filters.maxPrice);
  }
  
  if (filters?.brands?.length) {
    searchQuery = searchQuery.in('brand_id', filters.brands);
  }
  
  if (filters?.inStock) {
    searchQuery = searchQuery.eq('in_stock', true);
  }

  // Apply sorting
  switch (filters?.sortBy) {
    case 'price-asc':
      searchQuery = searchQuery.order('numeric_price', { ascending: true });
      break;
    case 'price-desc':
      searchQuery = searchQuery.order('numeric_price', { ascending: false });
      break;
    case 'rating':
      searchQuery = searchQuery.order('rating', { ascending: false });
      break;
    case 'newest':
      searchQuery = searchQuery.order('created_at', { ascending: false });
      break;
    default:
      // Relevance (default for search)
      break;
  }

  const { data, error } = await searchQuery;
  
  if (error) throw error;
  return data;
}
```

### Filter Implementation

```typescript
// Get filter options
export async function getFilterOptions(category?: string) {
  // Get price range
  const { data: priceRange } = await supabase
    .from('products')
    .select('numeric_price')
    .order('numeric_price', { ascending: true })
    .limit(1);
    
  const { data: maxPrice } = await supabase
    .from('products')
    .select('numeric_price')
    .order('numeric_price', { ascending: false })
    .limit(1);

  // Get brands for category
  let brandsQuery = supabase
    .from('products')
    .select('brand:brands(id, name, slug)');
    
  if (category) {
    brandsQuery = brandsQuery.eq('category.slug', category);
  }
  
  const { data: brandsData } = await brandsQuery;
  
  const uniqueBrands = Array.from(
    new Map(brandsData?.map(item => [item.brand.id, item.brand])).values()
  );

  return {
    priceRange: {
      min: priceRange?.[0]?.numeric_price || 0,
      max: maxPrice?.[0]?.numeric_price || 999999
    },
    brands: uniqueBrands,
    categories: await getCategories()
  };
}
```

### Search Performance Optimization

1. **Search Indexing**:
   - Use GIN indexes for full-text search
   - Create composite indexes for common filter combinations
   - Implement search result caching

2. **Query Optimization**:
   ```sql
   -- Composite index for common filters
   CREATE INDEX idx_products_category_price_stock 
   ON products(category_id, numeric_price, in_stock) 
   WHERE in_stock = true;
   ```

3. **Search Suggestions**:
   ```typescript
   export async function getSearchSuggestions(query: string, limit = 5) {
     const { data } = await supabase
       .from('products')
       .select('name, slug')
       .textSearch('search_vector', query)
       .limit(limit);
     
     return data;
   }
   ```

## User Features

### Cart Persistence

Implement cart persistence in the database for logged-in users:

```typescript
// Cart service functions
export async function syncCart(userId: string, localCart: CartItem[]) {
  // Get existing cart
  const { data: existingCart } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existingCart) {
    // Merge local cart with existing cart
    const mergedItems = mergeCartItems(existingCart.items, localCart);
    
    const { error } = await supabase
      .from('carts')
      .update({ 
        items: mergedItems,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
      
    if (error) throw error;
    return mergedItems;
  } else {
    // Create new cart
    const { data, error } = await supabase
      .from('carts')
      .insert({ 
        user_id: userId, 
        items: localCart 
      })
      .select()
      .single();
      
    if (error) throw error;
    return data.items;
  }
}

// Helper function to merge cart items
function mergeCartItems(dbItems: any[], localItems: any[]) {
  const itemMap = new Map();
  
  // Add database items
  dbItems.forEach(item => {
    itemMap.set(item.product_id, item);
  });
  
  // Merge local items
  localItems.forEach(item => {
    if (itemMap.has(item.product_id)) {
      // Update quantity
      const existing = itemMap.get(item.product_id);
      existing.quantity += item.quantity;
    } else {
      // Add new item
      itemMap.set(item.product_id, item);
    }
  });
  
  return Array.from(itemMap.values());
}

// Clean up expired carts
export async function cleanupExpiredCarts() {
  const { error } = await supabase
    .from('carts')
    .delete()
    .lt('expires_at', new Date().toISOString());
    
  if (error) console.error('Error cleaning up carts:', error);
}
```

### Wishlist Management

```typescript
// Wishlist functions
export async function addToWishlist(userId: string, productId: string) {
  const { error } = await supabase
    .from('wishlists')
    .insert({ user_id: userId, product_id: productId });
    
  if (error && error.code !== '23505') { // Ignore duplicate error
    throw error;
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
    
  if (error) throw error;
}

export async function getWishlist(userId: string) {
  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .order('added_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function moveWishlistToCart(userId: string, productId: string) {
  // Start a transaction
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
    
  if (!product) throw new Error('Product not found');
  
  // Add to cart
  await addToCart(userId, product, 1);
  
  // Remove from wishlist
  await removeFromWishlist(userId, productId);
}
```

### Recently Viewed Products

```typescript
// Track recently viewed products
export async function trackProductView(
  productId: string, 
  userId?: string, 
  sessionId?: string
) {
  // Limit to 20 recent products per user/session
  const identifier = userId ? { user_id: userId } : { session_id: sessionId };
  
  // Get existing views
  const { data: existing } = await supabase
    .from('recently_viewed')
    .select('id')
    .match(identifier)
    .order('viewed_at', { ascending: false })
    .limit(20);
    
  // Delete oldest if at limit
  if (existing && existing.length >= 20) {
    await supabase
      .from('recently_viewed')
      .delete()
      .eq('id', existing[existing.length - 1].id);
  }
  
  // Add new view
  const { error } = await supabase
    .from('recently_viewed')
    .insert({
      ...identifier,
      product_id: productId,
      viewed_at: new Date().toISOString()
    });
    
  if (error) console.error('Error tracking view:', error);
}

export async function getRecentlyViewed(
  userId?: string, 
  sessionId?: string,
  limit = 10
) {
  const identifier = userId ? { user_id: userId } : { session_id: sessionId };
  
  const { data, error } = await supabase
    .from('recently_viewed')
    .select(`
      *,
      product:products(*)
    `)
    .match(identifier)
    .order('viewed_at', { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  return data;
}
```

## User Authentication

### Role-Based Access Control

The application uses Supabase Auth with role-based access control:

- **Customer**: Regular users who can browse products, place orders, and manage their account.
- **Admin**: Staff members who can manage products, inventory, and orders.
- **Staff**: Limited admin access for specific operations.

### Customer Accounts

Customer accounts include:

- Basic authentication (email/password)
- Social authentication (Google, Facebook)
- Profile information (name, contact details, etc.)
- Address book for shipping
- Order history
- Wishlist management
- Cart persistence
- Email preferences

### Admin Accounts

Admin accounts have additional privileges:

- Product management (add, edit, delete products)
- Inventory management (update stock, view logs)
- Order management (view, update status)
- Customer management (view orders, assist with issues)
- Analytics access
- Email campaign management

### Security Policies

Row-level security policies control access to data:

```sql
-- Customers can only view their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Products are viewable by everyone
CREATE POLICY "Products are viewable by all" 
  ON products FOR SELECT 
  USING (true);

-- Only admins can modify products
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Wishlist policies
CREATE POLICY "Users can manage own wishlist"
  ON wishlists FOR ALL
  USING (auth.uid() = user_id);

-- Cart policies
CREATE POLICY "Users can manage own cart"
  ON carts FOR ALL
  USING (auth.uid() = user_id);
```

## Order Processing

### Order Structure

Orders are stored in the `orders` table and linked to the items purchased in the `order_items` table:

```typescript
type Order = {
  id: string;              // UUID
  userId: string;          // Customer ID
  status: OrderStatus;     // Order status
  totalAmount: number;     // Total order amount
  shippingAddress: Address;// Shipping address
  paymentIntentId: string; // Payment gateway reference
  paymentStatus: string;   // Payment status
  createdAt: Date;         // Order date
  updatedAt: Date;         // Last update date
};

type OrderItem = {
  id: string;              // UUID
  orderId: string;         // Reference to order
  productId: string;       // Reference to product
  quantity: number;        // Quantity ordered
  priceAtTime: number;     // Price at time of purchase
};
```

### Order Status Flow

Orders follow this status progression:

1. **Pending**: Order created but payment not yet confirmed
2. **Processing**: Payment confirmed, order being prepared
3. **Shipped**: Order has been shipped to customer
4. **Delivered**: Order has been received by customer
5. **Rejected**: Order was rejected by admin (can occur at any step)
6. **Cancelled**: Order was cancelled (can occur at any step before shipping)

### Order Status Email Notifications

The system includes an advanced email confirmation system for critical order status changes:

#### Email Confirmation Workflow
- **Admin Dashboard**: When updating order status to shipped, delivered, or rejected, admins see a confirmation dialog
- **Email Confirmation**: Admins can choose whether to send notification emails to customers
- **Status-Specific Templates**: Professional email templates tailored for each status:
  - **Shipped**: Shipping confirmation with tracking information
  - **Delivered**: Delivery confirmation with thank you message
  - **Rejected**: Professional rejection notification with support contact

#### Technical Implementation
```typescript
// Order status update with email confirmation
PUT /api/orders/items/:id/with-email

// Request body includes email confirmation flag
{
  "status": "shipped" | "delivered" | "rejected",
  "sendEmail": boolean,
  "expectedDate"?: Date,        // For shipped status
  "courierPartner"?: string,    // For shipped status
  "trackingId"?: string         // For shipped status
}

// Response includes email sending result
{
  "orderItem": OrderItem,
  "emailResult": {
    "success": boolean,
    "message": string
  }
}
```

#### Email Service Integration
- **Nodemailer**: SMTP-based email delivery
- **Template System**: Dynamic HTML templates with status-specific content
- **Error Handling**: Graceful fallback if email sending fails
- **Professional Styling**: Consistent branding and responsive design

### Payment Processing

The application integrates with Razorpay for payment processing:

1. **Checkout Flow**:
   - Cart is validated for product availability
   - Payment intent is created with Razorpay
   - User completes payment on Razorpay's system
   - Webhook confirms payment and updates order status
   - Inventory is automatically adjusted via database triggers

2. **Payment Verification**:
   - Payment signature is verified to prevent fraud
   - Order status is updated based on payment result

### Razorpay Integration

```typescript
// Initialize Razorpay
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
export async function createPaymentOrder(orderId: string, amount: number) {
  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    receipt: orderId,
    payment_capture: 1,
    notes: {
      order_id: orderId
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    
    // Update order with payment intent
    await supabase
      .from('orders')
      .update({ 
        payment_intent_id: order.id,
        payment_status: 'pending'
      })
      .eq('id', orderId);
      
    return order;
  } catch (error) {
    console.error('Payment order creation failed:', error);
    throw error;
  }
}

// Verify payment signature
export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const body = orderId + '|' + paymentId;
  const crypto = require('crypto');
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
    
  const isAuthentic = expectedSignature === signature;
  
  if (isAuthentic) {
    // Update order status
    await supabase
      .from('orders')
      .update({ 
        payment_status: 'completed',
        status: 'confirmed'
      })
      .eq('payment_intent_id', orderId);
      
    // Create inventory log entries
    await processOrderInventory(orderId);
    
    // Send confirmation email
    await sendOrderConfirmationEmail(orderId);
  }
  
  return isAuthentic;
}

// Webhook handler
export async function handlePaymentWebhook(req: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  
  const crypto = require('crypto');
  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');
  
  if (digest !== signature) {
    throw new Error('Invalid webhook signature');
  }
  
  const event = req.body;
  
  switch (event.event) {
    case 'payment.captured':
      await handlePaymentCaptured(event.payload.payment.entity);
      break;
    case 'payment.failed':
      await handlePaymentFailed(event.payload.payment.entity);
      break;
    case 'refund.created':
      await handleRefundCreated(event.payload.refund.entity);
      break;
  }
}
```

## Email Notifications

### Email Templates

Define email templates for various notifications:

```typescript
// Email templates configuration
export const emailTemplates = {
  orderConfirmation: {
    subject: 'Order Confirmation - {{orderNumber}}',
    template: 'order-confirmation',
    variables: ['orderNumber', 'customerName', 'items', 'total', 'deliveryDate']
  },
  orderShipped: {
    subject: 'Your Order Has Been Shipped - {{orderNumber}}',
    template: 'order-shipped',
    variables: ['orderNumber', 'trackingNumber', 'carrier', 'estimatedDelivery']
  },
  orderDelivered: {
    subject: 'Your Order Has Been Delivered - {{orderNumber}}',
    template: 'order-delivered',
    variables: ['orderNumber', 'deliveryDate', 'items']
  },
  orderRejected: {
    subject: 'Order Status Update - {{orderNumber}}',
    template: 'order-rejected',
    variables: ['orderNumber', 'rejectionReason', 'supportContact']
  },
  orderStatusUpdate: {
    subject: '{{statusTitle}} - {{orderNumber}}',
    template: 'order-status-update',
    variables: ['orderNumber', 'status', 'statusTitle', 'statusMessage', 'statusDetails']
  },
  passwordReset: {
    subject: 'Reset Your Password',
    template: 'password-reset',
    variables: ['resetLink', 'expiryTime']
  },
  welcomeEmail: {
    subject: 'Welcome to Mangla Sports!',
    template: 'welcome',
    variables: ['customerName', 'verificationLink']
  },
  lowStockAlert: {
    subject: 'Low Stock Alert - {{productName}}',
    template: 'low-stock',
    variables: ['productName', 'currentStock', 'threshold']
  },
  abandonedCart: {
    subject: 'You left something in your cart',
    template: 'abandoned-cart',
    variables: ['customerName', 'cartItems', 'cartLink']
  }
};
```

### Notification Queue

```typescript
// Queue email for sending
export async function queueEmail(
  to: string,
  templateName: string,
  templateData: Record<string, any>
) {
  const template = emailTemplates[templateName];
  if (!template) throw new Error('Invalid template');
  
  const subject = template.subject.replace(
    /\{\{(\w+)\}\}/g,
    (match, key) => templateData[key] || match
  );
  
  const { error } = await supabase
    .from('email_queue')
    .insert({
      to_email: to,
      subject,
      template_name: templateName,
      template_data: templateData,
      status: 'pending'
    });
    
  if (error) throw error;
}

// Process email queue
export async function processEmailQueue() {
  const { data: pendingEmails } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'pending')
    .lt('attempts', 3)
    .limit(10);
    
  for (const email of pendingEmails || []) {
    try {
      await sendEmail(email);
      
      await supabase
        .from('email_queue')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', email.id);
    } catch (error) {
      await supabase
        .from('email_queue')
        .update({ 
          attempts: email.attempts + 1,
          error_message: error.message
        })
        .eq('id', email.id);
    }
  }
}
```

### Email Service Integration

```typescript
// SendGrid integration example
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(emailData: any) {
  const { to_email, subject, template_name, template_data } = emailData;
  
  const msg = {
    to: to_email,
    from: 'noreply@manglasports.com',
    subject: subject,
    templateId: getTemplateId(template_name),
    dynamicTemplateData: template_data
  };
  
  await sgMail.send(msg);
}

// Edge function for automated emails
export async function sendOrderConfirmationEmail(orderId: string) {
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      user:profiles(*)
    `)
    .eq('id', orderId)
    .single();
    
  if (!order) return;
  
  await queueEmail(
    order.user.email,
    'orderConfirmation',
    {
      orderNumber: order.order_number,
      customerName: order.user.first_name,
      items: order.items,
      total: order.total_amount,
      deliveryDate: calculateDeliveryDate()
    }
  );
}
```

## Admin Interface

### Admin Product Management

Admins can manage products through a dedicated admin interface:

1. **List Products**: View all products with filtering and sorting options
2. **Add Product**: Create new products with all required information
3. **Edit Product**: Update product details, images, specifications
4. **Manage Categories**: Add, edit, or remove product categories

### Admin Order Management

The admin interface includes comprehensive order management with email confirmation capabilities:

#### Order Status Management
- **Real-time Updates**: View and update order statuses in real-time
- **Status Workflow**: Manage orders through the complete lifecycle (pending → shipped → delivered)
- **Rejection Handling**: Process rejected orders with professional customer communication

#### Email Confirmation System
- **Smart Dialogs**: When updating status to shipped, delivered, or rejected, admins see confirmation dialogs
- **Email Templates**: Professional email templates for each status type
- **Customer Communication**: Automated customer notifications with status-specific messaging
- **Tracking Support**: For shipped orders, include courier partner and tracking ID

#### Order Fulfillment Features
- **Shipping Charges**: Display and manage product-specific shipping charges
- **Order Tracking**: Add courier partner and tracking information for shipped orders
- **Expected Delivery**: Set and communicate expected delivery dates
- **Customer Support**: Provide contact information for rejected orders

#### Technical Implementation
```typescript
// Order status update with email confirmation
interface OrderStatusUpdate {
  status: 'shipped' | 'delivered' | 'rejected';
  sendEmail: boolean;
  expectedDate?: Date;
  courierPartner?: string;
  trackingId?: string;
}

// Email confirmation dialog component
interface EmailConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: 'shipped' | 'delivered' | 'rejected';
  orderId: number;
  loading?: boolean;
}
```

### Analytics Dashboard

```typescript
// Analytics queries
export async function getDashboardStats(startDate: Date, endDate: Date) {
  // Total revenue
  const { data: revenue } = await supabase
    .from('orders')
    .select('total_amount')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .in('status', ['confirmed', 'shipped', 'delivered']);
    
  const totalRevenue = revenue?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  
  // Order count
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());
    
  // Top products
  const { data: topProducts } = await supabase
    .rpc('get_top_products', { 
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      limit: 10
    });
    
  // Customer insights
  const { data: newCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());
    
  return {
    totalRevenue,
    orderCount,
    topProducts,
    newCustomers: newCustomers?.count || 0,
    conversionRate: calculateConversionRate(startDate, endDate)
  };
}

// Create RPC function for complex queries
CREATE OR REPLACE FUNCTION get_top_products(
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  product_id UUID,
  product_name VARCHAR,
  quantity_sold BIGINT,
  revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oi.product_id,
    p.name as product_name,
    SUM(oi.quantity)::BIGINT as quantity_sold,
    SUM(oi.quantity * oi.price_at_time) as revenue
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.id
  JOIN products p ON oi.product_id = p.id
  WHERE o.created_at BETWEEN start_date AND end_date
    AND o.status IN ('confirmed', 'shipped', 'delivered')
  GROUP BY oi.product_id, p.name
  ORDER BY quantity_sold DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

## API Documentation

### API Authentication

All API endpoints require authentication using Supabase Auth:

```typescript
// Authentication middleware
export async function requireAuth(req: Request) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No authorization token provided');
  }
  
  const { data: user, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new Error('Invalid authorization token');
  }
  
  return user;
}

// Admin authorization
export async function requireAdmin(req: Request) {
  const user = await requireAuth(req);
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (profile?.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}
```

### Products API

```typescript
// GET /api/products
export async function getProducts(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';
  
  let query = supabase
    .from('products')
    .select('*, category:categories(*), brand:brands(*)', { count: 'exact' });
    
  if (category) {
    query = query.eq('category.slug', category);
  }
  
  const { data, count, error } = await query
    .order(sort, { ascending: order === 'asc' })
    .range((page - 1) * limit, page * limit - 1);
    
  if (error) throw error;
  
  return {
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
}

// GET /api/products/:id
export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      reviews:product_reviews(*)
    `)
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
}

// POST /api/products (Admin only)
export async function createProduct(req: Request) {
  await requireAdmin(req);
  const productData = await req.json();
  
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// PUT /api/products/:id (Admin only)
export async function updateProduct(id: string, req: Request) {
  await requireAdmin(req);
  const updates = await req.json();
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// DELETE /api/products/:id (Admin only)
export async function deleteProduct(id: string, req: Request) {
  await requireAdmin(req);
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return { success: true };
}
```

### Orders API

```typescript
// GET /api/orders (User's own orders or all for admin)
export async function getOrders(req: Request) {
  const user = await requireAuth(req);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*, product:products(*))
    `);
    
  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (profile?.role !== 'admin') {
    // Regular users can only see their own orders
    query = query.eq('user_id', user.id);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// POST /api/orders
export async function createOrder(req: Request) {
  const user = await requireAuth(req);
  const orderData = await req.json();
  
  // Start transaction
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      ...orderData
    })
    .select()
    .single();
    
  if (orderError) throw orderError;
  
  // Add order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_time: item.price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
    
  if (itemsError) {
    // Rollback order creation
    await supabase.from('orders').delete().eq('id', order.id);
    throw itemsError;
  }
  
  // Create inventory logs
  for (const item of orderItems) {
    await updateInventory(
      item.product_id,
      -item.quantity,
      `Order ${order.order_number}`,
      'sale'
    );
  }
  
  return order;
}

// PUT /api/orders/:id/status (Admin only)
export async function updateOrderStatus(id: string, req: Request) {
  await requireAdmin(req);
  const { status } = await req.json();
  
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  // Send status update email
  await queueEmail(
    data.user_email,
    'orderStatusUpdate',
    {
      orderNumber: data.order_number,
      newStatus: status
    }
  );
  
  return data;
}
```

### User API

```typescript
// GET /api/user/profile
export async function getUserProfile(req: Request) {
  const user = await requireAuth(req);
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) throw error;
  return data;
}

// PUT /api/user/profile
export async function updateUserProfile(req: Request) {
  const user = await requireAuth(req);
  const updates = await req.json();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// GET /api/user/wishlist
export async function getUserWishlist(req: Request) {
  const user = await requireAuth(req);
  return await getWishlist(user.id);
}

// POST /api/user/wishlist
export async function addToUserWishlist(req: Request) {
  const user = await requireAuth(req);
  const { productId } = await req.json();
  
  await addToWishlist(user.id, productId);
  return { success: true };
}
```

## Security Best Practices

### Input Validation

```typescript
// Validation schemas using Zod
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000),
  price: z.number().positive(),
  category_id: z.string().uuid(),
  brand_id: z.string().uuid().optional(),
  stock_quantity: z.number().int().min(0),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional()
});

export const orderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive()
  })).min(1),
  shipping_address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string()
  }),
  payment_method: z.enum(['razorpay', 'cod'])
});

// Validate input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}
```

### Rate Limiting

```typescript
// Rate limiting implementation
const rateLimitStore = new Map();

export function rateLimit(
  identifier: string,
  maxRequests: number = 60,
  windowMs: number = 60000 // 1 minute
) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get or create rate limit entry
  let requests = rateLimitStore.get(identifier) || [];
  
  // Filter out old requests
  requests = requests.filter(timestamp => timestamp > windowStart);
  
  if (requests.length >= maxRequests) {
    throw new Error('Rate limit exceeded');
  }
  
  // Add current request
  requests.push(now);
  rateLimitStore.set(identifier, requests);
  
  return {
    remaining: maxRequests - requests.length,
    reset: new Date(windowStart + windowMs)
  };
}

// Apply rate limiting to API endpoints
export async function apiMiddleware(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    const { remaining, reset } = rateLimit(`api:${ip}`, 100, 60000);
    
    // Set rate limit headers
    return new Response(null, {
      headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toISOString()
      }
    });
  } catch (error) {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

### XSS & CSRF Protection

```typescript
// XSS Protection
export function sanitizeHtml(html: string): string {
  // Use DOMPurify or similar library
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  });
}

// CSRF Protection
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// Content Security Policy
export const cspHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://api.razorpay.com",
    "frame-src https://checkout.razorpay.com"
  ].join('; ')
};
```

## Performance Optimization

### Caching Strategy

```typescript
// Redis caching implementation
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function cacheGet<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheSet(
  key: string, 
  value: any, 
  ttl: number = 3600 // 1 hour default
) {
  await redis.setex(key, ttl, JSON.stringify(value));
}

export async function cacheDelete(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// Cache product data
export async function getCachedProduct(id: string) {
  const cacheKey = `product:${id}`;
  
  // Check cache first
  let product = await cacheGet(cacheKey);
  
  if (!product) {
    // Fetch from database
    product = await getProduct(id);
    
    // Cache for 1 hour
    await cacheSet(cacheKey, product, 3600);
  }
  
  return product;
}

// Invalidate cache on update
export async function updateProductWithCache(id: string, updates: any) {
  const result = await updateProduct(id, updates);
  
  // Clear related caches
  await cacheDelete(`product:${id}`);
  await cacheDelete(`products:*`);
  
  return result;
}
```

### Query Optimization

```sql
-- Materialized view for product statistics
CREATE MATERIALIZED VIEW product_stats AS
SELECT 
  p.id,
  p.name,
  COUNT(DISTINCT o.id) as order_count,
  SUM(oi.quantity) as total_sold,
  AVG(pr.rating) as avg_rating,
  COUNT(pr.id) as review_count
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('confirmed', 'shipped', 'delivered')
LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = true
GROUP BY p.id, p.name;

-- Refresh materialized view periodically
CREATE OR REPLACE FUNCTION refresh_product_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_stats;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (using pg_cron or external scheduler)
SELECT cron.schedule('refresh-product-stats', '0 */6 * * *', 'SELECT refresh_product_stats();');
```

### CDN Configuration

```typescript
// CDN URL configuration
export const CDN_CONFIG = {
  baseUrl: process.env.CDN_URL || 'https://cdn.manglasports.com',
  imageTransforms: {
    thumbnail: 'w=200,h=200,fit=cover',
    product: 'w=800,h=800,fit=contain',
    hero: 'w=1920,h=600,fit=cover',
    mobile: 'w=400,h=400,fit=contain'
  }
};

// Get optimized image URL
export function getImageUrl(
  path: string, 
  transform: keyof typeof CDN_CONFIG.imageTransforms = 'product'
) {
  if (!path) return '/placeholder.jpg';
  
  // If already a full URL, return as is
  if (path.startsWith('http')) return path;
  
  // Construct CDN URL with transformations
  const params = CDN_CONFIG.imageTransforms[transform];
  return `${CDN_CONFIG.baseUrl}/${path}?${params}`;
}

// Preload critical images
export function preloadImages(images: string[]) {
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getImageUrl(src);
    document.head.appendChild(link);
  });
}
```

## Testing Guidelines

### Unit Testing

```typescript
// Example unit test for product service
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getProduct, updateProduct } from '../services/products';

describe('Product Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('getProduct', () => {
    it('should return product by id', async () => {
      const mockProduct = {
        id: '123',
        name: 'Test Product',
        price: 100
      };
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockProduct })
          })
        })
      });
      
      const result = await getProduct('123');
      expect(result).toEqual(mockProduct);
    });
    
    it('should throw error if product not found', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ error: new Error('Not found') })
          })
        })
      });
      
      await expect(getProduct('999')).rejects.toThrow('Not found');
    });
  });
});
```

### Integration Testing

```typescript
// Integration test for order flow
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createOrder, getOrder } from '../services/orders';
import { setupTestDatabase, cleanupTestDatabase } from '../test/helpers';

describe('Order Flow Integration', () => {
  let testUser;
  
  beforeAll(async () => {
    await setupTestDatabase();
    testUser = await createTestUser();
  });
  
  afterAll(async () => {
    await cleanupTestDatabase();
  });
  
  it('should create order and update inventory', async () => {
    // Create test products
    const product = await createTestProduct({
      name: 'Test Product',
      price: 100,
      stock_quantity: 10
    });
    
    // Create order
    const orderData = {
      user_id: testUser.id,
      items: [{
        product_id: product.id,
        quantity: 2,
        price: 100
      }],
      total_amount: 200,
      shipping_address: testAddress
    };
    
    const order = await createOrder(orderData);
    
    // Verify order created
    expect(order).toHaveProperty('order_number');
    expect(order.status).toBe('pending');
    
    // Verify inventory updated
    const updatedProduct = await getProduct(product.id);
    expect(updatedProduct.stock_quantity).toBe(8);
    
    // Verify inventory log created
    const logs = await getInventoryLogs(product.id);
    expect(logs).toHaveLength(1);
    expect(logs[0].quantity_change).toBe(-2);
  });
});
```

### E2E Testing

```typescript
// E2E test with Playwright
import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('should complete purchase from product page to order confirmation', async ({ page }) => {
    // Navigate to product page
    await page.goto('/products/walther-lg500');
    
    // Add to cart
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('.toast')).toContainText('Added to cart');
    
    // Go to cart
    await page.click('[aria-label="Cart"]');
    await page.click('text=View Cart & Checkout');
    
    // Proceed to checkout
    await page.click('button:has-text("Proceed to Checkout")');
    
    // Fill shipping details
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="firstName"]', 'Test');
    await page.fill('[name="lastName"]', 'User');
    await page.fill('[name="address"]', '123 Test St');
    await page.fill('[name="city"]', 'Test City');
    await page.fill('[name="postalCode"]', '12345');
    
    // Complete payment (mocked in test environment)
    await page.click('button:has-text("Pay Now")');
    
    // Verify order confirmation
    await expect(page).toHaveURL(/\/order-confirmation/);
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });
});
```

## Deployment & DevOps

### Environment Configuration

```bash
# .env.production
NODE_ENV=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
REDIS_URL=redis://your-redis-url
SENDGRID_API_KEY=your-sendgrid-key
SENTRY_DSN=your-sentry-dsn
CDN_URL=https://cdn.manglasports.com
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run E2E tests
        run: npm run test:e2e
        
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Monitoring & Logging

```typescript
// Sentry error tracking
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

// Custom error boundary
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}

// Application metrics
export function trackMetric(name: string, value: number, tags?: Record<string, string>) {
  // Send to monitoring service
  if (window.analytics) {
    window.analytics.track(name, {
      value,
      ...tags
    });
  }
}

// Performance monitoring
export function measurePerformance() {
  if ('performance' in window) {
    const perfData = window.performance.getEntriesByType('navigation')[0];
    
    trackMetric('page_load_time', perfData.loadEventEnd - perfData.fetchStart);
    trackMetric('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.fetchStart);
    trackMetric('first_paint', perfData.responseEnd - perfData.fetchStart);
  }
}
```

### Backup & Recovery

```sql
-- Automated backup script
CREATE OR REPLACE FUNCTION backup_critical_data()
RETURNS void AS $$
DECLARE
  backup_date TEXT := TO_CHAR(NOW(), 'YYYY-MM-DD');
BEGIN
  -- Backup orders
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS orders_backup_%s AS 
    SELECT * FROM orders WHERE created_at >= NOW() - INTERVAL ''7 days''
  ', backup_date);
  
  -- Backup inventory snapshots
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS inventory_snapshot_%s AS 
    SELECT * FROM products
  ', backup_date);
  
  -- Log backup completion
  INSERT INTO backup_logs (backup_type, backup_date, status)
  VALUES ('daily', NOW(), 'completed');
END;
$$ LANGUAGE plpgsql;

-- Schedule daily backups
SELECT cron.schedule('daily-backup', '0 2 * * *', 'SELECT backup_critical_data();');
```

## Migration Strategy

### Mock Data Migration

```typescript
// Migration script to import existing mock data
import { products as mockProducts } from '../src/data/products';
import { supabase } from '../src/lib/supabase';

export async function migrateMockData() {
  console.log('Starting mock data migration...');
  
  // 1. Create categories
  const categories = [...new Set(mockProducts.map(p => p.category))];
  
  for (const categoryName of categories) {
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    
    const { error } = await supabase
      .from('categories')
      .upsert({
        name: categoryName,
        slug: slug
      }, {
        onConflict: 'slug'
      });
      
    if (error) console.error(`Error creating category ${categoryName}:`, error);
  }
  
  // 2. Create brands
  const brands = [...new Set(mockProducts.map(p => p.brand))];
  
  for (const brandName of brands) {
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    
    const { error } = await supabase
      .from('brands')
      .upsert({
        name: brandName,
        slug: slug
      }, {
        onConflict: 'slug'
      });
      
    if (error) console.error(`Error creating brand ${brandName}:`, error);
  }
  
  // 3. Get category and brand mappings
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name');
    
  const { data: brandsData } = await supabase
    .from('brands')
    .select('id, name');
    
  const categoryMap = new Map(categoriesData?.map(c => [c.name, c.id]));
  const brandMap = new Map(brandsData?.map(b => [b.name, b.id]));
  
  // 4. Migrate products
  for (const product of mockProducts) {
    const productData = {
      name: product.name,
      slug: product.id,
      price: product.numericPrice,
      numeric_price: product.numericPrice,
      original_price: product.originalPrice,
      category_id: categoryMap.get(product.category),
      brand_id: brandMap.get(product.brand),
      in_stock: product.inStock,
      stock_quantity: product.inStock ? 100 : 0, // Default stock
      is_new_arrival: product.isNew || false,
      is_best_seller: product.soldCount > 50,
      is_hot: product.isHot || false,
      rating: product.rating,
      review_count: product.reviewCount || 0,
      sold_count: product.soldCount || 0,
      image_url: product.image,
      short_description: product.shortDescription,
      features: product.features || [],
      specifications: product.specifications || {}
    };
    
    const { error } = await supabase
      .from('products')
      .upsert(productData, {
        onConflict: 'slug'
      });
      
    if (error) console.error(`Error migrating product ${product.name}:`, error);
  }
  
  console.log('Mock data migration completed!');
}

// Run migration
migrateMockData().catch(console.error);
```

### Production Checklist

```markdown
## Pre-Deployment Checklist

### Database
- [ ] All migrations run successfully
- [ ] RLS policies tested and verified
- [ ] Indexes created for performance
- [ ] Backup procedures in place
- [ ] Mock data migrated successfully

### Security
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] XSS/CSRF protection enabled

### Performance
- [ ] Images optimized and using CDN
- [ ] Caching strategy implemented
- [ ] Database queries optimized
- [ ] Bundle size analyzed and optimized
- [ ] Lazy loading implemented

### Testing
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Load testing completed
- [ ] Security audit completed

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Log aggregation setup

### Business Logic
- [ ] Payment gateway tested in production mode
- [ ] Email notifications tested
- [ ] Order flow verified end-to-end
- [ ] Inventory management tested
- [ ] Admin functions verified

### Legal & Compliance
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Cookie consent implemented
- [ ] GDPR compliance verified
- [ ] Payment compliance (PCI DSS)

### Documentation
- [ ] API documentation complete
- [ ] Admin guide created
- [ ] Deployment guide updated
- [ ] Troubleshooting guide ready
- [ ] Customer support docs ready
```

## Development Guidelines

### Local Development

To set up the project for local development:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd manglasportswebsite
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with the following variables:
   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-key>
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Code Standards

```typescript
// TypeScript configuration standards
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// Code style guidelines
- Use functional components with TypeScript
- Implement proper error boundaries
- Use custom hooks for reusable logic
- Follow naming conventions:
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Types/Interfaces: PascalCase with 'I' or 'T' prefix
  
// Example component structure
interface IProductCardProps {
  product: IProduct;
  onAddToCart?: (product: IProduct) => void;
  className?: string;
}

export const ProductCard: React.FC<IProductCardProps> = ({ 
  product, 
  onAddToCart,
  className 
}) => {
  // Component logic
};
```

## Troubleshooting

### Common Issues and Solutions

1. **Database Connection Issues**
   - Verify environment variables are correctly set
   - Check Supabase project status/health
   - Ensure API keys have correct permissions

2. **Authentication Problems**
   - Clear browser cache/cookies
   - Verify correct email confirmation flow
   - Check RLS policies for correct access control

3. **Inventory Discrepancies**
   - Review inventory_logs for unexpected changes
   - Check for race conditions in concurrent stock updates
   - Verify order processing functions for correct stock adjustment

### Deployment Issues

- Ensure all environment variables are set in production environment
- Verify build process includes correct API endpoints
- Check CORS configuration in Supabase project settings

### Development Tips

- Use Supabase's local development environment for testing
- Set up database backups before major schema changes
- Use database migrations for schema changes in production

### Stock Status Indicators

Stock status in the Supabase implementation is managed through the following fields in the `products` table:

- `in_stock`: Boolean flag (true/false) indicating overall availability
- `stock_quantity`: Integer representing the exact quantity available

For advanced stock management, consider the following structure:

```typescript
type StockManagement = {
  inStock: boolean;         // Available for purchase
  quantity: number;         // Current inventory count
  lowStockThreshold: number; // When to show "Low Stock"
  backorderAllowed: boolean; // Allow orders when out of stock
  expectedRestockDate: Date; // When new inventory is expected
};
```

### Stock Status Display

Your UI should reflect these stock states:

- **In Stock** (green): When `in_stock: true` and `stock_quantity > low_stock_threshold`
- **Low Stock** (orange): When `in_stock: true` and `stock_quantity <= low_stock_threshold`
- **Out of Stock** (red): When `in_stock: false` or `stock_quantity = 0`
- **Backorder** (blue): When `backorder_allowed: true` and `stock_quantity = 0`

## 10. Future Enhancements

1. **Advanced Search**: 
   - Implement fuzzy search using PostgreSQL's pg_trgm
   - Add search filters and facets
   - Search suggestions with typo correction

2. **Product Variants**: 
   - Support for sizes, colors, and other variations
   - Variant-specific pricing and inventory
   - Variant image galleries

3. **Advanced Analytics**: 
   - Customer behavior tracking
   - Conversion funnel analysis
   - A/B testing framework
   - Revenue forecasting

4. **Wishlist Sharing**: 
   - Public wishlist URLs
   - Social media integration
   - Gift registry features

5. **Subscription Model**: 
   - Recurring orders
   - Subscription management
   - Automated billing

6. **Multi-currency Support**: 
   - Currency conversion
   - Geo-based pricing
   - Payment method localization

7. **Localization**: 
   - Multi-language support
   - RTL language support
   - Localized content management

8. **Advanced Inventory**: 
   - Serial number tracking
   - Batch management
   - Supplier integration
   - Automated reordering

9. **Customer Loyalty Program**:
   - Points system
   - Tier-based rewards
   - Referral program

10. **AI/ML Features**:
    - Product recommendations
    - Demand forecasting
    - Dynamic pricing
    - Customer segmentation

## Real-time Features

### WebSocket Implementation

```typescript
// Real-time inventory updates
export function setupRealtimeSubscriptions() {
  // Subscribe to inventory changes
  const inventoryChannel = supabase
    .channel('inventory-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
        filter: 'stock_quantity=lt.10'
      },
      (payload) => {
        // Notify admin of low stock
        console.log('Low stock alert:', payload.new);
        notifyLowStock(payload.new);
      }
    )
    .subscribe();

  // Real-time order notifications for admin
  const orderChannel = supabase
    .channel('new-orders')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        // Notify admin of new order
        console.log('New order:', payload.new);
        notifyNewOrder(payload.new);
      }
    )
    .subscribe();

  // Live chat support
  const chatChannel = supabase
    .channel('support-chat')
    .on('broadcast', { event: 'message' }, (payload) => {
      console.log('New message:', payload);
      handleChatMessage(payload);
    })
    .subscribe();

  return () => {
    supabase.removeAllChannels();
  };
}

// Presence tracking for live users
export function trackUserPresence(userId: string) {
  const channel = supabase.channel('online-users');
  
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      console.log('Online users:', state);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('User joined:', key, newPresences);
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('User left:', key, leftPresences);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString()
        });
      }
    });
}
```

## Advanced Error Handling

### Global Error Handler

```typescript
// Centralized error handling
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Error types
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  INVENTORY_ERROR: 'INVENTORY_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
};

// Global error handler middleware
export async function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let appError: AppError;
  
  if (error instanceof AppError) {
    appError = error;
  } else {
    // Convert unknown errors
    appError = new AppError(
      'An unexpected error occurred',
      'INTERNAL_ERROR',
      500,
      false
    );
  }
  
  // Log error
  console.error('Error:', {
    message: appError.message,
    code: appError.code,
    statusCode: appError.statusCode,
    stack: appError.stack,
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      user: req.user?.id
    }
  });
  
  // Send to monitoring service
  if (!appError.isOperational) {
    Sentry.captureException(error, {
      tags: {
        error_code: appError.code,
        user_id: req.user?.id
      }
    });
  }
  
  // Send response
  res.status(appError.statusCode).json({
    error: {
      message: appError.message,
      code: appError.code,
      ...(process.env.NODE_ENV === 'development' && {
        stack: appError.stack
      })
    }
  });
}

// Async error wrapper
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

### Recovery Strategies

```typescript
// Retry logic for failed operations
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries: number;
    delay: number;
    backoff: number;
    onRetry?: (error: Error, attempt: number) => void;
  }
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === options.maxRetries) {
        throw lastError;
      }
      
      if (options.onRetry) {
        options.onRetry(lastError, attempt);
      }
      
      // Exponential backoff
      const waitTime = options.delay * Math.pow(options.backoff, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
}

// Circuit breaker pattern
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold: number,
    private timeout: number
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime! > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new AppError(
          'Service temporarily unavailable',
          'CIRCUIT_BREAKER_OPEN',
          503
        );
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

## Performance Profiling

### Database Query Analysis

```typescript
// Query performance monitoring
export async function profileQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await queryFn();
    const duration = performance.now() - startTime;
    
    // Log slow queries
    if (duration > 1000) {
      console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
      
      // Track in monitoring
      trackMetric('slow_query', duration, {
        query_name: queryName
      });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // Track failed queries
    trackMetric('query_error', 1, {
      query_name: queryName,
      error: error.message,
      duration: duration.toString()
    });
    
    throw error;
  }
}

// Database connection pool monitoring
export function monitorConnectionPool() {
  setInterval(() => {
    const stats = getPoolStats(); // Implementation depends on DB client
    
    trackMetric('db_pool_size', stats.totalConnections);
    trackMetric('db_pool_idle', stats.idleConnections);
    trackMetric('db_pool_waiting', stats.waitingClients);
  }, 60000); // Every minute
}
```

### Memory Leak Detection

```typescript
// Memory monitoring
export class MemoryMonitor {
  private baseline: number | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  
  start() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      this.baseline = (performance as any).memory.usedJSHeapSize;
      
      this.checkInterval = setInterval(() => {
        const current = (performance as any).memory.usedJSHeapSize;
        const increase = current - this.baseline!;
        
        // Alert if memory increased by more than 50MB
        if (increase > 50 * 1024 * 1024) {
          console.warn(`Memory increase detected: ${(increase / 1024 / 1024).toFixed(2)}MB`);
          
          trackMetric('memory_leak_warning', increase, {
            baseline: this.baseline!.toString(),
            current: current.toString()
          });
        }
      }, 300000); // Every 5 minutes
    }
  }
  
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Component render tracking
export function useRenderTracking(componentName: string) {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  
  useEffect(() => {
    renderCount.current++;
    const renderTime = performance.now();
    renderTimes.current.push(renderTime);
    
    // Keep only last 10 render times
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }
    
    // Check for excessive re-renders
    if (renderTimes.current.length === 10) {
      const timeSpan = renderTime - renderTimes.current[0];
      if (timeSpan < 1000) { // 10 renders in less than 1 second
        console.warn(`Excessive re-renders detected in ${componentName}`);
      }
    }
  });
  
  return renderCount.current;
}
```

## Additional Deployment Considerations

### Blue-Green Deployment

```yaml
# Blue-green deployment configuration
version: '3.8'

services:
  app-blue:
    image: manglasports:${BLUE_VERSION}
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      
  app-green:
    image: manglasports:${GREEN_VERSION}
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - app-blue
      - app-green
```

### Health Check Endpoints

```typescript
// Health check implementation
export async function healthCheck(req: Request, res: Response) {
  const checks = {
    server: 'ok',
    database: 'checking',
    redis: 'checking',
    storage: 'checking'
  };
  
  // Check database
  try {
    await supabase.from('products').select('id').limit(1);
    checks.database = 'ok';
  } catch (error) {
    checks.database = 'error';
  }
  
  // Check Redis
  try {
    await redis.ping();
    checks.redis = 'ok';
  } catch (error) {
    checks.redis = 'error';
  }
  
  // Check storage
  try {
    const { data } = await supabase.storage.from('products').list('', { limit: 1 });
    checks.storage = 'ok';
  } catch (error) {
    checks.storage = 'error';
  }
  
  const allHealthy = Object.values(checks).every(status => status === 'ok');
  const statusCode = allHealthy ? 200 : 503;
  
  res.status(statusCode).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  });
}

// Readiness check
export async function readinessCheck(req: Request, res: Response) {
  // Check if app is ready to receive traffic
  const isReady = await checkAppReadiness();
  
  if (isReady) {
    res.status(200).json({ ready: true });
  } else {
    res.status(503).json({ ready: false });
  }
}
```

### Rollback Strategy

```bash
#!/bin/bash
# Rollback script

CURRENT_VERSION=$1
ROLLBACK_VERSION=$2

echo "Starting rollback from $CURRENT_VERSION to $ROLLBACK_VERSION"

# 1. Create database backup before rollback
pg_dump $DATABASE_URL > "backup_before_rollback_$(date +%Y%m%d_%H%M%S).sql"

# 2. Switch traffic to maintenance mode
kubectl set image deployment/frontend frontend=manglasports:maintenance

# 3. Scale down current version
kubectl scale deployment/frontend --replicas=0

# 4. Deploy previous version
kubectl set image deployment/frontend frontend=manglasports:$ROLLBACK_VERSION

# 5. Wait for deployment
kubectl rollout status deployment/frontend

# 6. Run health checks
./scripts/health_check.sh

# 7. If healthy, scale up
if [ $? -eq 0 ]; then
  kubectl scale deployment/frontend --replicas=3
  echo "Rollback successful"
else
  echo "Rollback failed, check logs"
  exit 1
fi
```

### Cost Optimization

```typescript
// Serverless function for image optimization
export async function optimizeImage(event: any) {
  const { bucket, key } = event.Records[0].s3;
  
  // Download original image
  const originalImage = await s3.getObject({ Bucket: bucket, Key: key }).promise();
  
  // Generate optimized versions
  const sizes = [
    { width: 200, height: 200, suffix: '_thumb' },
    { width: 800, height: 800, suffix: '_medium' },
    { width: 1920, height: 1080, suffix: '_large' }
  ];
  
  for (const size of sizes) {
    const optimized = await sharp(originalImage.Body)
      .resize(size.width, size.height, { fit: 'inside' })
      .webp({ quality: 85 })
      .toBuffer();
      
    await s3.putObject({
      Bucket: bucket,
      Key: key.replace(/\.[^.]+$/, `${size.suffix}.webp`),
      Body: optimized,
      ContentType: 'image/webp',
      CacheControl: 'max-age=31536000'
    }).promise();
  }
  
  // Delete original if configured
  if (process.env.DELETE_ORIGINALS === 'true') {
    await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
  }
}

// Database query caching
export function enableQueryResultCache() {
  // PostgreSQL query result cache
  const cacheConfig = {
    statement_timeout: '30s',
    idle_in_transaction_session_timeout: '30s',
    default_statistics_target: 100,
    random_page_cost: 1.1,
    effective_cache_size: '4GB',
    work_mem: '16MB',
    maintenance_work_mem: '256MB'
  };
  
  return cacheConfig;
}
```

## Conclusion

This comprehensive developer guide covers all aspects of building, deploying, and maintaining the Mangla Sports e-commerce platform. Regular updates to this documentation ensure that new team members can quickly understand the system architecture and contribute effectively to the project.

For the latest updates and additional resources, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

Remember to always test thoroughly in development before deploying to production, and maintain regular backups of all critical data.
