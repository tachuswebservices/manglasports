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
- `shippingCharges` (Float?) - Shipping charges for the product
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
- `totalAmount` (Float)
- `status` (String) - Overall order status
- `addressId` (FK to Address)
- `items` (OrderItem[])
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## OrderItem
- `id` (Int, PK)
- `orderId` (FK to Order)
- `productId` (FK to Product)
- `name` (String)
- `price` (Float)
- `quantity` (Int)
- `status` (String) - Individual item status (pending, shipped, delivered, rejected, cancelled)
- `expectedDate` (DateTime?) - Expected delivery date for shipped items
- `courierPartner` (String?) - Courier partner name
- `trackingId` (String?) - Tracking number
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

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