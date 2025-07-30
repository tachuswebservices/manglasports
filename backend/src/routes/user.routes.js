import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { getDashboardStats } from '../controllers/order.controller.js';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/:id/change-password', userController.changePassword);

// Admin dashboard statistics - now uses enhanced stats with date filtering
router.get('/admin/stats', getDashboardStats);

export default router; 