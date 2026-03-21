import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://onewayparts.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  // In production, fetch product slugs from DB:
  // const products = await prisma.product.findMany({
  //   where: { status: 'ACTIVE' },
  //   select: { slug: true, updatedAt: true },
  // });
  // const productPages = products.map((p) => ({
  //   url: `${BASE_URL}/products/${p.slug}`,
  //   lastModified: p.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }));

  return [...staticPages];
}
