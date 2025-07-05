# Environment & Configuration

- Environment variables are set in `.env` (in backend root or prisma folder)
- Required variables:
  - `DATABASE_URL` — connection string for the database
  - (Optional) `PORT` — port for Express server (default: 4000)
- For local development, use SQLite or PostgreSQL connection string
- For production, use a secure managed database 