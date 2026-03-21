import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { productSchema } from '@/lib/validations';
import { generateSlug, generateSKU } from '@/lib/utils';
import { generateProductMeta } from '@/lib/seo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const data = parsed.data;
    const slug = generateSlug(data.name);

    // Auto-generate SEO if not provided
    if (!data.metaTitle || !data.metaDescription) {
      const category = data.categoryId ? (await prisma.category.findUnique({ where: { id: data.categoryId } }))?.name : undefined;
      const seo = generateProductMeta({ name: data.name, description: data.description, categoryName: category || undefined });
      data.metaTitle = data.metaTitle || seo.title;
      data.metaDescription = data.metaDescription || seo.description;
      data.metaKeywords = data.metaKeywords || seo.keywords;
    }

    // Auto-generate SKU if not provided
    if (!data.sku) {
      data.sku = generateSKU(data.name, Date.now());
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        costPrice: data.costPrice || null,
        images: body.images?.length
          ? {
              create: body.images.map((url: string, i: number) => ({
                url,
                sortOrder: i,
                isPrimary: i === 0,
              })),
            }
          : undefined,
      },
      include: { images: true, category: true },
    });

    // Create fitments if provided
    if (body.fitments?.length) {
      for (const fitment of body.fitments) {
        if (fitment.modelId && fitment.yearStart && fitment.yearEnd) {
          await prisma.fitment.create({
            data: {
              productId: product.id,
              modelId: fitment.modelId,
              yearStart: parseInt(fitment.yearStart),
              yearEnd: parseInt(fitment.yearEnd),
              trim: fitment.trim || null,
              engine: fitment.engine || null,
            },
          });
        }
      }
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this slug or SKU already exists' }, { status: 409 });
    }
    console.error('Product creation error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Bulk update endpoint
  try {
    const { ids, updates } = await req.json();

    if (!ids?.length || !updates) {
      return NextResponse.json({ error: 'IDs and updates required' }, { status: 400 });
    }

    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: updates,
    });

    return NextResponse.json({ updated: result.count });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
  }
}
