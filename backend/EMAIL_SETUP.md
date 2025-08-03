# Email Setup Guide for Mangla Sports

This guide will help you configure the email functionality to send invoice emails when orders are placed.

## Prerequisites

1. A GoDaddy Microsoft 365 account (or other email service)
2. Node.js and npm installed
3. The backend server running

## GoDaddy Microsoft 365 Setup (Currently Configured)

### Step 1: Get Your Microsoft 365 Credentials
1. Log into your GoDaddy Microsoft 365 account
2. Note your full email address (e.g., `admin@yourdomain.com`)
3. Use your Microsoft 365 password

### Step 2: Configure Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Email Configuration for GoDaddy Microsoft 365
EMAIL_USER="your-email@yourdomain.com"
EMAIL_PASSWORD="your-microsoft-365-password"
```

**Important Notes:**
- Use your full email address as the EMAIL_USER
- Use your regular Microsoft 365 password (not an app password)
- If you have 2-factor authentication enabled, you may need to generate an app password from your Microsoft 365 account settings

## Alternative Email Services

### Gmail Setup
```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
```

**Gmail Setup Steps:**
1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password for "Mail"
3. Use the 16-character app password in your .env file

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password'
  }
});
```

### Custom SMTP Server
```javascript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-server.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-email@domain.com',
    pass: 'your-password'
  }
});
```

## Testing Email Configuration

1. Start the backend server:
   ```bash
   npm start
   ```

2. Test the email configuration:
   ```bash
   curl -X POST http://localhost:4000/api/email/test
   ```

   Or use Postman/Thunder Client to send a POST request to:
   `http://localhost:4000/api/email/test`

3. Check your email inbox for the test email

## Email Features

### 1. Order Confirmation Email
- Sent automatically when an order is placed
- Includes detailed invoice with product list
- Shows shipping and payment information
- Professional HTML template with Mangla Sports branding

### 2. Order Status Update Email
- Sent when order status is updated by admin
- Includes new status and order details
- Color-coded status badges

### 3. Email Templates
- Professional HTML templates
- Responsive design
- Branded with Mangla Sports logo and colors
- Includes all necessary order information

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - For GoDaddy Microsoft 365: Check your email and password are correct
   - For Gmail: Ensure 2-factor authentication is enabled and use App Password
   - Verify email and password are correct

2. **Connection Timeout**
   - Check internet connection
   - Verify SMTP settings
   - Try different email service

3. **Emails Not Sending**
   - Check server logs for error messages
   - Verify environment variables are set
   - Test email configuration endpoint

### Debug Mode
Enable debug logging by adding this to your email service:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    ciphers: 'SSLv3'
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});
```

## Security Notes

1. Never commit `.env` files to version control
2. Use App Passwords instead of regular passwords
3. Consider using OAuth2 for production environments
4. Regularly rotate email passwords
5. Monitor email sending logs for suspicious activity

## Production Considerations

1. **Email Service Limits**
   - Gmail: 500 emails/day for free accounts
   - Consider paid email services for high volume

2. **Email Delivery**
   - Monitor bounce rates
   - Implement email validation
   - Use email service analytics

3. **Backup Email Service**
   - Consider having a backup email service
   - Implement fallback mechanisms

## Support

If you encounter issues:
1. Check the server logs for error messages
2. Verify email configuration
3. Test with the `/api/email/test` endpoint
4. Contact support with specific error messages 