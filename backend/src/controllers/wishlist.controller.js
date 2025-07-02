import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getWishlist(req, res) {
  const userId = Number(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
    });
    res.json(wishlist.map(item => item.product));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
}

export async function addToWishlist(req, res) {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: 'userId and productId required' });
  try {
    const exists = await prisma.wishlist.findUnique({ where: { userId_productId: { userId, productId } } });
    if (exists) return res.status(409).json({ error: 'Product already in wishlist' });
    const wishlistItem = await prisma.wishlist.create({ data: { userId, productId } });
    res.status(201).json(wishlistItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add to wishlist' });
  }
}

export async function removeFromWishlist(req, res) {
  const userId = Number(req.body.userId || req.query.userId);
  const productId = req.params.id;
  if (!userId || !productId) return res.status(400).json({ error: 'userId and productId required' });
  try {
    await prisma.wishlist.delete({ where: { userId_productId: { userId, productId } } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove from wishlist' });
  }
}

export async function clearWishlist(req, res) {
  const userId = Number(req.body.userId || req.query.userId);
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    await prisma.wishlist.deleteMany({ where: { userId } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to clear wishlist' });
  }
} 