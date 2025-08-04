import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import cartRoutes from './routes/cart.routes.js';
import categoryRoutes from './routes/category.routes.js';
import brandRoutes from './routes/brand.routes.js';
import authRoutes from './routes/auth.routes.js';
import addressRoutes from './routes/address.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import emailRoutes from './routes/email.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminOnly from './middleware/adminOnly.js';

const app = express();

app.use(cors()); // Allow all origins for development
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Mangla Sports Backend API');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/reviews', reviewRoutes);

// Example protected admin API route
app.get('/admin', adminOnly, (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

export default app; 