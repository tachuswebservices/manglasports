import express from 'express';
import { testEmailConfiguration } from '../services/emailService.js';

const router = express.Router();

// Test email configuration
router.post('/test', async (req, res) => {
  try {
    const { userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'User email is required' 
      });
    }
    
    const result = await testEmailConfiguration(userEmail);
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent successfully to your email',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send test email',
        details: result.error 
      });
    }
  } catch (error) {
    console.error('Error testing email configuration:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

export default router; 