import express from 'express';
import { 
  getProductReviews, 
  createReview, 
  updateReview, 
  deleteReview, 
  getUserReview,
  canUserReview,
  getAllReviewsAdmin,
  adminUpdateReview,
  adminDeleteReview
} from '../controllers/review.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import adminOnly from '../middleware/adminOnly.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (require authentication)
router.get('/product/:productId/user', authenticateToken, getUserReview);
router.get('/product/:productId/can-review', authenticateToken, canUserReview);
router.post('/product/:productId', authenticateToken, createReview);
router.put('/product/:productId', authenticateToken, updateReview);
router.delete('/product/:productId', authenticateToken, deleteReview);

// Admin routes
router.get('/admin/all', authenticateToken, adminOnly, getAllReviewsAdmin);
router.put('/admin/:id', authenticateToken, adminOnly, adminUpdateReview);
router.delete('/admin/:id', authenticateToken, adminOnly, adminDeleteReview);

export default router; 