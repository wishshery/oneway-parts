import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateSlug, generateSKU } from '@/lib/utils';
import { generateProductMeta } from '@/lib/seo';

/**
 * CSV Bulk Import Endpoint
 *
 * Expected CSV columns:
 * name, description, price, compareAtPrice, stock, sku, categorySlug, brandName, status
 *
 * Uses PapaParse on the client side; this endpoint receives parsed rows.
 */
export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'No products provided' }, { status: 400 });
    }

    const results = { created: 0, failed: 0, errors: [] as string[] };

    for (const row of products) {
      try {
        const slug = generateSlug(row.name);
        const sku = row.sku || generateSKU(row.name, 0);
        const seo = generateProductMeta({ name: row.name, description: row.description || '', categoryName: row.categorySlug });

        let categoryId: string | null = null;
        if (row.categorySlug) {
          const cat = await prisma.category.findUnique({ where: { slug: row.categorySlug } });
          categoryId = cat?.id || null;
        }

        await prisma.product.create({
          data: {
            name: row.name,
            slug,
            sku,
            description: row.description || '',
            price: parseFloat(row.price),
            compareAtPrice: row.compareAtPrice ? parseFloat(row.compareAtPrice) : null,
            stock: parseInt(row.stock) || 0,
            status: row.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
            brandName: row.brandName || null,
            categoryId,
            metaTitle: seo.title,
            metaDescription: seo.description,
            metaKeywords: seo.keywords,
          },
        });

        results.created++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`Row "${row.name}": ${err.message}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json({ error: 'Failed to import products' }, { status: 500 });
  }
}
