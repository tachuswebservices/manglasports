import express from 'express';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.get('/', orderController.getAllOrders);
router.get('/stats', orderController.getDashboardStats);
router.get('/user', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.put('/items/:id', orderController.updateOrderItem);

export default router; 