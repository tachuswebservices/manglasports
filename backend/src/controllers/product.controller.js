import { PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';
const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvltehb8j',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getAllProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
          features: true,
          specifications: true,
        },
      }),
      prisma.product.count(),
    ]);
    res.json({ products, total });
  } catch (err) {
    console.error(err); // Log the real error
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        brand: true,
        features: true,
        specifications: true,
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

export async function createProduct(req, res) {
  try {
    console.log('CREATE PRODUCT - Features received:', req.body.features);
    console.log('CREATE PRODUCT - Features type:', typeof req.body.features);
    console.log('CREATE PRODUCT - Features isArray:', Array.isArray(req.body.features));
    const {
      id,
      name,
      numericPrice,
      images,
      categoryId,
      brandId,
      reviewCount,
      soldCount,
      inStock,
      isNew,
      isHot,
      shortDescription,
      features,
      specifications,
      gst,
      offerPrice,
      shippingCharges,
    } = req.body;
    // Normalize images to array of { url, publicId }
    let normalizedImages = [];
    if (Array.isArray(images)) {
      normalizedImages = images.map(img =>
        typeof img === 'string'
          ? { url: img, publicId: '' }
          : { url: img.url, publicId: img.publicId || '' }
      );
    }
    const product = await prisma.product.create({
      data: {
        id,
        name,
        numericPrice,
        images: normalizedImages,
        categoryId: parseInt(categoryId),
        brandId: parseInt(brandId),
        reviewCount,
        soldCount,
        inStock,
        isNew,
        isHot,
        shortDescription,
        gst,
        offerPrice,
        shippingCharges,
        features: features && Array.isArray(features) && features.length > 0 ? { 
          create: features.map((feature) => ({ 
            value: typeof feature === 'string' ? feature : feature.value 
          })).filter(f => f.value && f.value.trim())
        } : undefined,
        specifications: specifications ? { create: specifications.map(({ key, value }) => ({ key, value })) } : undefined,
      },
      include: {
        category: true,
        brand: true,
        features: true,
        specifications: true,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product', details: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    console.log('UPDATE PRODUCT - Features received:', req.body.features);
    console.log('UPDATE PRODUCT - Features type:', typeof req.body.features);
    console.log('UPDATE PRODUCT - Features isArray:', Array.isArray(req.body.features));
    
    const {
      name,
      numericPrice,
      images,
      categoryId,
      brandId,
      reviewCount,
      soldCount,
      inStock,
      isNew,
      isHot,
      shortDescription,
      features,
      specifications,
      gst,
      offerPrice,
      shippingCharges,
    } = req.body;
    // Normalize images to array of { url, publicId }
    let normalizedImages = [];
    if (Array.isArray(images)) {
      normalizedImages = images.map(img =>
        typeof img === 'string'
          ? { url: img, publicId: '' }
          : { url: img.url, publicId: img.publicId || '' }
      );
    }
    // Remove old features/specifications and add new ones
    await prisma.feature.deleteMany({ where: { productId: req.params.id } });
    await prisma.specification.deleteMany({ where: { productId: req.params.id } });
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        numericPrice,
        images: normalizedImages,
        categoryId: parseInt(categoryId),
        brandId: parseInt(brandId),
        reviewCount,
        soldCount,
        inStock,
        isNew,
        isHot,
        shortDescription,
        gst,
        offerPrice,
        shippingCharges,
        features: features && Array.isArray(features) && features.length > 0 ? { 
          create: features.map((feature) => ({ 
            value: typeof feature === 'string' ? feature : feature.value 
          })).filter(f => f.value && f.value.trim())
        } : undefined,
        specifications: specifications ? { create: specifications.map(({ key, value }) => ({ key, value })) } : undefined,
      },
      include: {
        category: true,
        brand: true,
        features: true,
        specifications: true,
      },
    });
    
    res.json(product);
  } catch (err) {
    console.error('UPDATE PRODUCT ERROR:', err);
    res.status(400).json({ error: 'Failed to update product', details: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    
    console.log(`Attempting to delete product with ID: ${id}`);
    console.log('User making request:', req.user);
    
    // Validate ID parameter - Product IDs are strings, not integers
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.log(`Invalid product ID provided: ${id}`);
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Check if product exists before deleting
    const existingProduct = await prisma.product.findUnique({
      where: { id: id.trim() },
      include: {
        features: true,
        specifications: true,
        reviews: true,
        orderItems: true,
        cart: true,
        wishlist: true
      }
    });

    if (!existingProduct) {
      console.log(`Product with ID ${id} not found`);
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log(`Product found: ${existingProduct.name}`);
    console.log(`Related data counts:`, {
      features: existingProduct.features?.length || 0,
      specifications: existingProduct.specifications?.length || 0,
      reviews: existingProduct.reviews?.length || 0,
      orderItems: existingProduct.orderItems?.length || 0,
      cart: existingProduct.cart?.length || 0,
      wishlist: existingProduct.wishlist?.length || 0
    });

    // Check if product has active orders
    if (existingProduct.orderItems && existingProduct.orderItems.length > 0) {
      console.log(`Cannot delete product ${id} - has ${existingProduct.orderItems.length} order items`);
      return res.status(400).json({ 
        error: 'Cannot delete product - it has associated orders. Please contact support if you need to remove this product.' 
      });
    }

    // Delete related data first (features, specifications, reviews, cart items, wishlist items)
    console.log('Deleting related data...');
    await prisma.feature.deleteMany({ where: { productId: id.trim() } });
    await prisma.specification.deleteMany({ where: { productId: id.trim() } });
    await prisma.review.deleteMany({ where: { productId: id.trim() } });
    await prisma.cart.deleteMany({ where: { productId: id.trim() } });
    await prisma.wishlist.deleteMany({ where: { productId: id.trim() } });

    // Delete the product
    console.log('Deleting product...');
    await prisma.product.delete({ where: { id: id.trim() } });
    
    console.log(`Product ${id} deleted successfully`);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete product - it has related dependencies' });
    }
    
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
}

export async function deleteCloudinaryImage(req, res) {
  const { publicId } = req.params;
  if (!publicId) return res.status(400).json({ error: 'publicId is required' });
  try {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to delete image', details: error.message });
      }
      res.json({ success: true, result });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete image', details: err.message });
  }
}

// Count all products
export async function countProducts() {
  return prisma.product.count();
} 