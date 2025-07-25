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
    const {
      id,
      name,
      price,
      numericPrice,
      originalPrice,
      images,
      categoryId,
      brandId,
      rating,
      reviewCount,
      soldCount,
      inStock,
      isNew,
      isHot,
      shortDescription,
      features,
      specifications,
    } = req.body;
    const product = await prisma.product.create({
      data: {
        id,
        name,
        price,
        numericPrice,
        originalPrice,
        images,
        categoryId,
        brandId,
        rating,
        reviewCount,
        soldCount,
        inStock,
        isNew,
        isHot,
        shortDescription,
        features: features ? { create: features.map((value) => ({ value })) } : undefined,
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
    
    const {
      name,
      price,
      numericPrice,
      originalPrice,
      images,
      categoryId,
      brandId,
      rating,
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
    } = req.body;
    // Remove old features/specifications and add new ones
    await prisma.feature.deleteMany({ where: { productId: req.params.id } });
    await prisma.specification.deleteMany({ where: { productId: req.params.id } });
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        price,
        numericPrice,
        originalPrice,
        images,
        categoryId,
        brandId,
        rating,
        reviewCount,
        soldCount,
        inStock,
        isNew,
        isHot,
        shortDescription,
        gst,
        offerPrice,
        features: features ? { create: features.map((value) => ({ value })) } : undefined,
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
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete product' });
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