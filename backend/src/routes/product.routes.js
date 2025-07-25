import express from 'express';
import * as productController from '../controllers/product.controller.js';
import multer from 'multer';
import path from 'path';
import { deleteCloudinaryImage } from '../controllers/product.controller.js';

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'public', 'lovable-uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg and .png files are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Multiple image upload endpoint
router.post('/upload-image', upload.array('images', 5), (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  // Return the relative paths to the uploaded images
  const imageUrls = req.files.map(file => `/lovable-uploads/${file.filename}`);
  res.json({ imageUrls });
});

// Delete image from Cloudinary by publicId
router.delete('/delete-image/:publicId', deleteCloudinaryImage);

export default router; 