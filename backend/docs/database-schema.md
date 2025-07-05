# Database Schema

The backend uses Prisma ORM. Here are the main models:

## User
- `id` (Int, PK)
- `email` (String, unique)
- `password` (String)
- `name` (String)
- `orders` (Order[])
- `cart` (Cart[])
- `wishlist` (Wishlist[])

## Product
- `id` (String, PK)
- `name` (String)
- `price` (String)
- `numericPrice` (Int)
- `originalPrice` (Int?)
- `image` (String)
- `categoryId` (FK to Category)
- `brandId` (FK to Brand)
- `rating` (Float)
- `reviewCount` (Int?)
- `soldCount` (Int?)
- `inStock` (Bool)
- `isNew` (Bool?)
- `isHot` (Bool?)
- `shortDescription` (String?)
- `features` (Feature[])
- `specifications` (Specification[])

## Category
- `id` (Int, PK)
- `name` (String, unique)
- `products` (Product[])

## Brand
- `id` (Int, PK)
- `name` (String, unique)
- `products` (Product[])

## Order
- `id` (Int, PK)
- `userId` (FK to User)
- `items` (OrderItem[])
- `createdAt` (DateTime)

## Cart
- `userId` (FK to User)
- `productId` (FK to Product)
- `quantity` (Int)

## Wishlist
- `userId` (FK to User)
- `productId` (FK to Product)

## Feature
- `id` (Int, PK)
- `productId` (FK to Product)
- `value` (String)

## Specification
- `id` (Int, PK)
- `productId` (FK to Product)
- `key` (String)
- `value` (String) 