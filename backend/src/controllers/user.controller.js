import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function createUser(req, res) {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user' });
  }
}

export async function deleteUser(req, res) {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete user' });
  }
}

// Count all users
export async function countUsers() {
  return prisma.user.count();
}

// Change password endpoint
export async function changePassword(req, res) {
  const userId = Number(req.params.id);
  const { currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password', details: err.message });
  }
} 