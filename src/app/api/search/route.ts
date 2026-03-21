import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '6');

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { brandName: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        sku: true,
        images: { take: 1, select: { url: true } },
        category: { select: { name: true } },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    const results = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      image: p.images[0]?.url || null,
      category: p.category?.name || null,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ results: [] });
  }
}
