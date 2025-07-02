import express from 'express';
import * as wishlistController from '../controllers/wishlist.controller.js';

const router = express.Router();

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:id', wishlistController.removeFromWishlist);
router.delete('/', wishlistController.clearWishlist);

export default router; 