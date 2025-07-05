# Project Overview

This backend powers the Mangla Sports e-commerce website. It is built with Node.js, Express, and Prisma ORM, and connects to a PostgreSQL (or MySQL/SQLite) database. The backend exposes a RESTful API for the frontend to consume.

## Stack
- Node.js + Express
- Prisma ORM
- PostgreSQL (or MySQL/SQLite)

## Structure
- `src/` — Main source code (controllers, routes, app.js)
- `prisma/` — Prisma schema, migrations, and seed scripts
- `docs/` — Documentation

## Responsibilities
- User, product, order, cart, and wishlist management
- Category and brand management
- API endpoints for all e-commerce operations
- Data validation and error handling
- Database migrations and seeding

## Frontend Integration
- The backend serves as the data/API layer for the React frontend (see `/src` in the main project).
- All product, category, brand, cart, and wishlist data is served via API endpoints. 