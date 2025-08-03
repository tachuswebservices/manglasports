import nodemailer from 'nodemailer';

// Create transporter for GoDaddy Microsoft 365
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your-email@yourdomain.com',
    pass: process.env.EMAIL_PASSWORD || 'your-password'
  }
});

// Generate invoice HTML template
function generateInvoiceHTML(order, user, address) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN');
  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN');
  
  const itemsHTML = order.orderItems.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Invoice - Mangla Sports</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .customer-info, .order-info { flex: 1; }
        .order-info { text-align: right; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
        .total-row { font-weight: bold; background-color: #f1f5f9; }
        .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 14px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-completed { background-color: #d1fae5; color: #065f46; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏹 Mangla Sports</div>
          <p>Your Premier Shooting Sports Equipment Store</p>
        </div>

        <div class="invoice-details">
          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${user.name}</strong></p>
            <p>${address.street}</p>
            <p>${address.city}, ${address.state} ${address.pincode}</p>
            <p>Phone: ${address.phone}</p>
          </div>
          <div class="order-info">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Date:</strong> ${orderDate}</p>
            <p><strong>Time:</strong> ${orderTime}</p>
            <p><strong>Status:</strong> <span class="status status-${order.orderItems[0]?.status || 'pending'}">${order.orderItems[0]?.status || 'pending'}</span></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="3" style="text-align: right; padding: 12px;"><strong>Total Amount:</strong></td>
              <td style="text-align: right; padding: 12px;"><strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>📦 Shipping Information:</h4>
          <p>Your order will be processed and shipped within 2-3 business days. You will receive tracking information once your order is shipped.</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>💳 Payment Information:</h4>
          <p><strong>Payment Method:</strong> Online Payment (Razorpay)</p>
          <p><strong>Payment Status:</strong> <span style="color: #059669; font-weight: bold;">✓ Paid</span></p>
          <p><strong>Transaction ID:</strong> ${order.paymentId || 'N/A'}</p>
        </div>

        <div class="footer">
          <p>Thank you for choosing Mangla Sports!</p>
          <p>For any queries, please contact us at support@manglasports.com</p>
          <p>© 2024 Mangla Sports. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send invoice email
export async function sendInvoiceEmail(order, user, address) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: user.email,
      subject: `Order Confirmation - Invoice #${order.id} - Mangla Sports`,
      html: generateInvoiceHTML(order, user, address),
      attachments: [
        {
          filename: `invoice-${order.id}.html`,
          content: generateInvoiceHTML(order, user, address)
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return { success: false, error: error.message };
  }
}

// Send order status update email
export async function sendOrderStatusUpdateEmail(order, user, newStatus) {
  try {
    const statusColors = {
      pending: '#f59e0b',
      shipped: '#3b82f6',
      delivered: '#10b981',
      completed: '#059669',
      cancelled: '#ef4444'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: user.email,
      subject: `Order Status Update - Order #${order.id} - Mangla Sports`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
            .status-update { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: white; }
            .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏹 Mangla Sports</div>
              <p>Your Premier Shooting Sports Equipment Store</p>
            </div>

            <div class="status-update">
              <h2>Order Status Update</h2>
              <p>Dear <strong>${user.name}</strong>,</p>
              <p>Your order <strong>#${order.id}</strong> status has been updated to:</p>
              <div style="margin: 20px 0;">
                <span class="status-badge" style="background-color: ${statusColors[newStatus] || '#6b7280'};">${newStatus.toUpperCase()}</span>
              </div>
              <p>Order Total: <strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong></p>
            </div>

            <div class="footer">
              <p>Thank you for choosing Mangla Sports!</p>
              <p>For any queries, please contact us at support@manglasports.com</p>
              <p>© 2024 Mangla Sports. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Status update email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending status update email:', error);
    return { success: false, error: error.message };
  }
}

// Test email configuration
export async function testEmailConfiguration(userEmail) {
  try {
    const testMailOptions = {
      from: process.env.EMAIL_USER || 'your-email@yourdomain.com',
      to: userEmail,
      subject: 'Email Configuration Test - Mangla Sports',
      text: 'This is a test email to verify the email configuration is working correctly.',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Email Configuration Test</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
            .test-content { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏹 Mangla Sports</div>
              <p>Your Premier Shooting Sports Equipment Store</p>
            </div>

            <div class="test-content">
              <h2>✅ Email Configuration Test Successful!</h2>
              <p>Hello! This is a test email to verify that the email service is configured correctly.</p>
              <p>If you receive this email, it means:</p>
              <ul style="text-align: left; display: inline-block;">
                <li>✅ GoDaddy Microsoft 365 email is properly configured</li>
                <li>✅ Order confirmation emails will be sent to customers</li>
                <li>✅ Order status update emails will work correctly</li>
                <li>✅ The email system is ready for production use</li>
              </ul>
            </div>

            <div class="footer">
              <p>Thank you for choosing Mangla Sports!</p>
              <p>For any queries, please contact us at support@manglasports.com</p>
              <p>© 2024 Mangla Sports. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(testMailOptions);
    console.log('Test email sent successfully to:', userEmail, 'Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
} 