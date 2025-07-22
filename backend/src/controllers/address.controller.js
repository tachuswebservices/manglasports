import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAddresses(req, res) {
  const userId = Number(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const addresses = await prisma.address.findMany({ where: { userId } });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
}

export async function createAddress(req, res) {
  const userId = Number(req.body.userId);
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const address = await prisma.address.create({ data: { ...req.body, userId } });
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create address', details: err.message });
  }
}

export async function updateAddress(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'id required' });
  try {
    const address = await prisma.address.update({ where: { id }, data: req.body });
    res.json(address);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update address', details: err.message });
  }
}

export async function deleteAddress(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'id required' });
  try {
    await prisma.address.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete address' });
  }
} 