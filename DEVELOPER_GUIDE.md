# Mangla Sports - Developer Guide

## Table of Contents
1. [Database Structure](#database-structure)
2. [Product Management](#product-management)
   - [Product Categories](#product-categories)
   - [Product Data Structure](#product-data-structure)
   - [Managing New Arrivals & Best Sellers](#managing-new-arrivals--best-sellers)
   - [Product Tags and Badges](#product-tags-and-badges)
3. [Inventory Management](#inventory-management)
   - [Stock Tracking](#stock-tracking)
   - [Online/Offline Sales Integration](#onlineoffline-sales-integration)
   - [Inventory Logs](#inventory-logs)
4. [User Authentication](#user-authentication)
   - [Role-Based Access Control](#role-based-access-control)
   - [Customer Accounts](#customer-accounts)
   - [Admin Accounts](#admin-accounts)
5. [Order Processing](#order-processing)
   - [Order Structure](#order-structure)
   - [Order Status Flow](#order-status-flow)
   - [Payment Processing](#payment-processing)
6. [Admin Interface](#admin-interface)
   - [Product Management](#admin-product-management)
   - [Inventory Updates](#admin-inventory-updates)
   - [Order Management](#admin-order-management)
7. [Development Guidelines](#development-guidelines)
   - [Local Development](#local-development)
   - [API Endpoints](#api-endpoints)
   - [Mobile UI Best Practices](#mobile-ui-best-practices)
8. [Troubleshooting](#troubleshooting)

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

#### `inventory_logs` Table
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
```

#### `profiles` Table
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
```

#### `orders` Table
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
```

#### `order_items` Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Indexes

```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_stock ON products(in_stock);
CREATE INDEX idx_products_new_arrival ON products(is_new_arrival);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
```

### Database Triggers

```sql
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

## Product Management

### Product Categories

Product categories are stored in the `categories` table with the following structure:

```typescript
type Category = {
  id: string;          // UUID
  name: string;        // Display name
  slug: string;        // URL-friendly identifier
  description: string; // Optional description
  image_url: string;   // Path to category image
};
```

### Product Data Structure

Products are stored in the `products` table with the following structure:

```typescript
type Product = {
  id: string;           // UUID
  name: string;         // Display name
  slug: string;         // URL-friendly identifier
  description: string;  // Product description
  price: number;        // Price in decimal format
  numericPrice: number; // Price in numeric format
  categoryId: string;   // Foreign key referencing the categories table
  inStock: boolean;     // Stock status
  stockQuantity: number;// Stock quantity
  isNewArrival: boolean;// New arrival status
  isBestSeller: boolean;// Best seller status
  imageUrl: string;     // Path to product image
  additionalImages: string[];// Additional product images
  specifications: object;// Technical specifications
  features: string[];   // Product features
};
```

### Managing New Arrivals & Best Sellers

To feature a product in the New Arrivals or Best Sellers section, update the `isNewArrival` or `isBestSeller` field in the `products` table accordingly.

### Product Tags and Badges

Product tags and badges are used to highlight specific product features or promotions. The following tags and badges are available:

* `isNew: true` - Shows "New" badge
* `isHot: true` - Shows "Bestseller" badge
* `isPremium: true` - Shows "Premium" badge
* `onSale: true` - Shows "Sale" badge (not yet implemented)

To add or modify badges, update the corresponding fields in the `products` table.

## Inventory Management

### Stock Tracking

Inventory stock is tracked in the `products` table with the following key fields:

- `stock_quantity`: The current quantity of the product in stock.
- `in_stock`: Boolean flag indicating if the product is in stock (stock_quantity > 0).

All stock changes are logged in the `inventory_logs` table for auditability.

### Online/Offline Sales Integration

The inventory system is designed to handle both online and offline sales:

1. **Online Sales**: When an order is placed through the website, stock is automatically deducted using database triggers.

2. **Offline Sales**: Store staff can update inventory through the admin interface by:
   - Navigating to the admin inventory page
   - Searching for the product
   - Recording the quantity change and reason (e.g., "In-store sale")
   - Submitting the adjustment

### Inventory Logs

All inventory changes are recorded in the `inventory_logs` table with the following information:

- `product_id`: The product that was affected
- `quantity_change`: The change in quantity (negative for sales, positive for restocking)
- `stock_before`: Stock quantity before the change
- `stock_after`: Stock quantity after the change
- `reason`: Description of why the change occurred
- `type`: Type of change (sale, restock, adjustment)
- `created_by`: The user who made the change
- `created_at`: Timestamp of the change

### API Functions

```typescript
// Update inventory (for admin use or offline sales)
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

## User Authentication

### Role-Based Access Control

The application uses Supabase Auth with role-based access control:

- **Customer**: Regular users who can browse products, place orders, and manage their account.
- **Admin**: Staff members who can manage products, inventory, and orders.

### Customer Accounts

Customer accounts include:

- Basic authentication (email/password)
- Profile information (name, contact details, etc.)
- Address book for shipping
- Order history
- Wishlist management

### Admin Accounts

Admin accounts have additional privileges:

- Product management (add, edit, delete products)
- Inventory management (update stock, view logs)
- Order management (view, update status)
- Customer management (view orders, assist with issues)

### Security Policies

Row-level security policies are used to control access to data:

```sql
-- Example: Customers can only view their own profile
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Example: Admins can view all products
CREATE POLICY "Admins can do anything with products"
  ON products
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );
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
5. **Cancelled**: Order was cancelled (can occur at any step before shipping)

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

## Admin Interface

### Admin Product Management

Admins can manage products through a dedicated admin interface:

1. **List Products**: View all products with filtering and sorting options
2. **Add Product**: Create new products with all required information
3. **Edit Product**: Update product details, images, specifications
4. **Manage Categories**: Add, edit, or remove product categories

### Admin Inventory Updates

The inventory management interface allows:

1. **Stock Updates**: Directly update product stock levels
2. **Bulk Updates**: Upload CSV file for bulk inventory updates
3. **Inventory History**: View complete audit trail of stock changes
4. **Low Stock Alerts**: Configure and view alerts for low stock items

### Admin Order Management

Order management features include:

1. **Order List**: View all orders with filtering by status, date, etc.
2. **Order Details**: View complete order information including items
3. **Status Updates**: Update order status (processing, shipped, etc.)
4. **Customer Communication**: Send order status notifications to customers
5. **Order Search**: Find orders by order ID, customer name, or product

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

### API Endpoints

The following API endpoints are available for interacting with the Supabase backend:

```typescript
// Products
export async function getProducts() {...}
export async function getProductsByCategory(categorySlug) {...}
export async function getProductDetail(slug) {...}
export async function getNewArrivals() {...}
export async function getBestSellers() {...}

// Categories
export async function getCategories() {...}

// Orders
export async function createOrder(orderData) {...}
export async function getOrderHistory(userId) {...}
export async function getOrderDetail(orderId) {...}

// Inventory
export async function updateInventory(productId, quantityChange, reason, type) {...}
```

### Mobile UI Best Practices

When developing UI components, follow these mobile-first principles:

- Use responsive design with Tailwind CSS breakpoints
- Ensure touch targets are at least 44×44 pixels
- Test on multiple device sizes and orientations
- Optimize images for mobile bandwidth
- Implement smooth animations with Framer Motion
- Use lazy loading for off-screen components

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

## 9. Best Practices & Guidelines

### Database Guidelines

1. Use UUIDs for all primary and foreign keys
2. Implement proper indexes for frequently queried fields
3. Use Row-Level Security (RLS) policies to control data access
4. Add database triggers for automated inventory management
5. Set up regular database backups

### Asset Management

1. Store all product images in Supabase Storage with organized buckets
2. Use consistent naming conventions for files
3. Create standardized image sizes for different display contexts
4. Implement proper CDN caching for optimized delivery
5. Use WebP format for optimal compression

### API Development

1. Create well-documented API functions
2. Implement proper error handling and validation
3. Use TypeScript for type safety
4. Follow RESTful conventions for endpoint naming
5. Cache frequently accessed data

## 10. Future Enhancements

1. **Advanced Search**: Implement full-text search using PostgreSQL
2. **Product Variants**: Support for sizes, colors, and other variations
3. **Advanced Analytics**: Customer behavior and sales tracking
4. **Wishlist Sharing**: Allow customers to share wishlists
5. **Subscription Model**: Recurring orders and payments
6. **Multi-currency Support**: Prices in different currencies
7. **Localization**: Multi-language support
8. **Advanced Inventory**: Serial number tracking and batch management
