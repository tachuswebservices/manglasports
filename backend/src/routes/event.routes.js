import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getEvents,
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventCategories
} from '../controllers/event.controller.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/categories', getEventCategories);
router.get('/:slug', getEvent);

// Protected routes (require authentication)
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

// Admin routes
router.get('/admin/all', authenticateToken, getAllEvents);

export default router; 