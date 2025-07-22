import express from 'express';
import * as addressController from '../controllers/address.controller.js';

const router = express.Router();

router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

export default router; 