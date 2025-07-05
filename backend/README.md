# Backend

> All backend documentation is now in [docs/](./docs/)

# Mangla Sports Backend

This is the backend for the Mangla Sports & Associates website, built with Node.js, Express, and Prisma ORM.

## Tech Stack
- Node.js
- Express
- Prisma ORM (with SQLite for development, can be switched to PostgreSQL)

## Features
- **Products:** Full CRUD (Create, Read, Update, Delete)
- **Users:** Full CRUD
- **Orders:** Full CRUD
- **Wishlist:** User-specific, persistent, full CRUD
- **Cart:** User-specific, persistent, full CRUD
- **Separation of routes and controllers for maintainability**

## Setup & Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your database connection in `prisma/schema.prisma` and `.env` (default is SQLite).
3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma migrate dev --name wishlist
   npx prisma migrate dev --name cart
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. (Optional) Seed the database:
   ```bash
   node prisma/seed.js
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Products
- `GET    /api/products`           — Get all products
- `GET    /api/products/:id`       — Get product by ID
- `POST   /api/products`           — Create product
- `PUT    /api/products/:id`       — Update product
- `DELETE /api/products/:id`       — Delete product

### Users
- `GET    /api/users`              — Get all users
- `GET    /api/users/:id`          — Get user by ID
- `POST   /api/users`              — Create user
- `PUT    /api/users/:id`          — Update user
- `DELETE /api/users/:id`          — Delete user

### Orders
- `GET    /api/orders`             — Get all orders
- `GET    /api/orders/:id`         — Get order by ID
- `POST   /api/orders`             — Create order
- `PUT    /api/orders/:id`         — Update order
- `DELETE /api/orders/:id`         — Delete order

### Wishlist
- `GET    /api/wishlist?userId=1`  — Get wishlist for user
- `POST   /api/wishlist`           — Add to wishlist (`{ userId, productId }`)
- `DELETE /api/wishlist/:id`       — Remove product from wishlist (`userId` in body/query)
- `DELETE /api/wishlist`           — Clear wishlist for user (`userId` in body/query)

### Cart
- `GET    /api/cart?userId=1`      — Get cart for user
- `POST   /api/cart`               — Add to cart (`{ userId, productId, quantity }`)
- `PUT    /api/cart/:id`           — Update cart item quantity (`userId` in body/query, `quantity` in body)
- `DELETE /api/cart/:id`           — Remove product from cart (`userId` in body/query)
- `DELETE /api/cart`               — Clear cart for user (`userId` in body/query)

## Prisma Models

```
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  orders    Order[]
  wishlist  Wishlist[]
  cart      Cart[]
  createdAt DateTime @default(now())
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  stock       Int
  createdAt   DateTime @default(now())
  orders      Order[]
  wishlist    Wishlist[]
  cart        Cart[]
}

model Order {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  product   Product  @relation(fields: [productId], references: [id])
  productId Int
  quantity  Int
  createdAt DateTime @default(now())
}

model Wishlist {
  userId   Int
  productId Int
  user     User    @relation(fields: [userId], references: [id])
  product  Product @relation(fields: [productId], references: [id])

  @@id([userId, productId])
}

model Cart {
  userId   Int
  productId Int
  quantity Int
  user     User    @relation(fields: [userId], references: [id])
  product  Product @relation(fields: [productId], references: [id])

  @@id([userId, productId])
}
```

## Folder Structure
- `src/` - Express app source code
  - `controllers/` — Business logic for each resource
  - `routes/` — Route definitions for each resource
- `prisma/` - Prisma schema and migrations

---

For more details, see the main project README. 