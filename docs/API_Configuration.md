# API Configuration Guide

## Overview
This project now uses a centralized API configuration system that makes it easy to manage API endpoints and base URLs across different environments.

## Environment Variables

### 1. Create Environment Files
Create a `.env.local` file in your project root (this file is gitignored by default):

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:4000/api
```

### 2. Environment File Structure
- `.env.local` - Local development (gitignored)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `env.example` - Template for other developers

## Usage

### Import the Configuration
```typescript
import { API_CONFIG, buildApiUrl, buildApiUrlWithParams } from '@/config/api';
```

### Basic Usage
```typescript
// Instead of hardcoding URLs like this:
fetch('http://localhost:4000/api/products')

// Use the configuration like this:
fetch(buildApiUrl(API_CONFIG.PRODUCTS.BASE))
```

### With Parameters
```typescript
// Instead of:
fetch(`http://localhost:4000/api/products?category=sports&limit=10`)

// Use:
fetch(buildApiUrlWithParams(API_CONFIG.PRODUCTS.BASE, { 
  category: 'sports', 
  limit: '10' 
}))
```

### Dynamic Endpoints
```typescript
// Instead of:
fetch(`http://localhost:4000/api/products/${productId}`)

// Use:
fetch(buildApiUrl(API_CONFIG.PRODUCTS.BY_ID(productId)))
```

## Available Endpoints

### Authentication
```typescript
API_CONFIG.AUTH.LOGIN                    // /auth/login
API_CONFIG.AUTH.SIGNUP                   // /auth/signup
API_CONFIG.AUTH.VERIFY_EMAIL             // /auth/verify-email
API_CONFIG.AUTH.FORGOT_PASSWORD          // /auth/forgot-password
API_CONFIG.AUTH.RESET_PASSWORD           // /auth/reset-password
API_CONFIG.AUTH.VERIFY_ROLE              // /auth/verify-role
API_CONFIG.AUTH.RESEND_VERIFICATION      // /auth/resend-verification
```

### Products
```typescript
API_CONFIG.PRODUCTS.BASE                 // /products
API_CONFIG.PRODUCTS.BY_ID(id)            // /products/{id}
API_CONFIG.PRODUCTS.DELETE_IMAGE(publicId) // /products/delete-image/{publicId}
```

### Cart
```typescript
API_CONFIG.CART.BASE                     // /cart
API_CONFIG.CART.BY_ID(id)                // /cart/{id}
```

### Wishlist
```typescript
API_CONFIG.WISHLIST.BASE                 // /wishlist
API_CONFIG.WISHLIST.BY_ID(id)            // /wishlist/{id}
```

### Orders
```typescript
API_CONFIG.ORDERS.BASE                   // /orders
API_CONFIG.ORDERS.USER_ORDERS            // /orders/user
API_CONFIG.ORDERS.ITEMS(itemId)          // /orders/items/{itemId}
API_CONFIG.ORDERS.ITEMS_WITH_EMAIL(itemId) // /orders/items/{itemId}/with-email
```

### Reviews
```typescript
API_CONFIG.REVIEWS.PRODUCT(productId)    // /reviews/product/{productId}
API_CONFIG.REVIEWS.USER_REVIEW(productId) // /reviews/product/{productId}/user
API_CONFIG.REVIEWS.CAN_REVIEW(productId)  // /reviews/product/{productId}/can-review
```

### Admin Reviews
```typescript
API_CONFIG.REVIEWS.ADMIN_ALL             // /reviews/admin/all
API_CONFIG.REVIEWS.ADMIN_BY_ID(id)      // /reviews/admin/{id}
```

### Blog
```typescript
API_CONFIG.BLOG.POSTS                    // /blog/posts
API_CONFIG.BLOG.POST_BY_SLUG(slug)      // /blog/posts/{slug}
API_CONFIG.BLOG.UPLOAD                   // /blog/upload
```

### Events
```typescript
API_CONFIG.EVENTS.BASE                   // /events
API_CONFIG.EVENTS.BY_SLUG(slug)         // /events/{slug}
API_CONFIG.EVENTS.ADMIN_ALL              // /events/admin/all
```

### Categories & Brands
```typescript
API_CONFIG.CATEGORIES.BASE               // /categories
API_CONFIG.CATEGORIES.BY_ID(id)          // /categories/{id}

API_CONFIG.BRANDS.BASE                   // /brands
API_CONFIG.BRANDS.BY_ID(id)              // /brands/{id}
```

### Payment
```typescript
API_CONFIG.PAYMENT.ORDER                 // /payment/order
API_CONFIG.PAYMENT.VERIFY                // /payment/verify
```

### Users
```typescript
API_CONFIG.USERS.BASE                    // /users
API_CONFIG.USERS.BY_ID(id)               // /users/{id}
API_CONFIG.USERS.CHANGE_PASSWORD(id)     // /users/{id}/change-password
API_CONFIG.USERS.ADMIN_STATS             // /users/admin/stats
```

## Migration Guide

### Before (Old Way)
```typescript
const API_BASE = 'http://localhost:4000/api/cart';

// Hardcoded URLs everywhere
fetch(`${API_BASE}?userId=${user.id}`)
fetch(`${API_BASE}/${productId}`)
fetch('http://localhost:4000/api/products')
```

### After (New Way)
```typescript
import { API_CONFIG, buildApiUrl, buildApiUrlWithParams } from '@/config/api';

// Centralized configuration
fetch(buildApiUrlWithParams(API_CONFIG.CART.BASE, { userId: user.id.toString() }))
fetch(buildApiUrl(API_CONFIG.CART.BY_ID(productId)))
fetch(buildApiUrl(API_CONFIG.PRODUCTS.BASE))
```

## Benefits

1. **Environment Management**: Easy to switch between dev, staging, and production
2. **Centralized Configuration**: All API endpoints in one place
3. **Type Safety**: TypeScript support for all endpoints
4. **Maintainability**: Change base URL once, updates everywhere
5. **Consistency**: Standardized way to build URLs across the app
6. **Parameter Handling**: Built-in support for query parameters and path variables

## Adding New Endpoints

To add a new endpoint, simply add it to the `API_CONFIG` object in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  // ... existing config
  
  NEW_SERVICE: {
    BASE: '/new-service',
    BY_ID: (id: string) => `/new-service/${id}`,
    CUSTOM: (param: string) => `/new-service/custom/${param}`,
  },
  
  // ... rest of config
};
```

## Troubleshooting

### Environment Variable Not Working?
1. Make sure your `.env.local` file is in the project root
2. Restart your development server after adding environment variables
3. Check that the variable name starts with `VITE_`
4. Verify the file is not gitignored

### TypeScript Errors?
1. Make sure you're importing from `@/config/api`
2. Check that the path alias `@` is properly configured in your `tsconfig.json`
3. Restart your TypeScript language server 