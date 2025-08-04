import express from 'express';
import { signup, login, forgotPassword, resetPassword, verifyResetToken, verifyEmail, resendVerificationEmail } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

export default router; 