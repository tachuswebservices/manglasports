import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// Create new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) return res.status(409).json({ error: 'Category already exists' });
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
});

// Update category by id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: 'Category not found', details: err.message });
  }
});

// Delete category by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: 'Category not found or could not be deleted', details: err.message });
  }
});

export default router; 