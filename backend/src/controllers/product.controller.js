import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        features: true,
        specifications: true,
      },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
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
      image,
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
        image,
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
      image,
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
        image,
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
    res.json(product);
  } catch (err) {
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

// Count all products
export async function countProducts() {
  return prisma.product.count();
} 