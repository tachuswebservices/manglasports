import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createBlogPost,
  getBlogPosts,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createComment,
  getComments,
  moderateComment,
  deleteComment,
  getCategories,
  getFeaturedPosts
} from '../controllers/blog.controller.js';
import { uploadMiddleware, uploadImage, deleteImage } from '../controllers/upload.controller.js';

const router = express.Router();

// Public routes
router.get('/posts', getBlogPosts);
router.get('/posts/featured', getFeaturedPosts);
router.get('/posts/:slug', getBlogPost);
router.get('/categories', getCategories);
router.get('/posts/:postId/comments', getComments);

// Protected routes (require authentication)
router.post('/posts', authenticateToken, createBlogPost);
router.put('/posts/:id', authenticateToken, updateBlogPost);
router.delete('/posts/:id', authenticateToken, deleteBlogPost);
router.post('/comments', authenticateToken, createComment);
router.delete('/comments/:id', authenticateToken, deleteComment);

// Admin only routes
router.put('/comments/:id/moderate', authenticateToken, moderateComment);

// Upload routes
router.post('/upload', authenticateToken, uploadMiddleware, uploadImage);
router.delete('/upload/:publicId', authenticateToken, deleteImage);

export default router; 