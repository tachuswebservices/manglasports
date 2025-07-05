# Seeding & Migrations

## Migrations
- Prisma migrations are in `backend/prisma/migrations/`.
- To run migrations:
  ```sh
  cd backend
  npx prisma migrate dev
  ```

## Seeding
- The seed script is at `backend/prisma/seed.js`.
- To run the seed script:
  ```sh
  node backend/prisma/seed.js
  ```
- The script will create categories, brands, and all products, and a demo user. 