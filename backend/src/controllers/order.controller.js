import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({ include: { user: true, product: true } });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: true, product: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

export async function createOrder(req, res) {
  try {
    const order = await prisma.order.create({ data: req.body });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create order' });
  }
}

export async function updateOrder(req, res) {
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update order' });
  }
}

export async function deleteOrder(req, res) {
  try {
    await prisma.order.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete order' });
  }
}

// Count all orders
export async function countOrders() {
  return prisma.order.count();
} 