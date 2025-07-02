import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const brands = await prisma.brand.findMany();
  res.json(brands);
});

export default router; 