# Prisma Usage

- Prisma Client is initialized in each controller: `const prisma = new PrismaClient();`
- Used for all database queries (findMany, findUnique, create, update, delete, etc.)
- Relations are queried using `include` (e.g., `include: { category: true, brand: true }`)
- Use `prisma.$disconnect()` at the end of scripts (e.g., in seed.js)
- Migrations and schema changes are managed via `prisma/schema.prisma` and `prisma migrate` 