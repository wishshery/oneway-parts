import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        fitments: {
          include: {
            model: {
              include: { make: true },
            },
          },
        },
        reviews: {
          where: { approved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const ratings = product.reviews.map((r) => r.rating);
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

    return NextResponse.json({
      ...product,
      rating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      reviewCount: ratings.length,
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
