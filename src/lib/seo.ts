export function generateProductMeta(product: {
  name: string;
  description: string;
  shortDescription?: string;
  brandName?: string;
  categoryName?: string;
}) {
  const title = `${product.name}${product.brandName ? ` by ${product.brandName}` : ''} | ONEWAY Parts`;
  const description =
    product.shortDescription ||
    product.description.substring(0, 155).replace(/\s+\S*$/, '') + '...';
  const keywords = [
    product.name,
    product.brandName,
    product.categoryName,
    'auto parts',
    'car accessories',
    'ONEWAY Parts',
  ]
    .filter(Boolean)
    .join(', ');

  return { title, description, keywords };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  images: { url: string }[];
  sku: string;
  stock: number;
  slug: string;
  brandName?: string;
  rating?: number;
  reviewCount?: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onewayparts.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    sku: product.sku,
    url: `${baseUrl}/products/${product.slug}`,
    brand: product.brandName ? { '@type': 'Brand', name: product.brandName } : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'ONEWAY Parts LLC' },
    },
    aggregateRating:
      product.rating && product.reviewCount
        ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount }
        : undefined,
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: 'ONEWAY Parts LLC',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://onewayparts.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://onewayparts.com'}/images/logo.svg`,
    description: 'Premium auto parts and car accessories with guaranteed fitment.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '16319 West Bellfort St Unit 12',
      addressLocality: 'Sugar Land',
      addressRegion: 'TX',
      postalCode: '77498',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@onewayparts.com',
    },
  };
}
