import express from 'express';
import { uploadMiddleware, uploadImage, deleteImage } from '../controllers/upload.controller.js';

const router = express.Router();

// Upload image
router.post('/', uploadMiddleware, uploadImage);

// Delete image
router.delete('/:publicId', deleteImage);

export default router; 