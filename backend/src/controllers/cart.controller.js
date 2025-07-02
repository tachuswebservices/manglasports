import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getCart(req, res) {
  const userId = Number(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const cart = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
}

export async function addToCart(req, res) {
  const { userId, productId, quantity } = req.body;
  console.log(req.body)
  if (!userId || !productId || !quantity) return res.status(400).json({ error: 'userId, productId, and quantity required' });
  try {
    const existing = await prisma.cart.findUnique({ where: { userId_productId: { userId, productId } } });
    if (existing) {
      // If already in cart, update quantity
      const updated = await prisma.cart.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity: existing.quantity + quantity },
      });
      return res.json(updated);
    }
    const cartItem = await prisma.cart.create({ data: { userId, productId, quantity } });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add to cart' });
  }
}

export async function updateCartItem(req, res) {
  const userId = Number(req.body.userId || req.query.userId);
  const productId = req.params.id;
  const { quantity } = req.body;
  if (!userId || !productId || !quantity) return res.status(400).json({ error: 'userId, productId, and quantity required' });
  try {
    const updated = await prisma.cart.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update cart item' });
  }
}

export async function removeFromCart(req, res) {
  const userId = Number(req.body.userId || req.query.userId);
  const productId = req.params.id;
  if (!userId || !productId) return res.status(400).json({ error: 'userId and productId required' });
  try {
    await prisma.cart.delete({ where: { userId_productId: { userId, productId } } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove from cart' });
  }
}

export async function clearCart(req, res) {
  const userId = Number(req.body.userId || req.query.userId);
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    await prisma.cart.deleteMany({ where: { userId } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to clear cart' });
  }
} 