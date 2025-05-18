# Mangla Sports - Developer Guide

## Table of Contents
1. [Creating a New Category](#1-creating-a-new-category)
2. [Adding New Products](#2-adding-new-products)
3. [Managing New Arrivals](#3-managing-new-arrivals)
4. [Managing Best Sellers](#4-managing-best-sellers)
5. [Product Tags and Badges](#5-product-tags-and-badges)
6. [Product Ratings and Reviews](#6-product-ratings-and-reviews)
7. [Stock Status Management](#7-stock-status-management)

## 1. Creating a New Category

### 1.1 Update Categories List
1. Navigate to `src/data/categories.ts`
2. Add a new category object to the `categories` array:

```typescript
{
  id: 'unique-category-id',  // e.g., 'shooting-jackets'
  name: 'Category Name',      // e.g., 'Shooting Jackets'
  slug: 'category-slug',     // URL-friendly version, e.g., 'shooting-jackets'
  description: 'Brief description of the category',
  image: '/path/to/category-image.jpg'
}
```

### 1.2 Add Category Route
1. Update the navigation in `src/components/layout/Navbar.tsx`
2. Add a new route in `src/App.tsx` if needed

## 2. Adding New Products

### 2.1 Add Product to products.ts
1. Open `src/data/products.ts`
2. Add a new product object to the `products` array:

```typescript
{
  id: 'unique-product-id',           // e.g., 'walther-lg500-itec'
  name: 'Product Full Name',        // e.g., 'Walther LG500 ITEC Triple Edition'
  price: '₹249,999',                // Formatted price string
  numericPrice: 249999,              // Numeric value for calculations
  image: '/path/to/product-image.jpg',
  category: 'Category Name',         // Must match category name in categories.ts
  rating: 4.8,                       // 0-5 rating
  reviewCount: 42,                   // Number of reviews
  soldCount: 25,                     // Number of units sold (for best sellers)
  inStock: true,                    // Boolean for stock status
  isNew: false,                      // Show in New Arrivals
  isHot: false,                      // Show in Best Sellers
  isPremium: false,                  // Premium product badge
  brand: 'Brand Name',               // e.g., 'Walther'
  shortDescription: 'Brief product description',
  // Optional fields
  images: [                          // Additional product images
    '/path/to/image1.jpg',
    '/path/to/image2.jpg'
  ],
  features: [                        // Product features list
    'Feature 1',
    'Feature 2'
  ],
  specifications: {                  // Technical specifications
    'Weight': '4.2 kg',
    'Length': '1200 mm'
  }
}
```

## 3. Managing New Arrivals

To feature a product in the New Arrivals section:
1. Locate the product in `src/data/products.ts`
2. Set `isNew: true`
3. The product will automatically appear in the New Arrivals section

## 4. Managing Best Sellers

To feature a product in the Best Sellers section:
1. Locate the product in `src/data/products.ts`
2. Set `isHot: true`
3. The product will automatically appear in the Best Sellers section

## 5. Product Tags and Badges

### Available Tags:
- `isNew: true` - Shows "New" badge
- `isHot: true` - Shows "Bestseller" badge
- `isPremium: true` - Shows "Premium" badge
- `onSale: true` - Shows "Sale" badge (not yet implemented)

### How to Add/Modify Badges:
1. Open `src/data/products.ts`
2. Find the product
3. Set the appropriate boolean flags:
   ```typescript
   {
     // ... other product fields
     isNew: true,      // For New Arrivals
     isHot: true,      // For Best Sellers
     isPremium: true,  // For Premium badge
     onSale: false     // For Sale badge
   }
   ```

## 6. Product Ratings and Reviews

### Adding Ratings:
1. In `products.ts`, set these properties:
   ```typescript
   {
     // ... other fields
     rating: 4.8,       // Number from 0-5 (can be decimal like 4.5)
     reviewCount: 42    // Total number of reviews
   }
   ```

### Review Structure (if implementing later):
```typescript
reviews: [
  {
    id: 'review-1',
    userId: 'user-123',
    userName: 'John Doe',
    rating: 5,
    date: '2025-05-15',
    title: 'Excellent Product',
    comment: 'Detailed review text...',
    verifiedPurchase: true
  }
]
```

## 7. Stock Status Management

### Stock Indicators:
- `inStock: true/false` - Simple in/out of stock
- For more detailed stock levels:
  ```typescript
  stock: {
    inStock: true,
    quantity: 15,          // Current stock quantity
    lowStockThreshold: 5,  // When to show "Low Stock"
    backorder: false,      // Allow backorders
    expectedRestock: '2025-06-01' // Expected restock date
  }
  ```

### Stock Status Badges:
- In Stock (green) - When `inStock: true`
- Low Stock (orange) - When quantity ≤ lowStockThreshold
- Out of Stock (red) - When `inStock: false`
- Backorder (blue) - When `backorder: true`

## Best Practices
1. Always use unique IDs for products and categories
2. Keep image paths consistent (use `/lovable-uploads/` for uploaded images)
3. Maintain proper image aspect ratios (recommended: 1:1 for products)
4. Update both `price` (formatted) and `numericPrice` (number) fields
5. Keep product descriptions clear and SEO-friendly
6. Use proper alt text for images
7. Keep the `products.ts` file organized by category

## Troubleshooting
- If a product doesn't appear in a category, check:
  - Category name matches exactly in product and categories.ts
  - Product ID is unique
  - All required fields are present
  - No syntax errors in the products.ts file

## Future Enhancements
1. Implement a proper CMS for product management
2. Add bulk import/export functionality
3. Add product variants (sizes, colors)
4. Implement inventory management system
5. Add product search functionality
