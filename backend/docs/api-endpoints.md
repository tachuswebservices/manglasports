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

## Users
- `GET /api/users` — List all users
- `GET /api/users/:id` — Get user by ID
- `POST /api/users` — Create user
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user 