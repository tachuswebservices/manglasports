import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const brands = await prisma.brand.findMany();
  res.json(brands);
});

// Create new brand
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const existing = await prisma.brand.findUnique({ where: { name } });
    if (existing) return res.status(409).json({ error: 'Brand already exists' });
    const brand = await prisma.brand.create({ data: { name } });
    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create brand', details: err.message });
  }
});

// Update brand by id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const updated = await prisma.brand.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: 'Brand not found', details: err.message });
  }
});

// Delete brand by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.brand.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Brand not found or could not be deleted', details: err.message });
  }
});

export default router; 