// Convert all Product images from String[] to [{ url, publicId }]
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    if (Array.isArray(product.images) && typeof product.images[0] === 'string') {
      const newImages = product.images.map(url => ({ url, publicId: '' }));
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages },
      });
      console.log(`Updated product ${product.id}`);
    }
  }
  console.log('Done!');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
}); 