import { Metadata } from 'next';
import ProductDetail from './ProductDetail';

// Demo product data (in production, fetch from DB)
const demoProduct = {
  id: '1',
  name: 'Premium Ceramic Brake Pads - Front',
  slug: 'premium-ceramic-brake-pads-front',
  sku: 'BRK-001',
  description: 'High-performance ceramic brake pads designed for everyday driving and spirited stops. These premium pads deliver excellent stopping power with minimal dust and noise.\n\nFeaturing advanced ceramic compound technology, these pads provide consistent braking performance across a wide temperature range. The chamfered and slotted design ensures quiet operation, while the premium shim reduces vibration and noise.\n\nDesigned as a direct replacement for OEM pads, installation is straightforward with no modifications required. Each set includes hardware and lubricant for a complete installation.',
  shortDescription: 'High-performance ceramic brake pads with low dust, low noise, and excellent stopping power.',
  price: 49.99,
  compareAtPrice: 69.99,
  costPrice: 25.00,
  stock: 45,
  lowStockThreshold: 5,
  status: 'ACTIVE',
  featured: true,
  brandName: 'StopTech',
  rating: 4.8,
  reviewCount: 124,
  category: { name: 'Brakes', slug: 'brakes' },
  images: [
    { id: 'img1', url: '/images/placeholder.svg', alt: 'Premium Ceramic Brake Pads - Front view', sortOrder: 0, isPrimary: true },
    { id: 'img2', url: '/images/placeholder.svg', alt: 'Premium Ceramic Brake Pads - Side view', sortOrder: 1, isPrimary: false },
    { id: 'img3', url: '/images/placeholder.svg', alt: 'Premium Ceramic Brake Pads - Box contents', sortOrder: 2, isPrimary: false },
  ],
  fitments: [
    { model: { name: 'Camry', make: { name: 'Toyota' } }, yearStart: 2018, yearEnd: 2024, trim: 'All', engine: '2.5L / 3.5L' },
    { model: { name: 'Accord', make: { name: 'Honda' } }, yearStart: 2018, yearEnd: 2024, trim: 'All', engine: '1.5T / 2.0T' },
    { model: { name: 'Altima', make: { name: 'Nissan' } }, yearStart: 2019, yearEnd: 2024, trim: 'All', engine: '2.5L' },
    { model: { name: 'Civic', make: { name: 'Honda' } }, yearStart: 2016, yearEnd: 2024, trim: 'All', engine: '1.5T / 2.0L' },
  ],
  metaTitle: 'Premium Ceramic Brake Pads - Front | ONEWAY Parts',
  metaDescription: 'Shop StopTech premium ceramic brake pads with low dust and noise. Guaranteed fitment for Toyota Camry, Honda Accord, and more.',
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // In production: fetch product by slug
  return {
    title: demoProduct.metaTitle || `${demoProduct.name} | ONEWAY Parts`,
    description: demoProduct.metaDescription || demoProduct.shortDescription,
    openGraph: {
      title: demoProduct.name,
      description: demoProduct.shortDescription || demoProduct.description.substring(0, 155),
      images: demoProduct.images.map((img) => ({ url: img.url })),
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  // In production: const product = await prisma.product.findUnique({ where: { slug: params.slug }, include: { ... } });
  return <ProductDetail product={demoProduct} />;
}
