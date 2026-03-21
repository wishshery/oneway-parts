import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { productSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import { generateProductMeta } from '@/lib/seo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'ACTIVE';
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: any = {};
    if (status !== 'ALL') where.status = status;
    if (category) where.category = { slug: category };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = (() => {
      switch (sort) {
        case 'price-asc': return { price: 'asc' };
        case 'price-desc': return { price: 'desc' };
        case 'name': return { name: 'asc' };
        default: return { createdAt: 'desc' };
      }
    })();

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formatted = products.map((p) => ({
      ...p,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      image: p.images[0]?.url || null,
      rating: p.reviews.length > 0 ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length : null,
      reviewCount: p.reviews.length,
    }));

    return NextResponse.json({
      products: formatted,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Check admin auth
    const body = await req.json();
    const data = productSchema.parse(body);

    const slug = generateSlug(data.name);
    const seo = generateProductMeta({
      name: data.name,
      description: data.description,
      shortDescription: data.shortDescription,
      brandName: data.brandName,
      categoryName: undefined,
    });

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        price: data.price,
        compareAtPrice: data.compareAtPrice || undefined,
        costPrice: data.costPrice || undefined,
        metaTitle: data.metaTitle || seo.title,
        metaDescription: data.metaDescription || seo.description,
        metaKeywords: data.metaKeywords || seo.keywords,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error?.issues) return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
