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
async function generateInvoiceHTML(order, user, address) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN');
  const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN');
  
  // Calculate subtotal, tax, shipping charges, and total
  const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  
  // Calculate shipping charges from product data
  let totalShippingCharges = 0;
  try {
    // Fetch product details to get shipping charges
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    for (const item of order.orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { shippingCharges: true }
      });
      if (product && product.shippingCharges) {
        totalShippingCharges += product.shippingCharges * item.quantity;
      }
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error fetching shipping charges:', error);
    // Fallback to 0 if there's an error
    totalShippingCharges = 0;
  }
  
  const total = subtotal + tax + totalShippingCharges;
  
  // Safely handle address fields with fallbacks
  const addressLine1 = address?.line1 || 'Address not available';
  const addressLine2 = address?.line2 || '';
  const addressCity = address?.city || 'City not available';
  const addressState = address?.state || 'State not available';
  const addressPostalCode = address?.postalCode || 'Postal code not available';
  const addressPhone = address?.phone || 'Phone not available';
  const userName = user?.name || 'Customer';
  const userEmail = user?.email || 'Email not available';
  
  const itemsHTML = order.orderItems.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="font-weight: 500;">${item.name}</div>
        <div style="font-size: 12px; color: #666; margin-top: 2px;">SKU: ${item.id}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: 500;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Invoice #${order.id} - Mangla Sports</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px 20px; }
                 .logo { text-align: center; margin-bottom: 8px; }
        .tagline { font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; gap: 20px; }
        .customer-info, .order-info { flex: 1; }
        .customer-info { background-color: #f8fafc; padding: 20px; border-radius: 8px; }
        .order-info { background-color: #f0f9ff; padding: 20px; border-radius: 8px; text-align: right; }
        .section-title { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #1e40af; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        th { background-color: #1e40af; color: white; padding: 15px 12px; text-align: left; font-weight: 600; }
        td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .total-section { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .total-row.final { font-weight: bold; font-size: 18px; color: #1e40af; border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 12px; }
        .status { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; background-color: #10b981; color: white; }
        .info-box { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .footer { background-color: #1e293b; color: white; text-align: center; padding: 30px 20px; }
        .footer a { color: #60a5fa; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
        .product-image { width: 50px; height: 50px; border-radius: 6px; object-fit: cover; margin-right: 10px; }
        .product-details { display: flex; align-items: center; }
      </style>
    </head>
    <body>
      <div class="container">
                 <div class="header">
           <div class="logo">
             <img src="https://res.cloudinary.com/dvltehb8j/image/upload/v1753353064/msa-logo_ln09co.png" alt="Mangla Sports" style="height: 60px; width: auto; margin-bottom: 10px;">
           </div>
           <div class="tagline">Your Premier Shooting Sports Equipment Store</div>
         </div>

        <div class="content">
          <!-- Order Confirmation Message -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e40af; margin-bottom: 10px;">🎉 Order Confirmed!</h1>
            <p style="font-size: 16px; color: #64748b;">Thank you for your order. We're excited to fulfill your shooting sports needs!</p>
          </div>

                     <div class="invoice-details">
             <div class="customer-info">
               <div class="section-title">📋 Billing & Shipping Address</div>
               <p style="margin: 8px 0;"><strong>${userName}</strong></p>
               <p style="margin: 8px 0; color: #64748b;">${addressLine1}</p>
               ${addressLine2 ? `<p style="margin: 8px 0; color: #64748b;">${addressLine2}</p>` : ''}
               <p style="margin: 8px 0; color: #64748b;">${addressCity}, ${addressState} ${addressPostalCode}</p>
               <p style="margin: 8px 0; color: #64748b;">📞 ${addressPhone}</p>
               <p style="margin: 8px 0; color: #64748b;">📧 ${userEmail}</p>
             </div>
            <div class="order-info">
              <div class="section-title">📦 Order Details</div>
              <p style="margin: 8px 0;"><strong>Order ID:</strong> #${order.id}</p>
              <p style="margin: 8px 0;"><strong>Order Date:</strong> ${orderDate}</p>
              <p style="margin: 8px 0;"><strong>Order Time:</strong> ${orderTime}</p>
              <p style="margin: 8px 0;"><strong>Status:</strong> <span class="status">✓ Confirmed</span></p>
              <p style="margin: 8px 0;"><strong>Items:</strong> ${order.orderItems.length} product(s)</p>
            </div>
          </div>

          <!-- Products Table -->
          <div class="section-title">🛍️ Ordered Products</div>
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Product Details</th>
                <th style="text-align: center; width: 15%;">Quantity</th>
                <th style="text-align: right; width: 17.5%;">Unit Price</th>
                <th style="text-align: right; width: 17.5%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div class="total-section">
            <div class="section-title">💰 Order Summary</div>
            <div class="total-row">
              <span>Subtotal (${order.orderItems.length} items):</span>
              <span>₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-row">
              <span>GST (18%):</span>
              <span>₹${tax.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-row">
              <span>Shipping Charges:</span>
              <span>₹${totalShippingCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-row final">
              <span>Total Amount:</span>
              <span>₹${total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="info-box">
            <div class="section-title">💳 Payment Information</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="margin: 8px 0;"><strong>Payment Method:</strong> Online Payment (Razorpay)</p>
                <p style="margin: 8px 0;"><strong>Payment Status:</strong> <span style="color: #059669; font-weight: bold;">✓ Successfully Paid</span></p>
                <p style="margin: 8px 0;"><strong>Transaction ID:</strong> ${order.paymentId || 'N/A'}</p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 24px; color: #059669;">✓</div>
                <div style="font-size: 12px; color: #64748b;">Payment Confirmed</div>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div class="info-box">
            <div class="section-title">🚚 Shipping Information</div>
            <p style="margin: 8px 0;"><strong>Processing Time:</strong> 1-2 business days</p>
            <p style="margin: 8px 0;"><strong>Estimated Delivery:</strong> 3-5 business days</p>
            <p style="margin: 8px 0;"><strong>Shipping Method:</strong> Standard Delivery</p>
            <p style="margin: 8px 0; color: #64748b;">You will receive tracking information via email once your order is shipped.</p>
          </div>

          <!-- Next Steps -->
          <div class="info-box">
            <div class="section-title">📋 What's Next?</div>
            <div style="display: flex; align-items: center; margin: 12px 0;">
              <div style="background-color: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold;">1</div>
              <span>Order processing and quality check</span>
            </div>
            <div style="display: flex; align-items: center; margin: 12px 0;">
              <div style="background-color: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold;">2</div>
              <span>Shipping confirmation with tracking details</span>
            </div>
            <div style="display: flex; align-items: center; margin: 12px 0;">
              <div style="background-color: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold;">3</div>
              <span>Delivery to your doorstep</span>
            </div>
          </div>
        </div>

                 <div class="footer">
           <div style="margin-bottom: 15px;">
             <img src="https://res.cloudinary.com/dvltehb8j/image/upload/v1753353064/msa-logo_ln09co.png" alt="Mangla Sports" style="height: 40px; width: auto; filter: brightness(0) invert(1);">
           </div>
           <p style="margin-bottom: 8px;">Your Premier Shooting Sports Equipment Store</p>
           <p style="margin-bottom: 8px;">📧 <a href="mailto:support@manglasports.com">support@manglasports.com</a></p>
           <p style="margin-bottom: 8px;">📞 <a href="tel:+91 92569 30009">+91 92569 30009</a></p>
           <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">© 2025 Mangla Sports. All rights reserved.</p>
           <p style="font-size: 12px; opacity: 0.8;">Thank you for choosing Mangla Sports for your shooting sports needs!</p>
         </div>
      </div>
    </body>
    </html>
  `;
}

// Generate email verification HTML template
function generateEmailVerificationHTML(userName, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification - Mangla Sports</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px 20px; }
        .logo { text-align: center; margin-bottom: 8px; }
        .tagline { font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .verify-button { display: inline-block; background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .verify-button:hover { background-color: #059669; }
        .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #1e293b; color: white; text-align: center; padding: 30px 20px; }
        .footer a { color: #60a5fa; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
        .info-box { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .welcome-box { background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <img src="https://res.cloudinary.com/dvltehb8j/image/upload/v1753353064/msa-logo_ln09co.png" alt="Mangla Sports" style="height: 60px; width: auto; margin-bottom: 10px;">
          </div>
          <div class="tagline">Your Premier Shooting Sports Equipment Store</div>
        </div>

        <div class="content">
          <h1 style="color: #1e40af; margin-bottom: 20px;">🎉 Welcome to Mangla Sports!</h1>
          
          <div class="welcome-box">
            <h3 style="margin-top: 0; color: #059669;">Welcome aboard, <strong>${userName || 'there'}</strong>!</h3>
            <p>Thank you for creating an account with Mangla Sports. We're excited to have you as part of our shooting sports community!</p>
          </div>
          
          <p>To complete your registration and start shopping for premium shooting sports equipment, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a style="color: white;" href="${verificationUrl}" class="verify-button">Verify My Email Address</a>
          </div>
          
          <div class="warning">
            <h3 style="margin-top: 0; color: #92400e;">⚠️ Important Security Notice</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This verification link will expire in <strong>24 hours</strong></li>
              <li>Only click the verify button if you created this account</li>
              <li>If you didn't create this account, you can safely ignore this email</li>
            </ul>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #1e40af;">🔗 Can't click the button?</h3>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f1f5f9; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">
              ${verificationUrl}
            </p>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #1e40af;">🎯 What's Next?</h3>
            <p>Once you verify your email, you'll be able to:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Browse our complete catalog of shooting sports equipment</li>
              <li>Add items to your wishlist and cart</li>
              <li>Complete purchases with secure payment</li>
              <li>Track your orders and receive updates</li>
              <li>Write reviews for products you've purchased</li>
            </ul>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>The Mangla Sports Team</p>
        </div>

        <div class="footer">
          <div style="margin-bottom: 15px;">
            <img src="https://res.cloudinary.com/dvltehb8j/image/upload/v1753353064/msa-logo_ln09co.png" alt="Mangla Sports" style="height: 40px; width: auto; filter: brightness(0) invert(1);">
          </div>
          <p style="margin-bottom: 8px;">Your Premier Shooting Sports Equipment Store</p>
          <p style="margin-bottom: 8px;">📧 <a href="mailto:support@manglasports.com">support@manglasports.com</a></p>
          <p style="margin-bottom: 8px;">📞 <a href="tel:+91 92569 30009">+91 92569 30009</a></p>
          <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">© 2025 Mangla Sports. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate password reset HTML template
function generatePasswordResetHTML(userName, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset - Mangla Sports</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px 20px; }
        .logo { text-align: center; margin-bottom: 8px; }
        .tagline { font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .reset-button { display: inline-block; background-color: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .reset-button:hover { background-color: #1e3a8a; }
        .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #1e293b; color: white; text-align: center; padding: 30px 20px; }
        .footer a { color: #60a5fa; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
        .info-box { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <img src="https://res.cloudinary.com/dvltehb8j/image/upload/v1753353064/msa-logo_ln09co.png" alt="Mangla Sports" style="height: 60px; width: auto; margin-bottom: 10px;">
          </div>
          <div class="tagline">Your Premier Shooting Sports Equipment Store</div>
        </div>

        <div class="content">
          <h1 style="color: #1e40af; margin-bottom: 20px;">🔐 Password Reset Request</h1>
          
          <p>Hello <strong>${userName || 'there'}</strong>,</p>
          
          <p>We received a request to reset your password for your Mangla Sports account. If you didn't make this request, you can safely ignore this email.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="reset-button">Reset My Password</a>
          </div>
          
          <div class="warning">
            <h3 style="margin-top: 0; color: #92400e;">⚠️ Important Security Notice</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>Only click the reset button if you requested this password reset</li>
              <li>If you didn't request this, your password will remain unchanged</li>
            </ul>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #1e40af;">🔗 Can't click the button?</h3>
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f1f5f9; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">
              ${resetUrl}
            </p>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>The Mangla Sports Team</p>
        </div>

        <div class="footer">
          <div style="margin-bottom: 15px;">
            <img src="https://res.cloudinary.com/dvltehb8j/image/upload/v1753353064/msa-logo_ln09co.png" alt="Mangla Sports" style="height: 40px; width: auto; filter: brightness(0) invert(1);">
          </div>
          <p style="margin-bottom: 8px;">Your Premier Shooting Sports Equipment Store</p>
          <p style="margin-bottom: 8px;">📧 <a href="mailto:support@manglasports.com">support@manglasports.com</a></p>
          <p style="margin-bottom: 8px;">📞 <a href="tel:+91 92569 30009">+91 92569 30009</a></p>
          <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">© 2025 Mangla Sports. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send invoice email
export async function sendInvoiceEmail(order, user, address) {
  try {
    // Debug logging to help troubleshoot address issues
    console.log('Sending invoice email for order:', order.id);
    console.log('User data:', { name: user?.name, email: user?.email });
    console.log('Address data:', {
      line1: address?.line1,
      line2: address?.line2,
      city: address?.city,
      state: address?.state,
      postalCode: address?.postalCode,
      phone: address?.phone
    });

    const htmlContent = await generateInvoiceHTML(order, user, address);
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@yourdomain.com',
      to: user?.email || 'customer@example.com',
      subject: `Order Confirmation - Invoice #${order.id} - Mangla Sports`,
      html: htmlContent,
      attachments: [
        {
          filename: `invoice-${order.id}.html`,
          content: htmlContent
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

// Send email verification
export async function sendEmailVerification(email, verificationToken, userName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@yourdomain.com',
      to: email,
      subject: 'Verify Your Email - Welcome to Mangla Sports',
      html: generateEmailVerificationHTML(userName, verificationToken)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email verification sent successfully to:', email, 'Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email verification:', error);
    return { success: false, error: error.message };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email, resetToken, userName) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@yourdomain.com',
      to: email,
      subject: 'Password Reset Request - Mangla Sports',
      html: generatePasswordResetHTML(userName, resetToken)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email, 'Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
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
      cancelled: '#ef4444',
      rejected: '#dc2626'
    };

    // Get status-specific content
    const getStatusContent = (status) => {
      switch (status) {
        case 'shipped':
          return {
            title: 'Order Shipped',
            message: 'Your order has been shipped and is on its way to you!',
            details: 'You will receive tracking information once available.'
          };
        case 'delivered':
          return {
            title: 'Order Delivered',
            message: 'Your order has been successfully delivered!',
            details: 'Thank you for your purchase. We hope you enjoy your products!'
          };
        case 'rejected':
          return {
            title: 'Order Rejected',
            message: 'We regret to inform you that your order has been rejected.',
            details: 'If you have any questions about this decision, please contact our support team.'
          };
        default:
          return {
            title: 'Order Status Update',
            message: `Your order status has been updated to ${status}.`,
            details: 'Please check your order details for more information.'
          };
      }
    };

    const statusContent = getStatusContent(newStatus);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@yourdomain.com',
      to: user?.email || 'customer@example.com',
      subject: `${statusContent.title} - Order #${order.id} - Mangla Sports`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${statusContent.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e40af; }
            .status-update { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: white; }
            .status-message { margin: 20px 0; padding: 15px; background-color: white; border-radius: 8px; border-left: 4px solid ${statusColors[newStatus] || '#6b7280'}; }
            .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">
                <img src="https://res.cloudinary.com/dvltehb8j/image/upload/v1753353064/msa-logo_ln09co.png" alt="Mangla Sports" style="height: 50px; width: auto; margin-bottom: 10px;">
              </div>
              <p>Your Premier Shooting Sports Equipment Store</p>
            </div>

            <div class="status-update">
              <h2>${statusContent.title}</h2>
              <p>Dear <strong>${user.name}</strong>,</p>
              <p>Your order <strong>#${order.id}</strong> status has been updated to:</p>
              <div style="margin: 20px 0;">
                <span class="status-badge" style="background-color: ${statusColors[newStatus] || '#6b7280'};">${newStatus.toUpperCase()}</span>
              </div>
              <div class="status-message">
                <p><strong>${statusContent.message}</strong></p>
                <p>${statusContent.details}</p>
              </div>
              <p>Order Total: <strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong></p>
            </div>

            <div class="footer">
              <p>Thank you for choosing Mangla Sports!</p>
              <p>For any queries, please contact us at support@manglasports.com</p>
              <p>© 2025 Mangla Sports. All rights reserved.</p>
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
              <div class="logo">
                <img src="https://res.cloudinary.com/dvltehb8j/image/upload/v1753353064/msa-logo_ln09co.png" alt="Mangla Sports" style="height: 50px; width: auto; margin-bottom: 10px;">
              </div>
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
              <p>© 2025 Mangla Sports. All rights reserved.</p>
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