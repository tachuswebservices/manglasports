# API Endpoints

## Products
- `GET /api/products` — List all products (supports filters)
- `GET /api/products/:id` — Get product by ID
- `POST /api/products` — Create product
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product

## Categories
- `GET /api/categories` — List all categories
- `GET /api/categories/:id` — Get category by ID
- `POST /api/categories` — Create category
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category

## Brands
- `GET /api/brands` — List all brands
- `GET /api/brands/:id` — Get brand by ID
- `POST /api/brands` — Create brand
- `PUT /api/brands/:id` — Update brand
- `DELETE /api/brands/:id` — Delete brand

## Cart
- `GET /api/cart?userId=...` — Get cart for user
- `POST /api/cart` — Add/update item in cart
- `DELETE /api/cart/:id` — Remove item from cart
- `DELETE /api/cart` — Clear cart for user

## Wishlist
- `GET /api/wishlist?userId=...` — Get wishlist for user
- `POST /api/wishlist` — Add item to wishlist
- `DELETE /api/wishlist/:id` — Remove item from wishlist
- `DELETE /api/wishlist` — Clear wishlist for user

## Orders
- `GET /api/orders?userId=...` — List orders for user
- `GET /api/orders/:id` — Get order by ID
- `POST /api/orders` — Create order
- `PUT /api/orders/items/:id` — Update order item status (basic update)
- `PUT /api/orders/items/:id/with-email` — Update order item status with email confirmation for shipped/delivered/rejected statuses

## Reviews
- `GET /api/reviews/product/:productId` — Get reviews for a product
- `GET /api/reviews/product/:productId/user` — Get user's review for a product (authenticated)
- `GET /api/reviews/product/:productId/can-review` — Check if user can review a product (authenticated)
- `POST /api/reviews/product/:productId` — Create review for a product (authenticated)
- `PUT /api/reviews/product/:productId` — Update user's review for a product (authenticated)
- `DELETE /api/reviews/product/:productId` — Delete user's review for a product (authenticated)

### Admin Review Management
- `GET /api/reviews/admin/all` — List all reviews with pagination and search (admin only)
- `PUT /api/reviews/admin/:id` — Update any review by ID (admin only)
- `DELETE /api/reviews/admin/:id` — Delete any review by ID (admin only)

## Users
- `GET /api/users` — List all users
- `GET /api/users/:id` — Get user by ID
- `POST /api/users` — Create user
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user 