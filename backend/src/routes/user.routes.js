import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { countProducts } from '../controllers/product.controller.js';
import { countOrders } from '../controllers/order.controller.js';
import { countUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/:id/change-password', userController.changePassword);

// Admin dashboard statistics
router.get('/admin/stats', async (req, res) => {
  try {
    const [products, orders, users] = await Promise.all([
      countProducts(),
      countOrders(),
      countUsers(),
    ]);
    res.json({ products, orders, users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router; 