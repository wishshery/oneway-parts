import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, slug: true, sku: true, images: { take: 1, select: { url: true } } },
            },
          },
        },
      },
    });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, paymentStatus } = body;

    const data: any = {};
    if (status) data.status = status;
    if (paymentStatus) {
      data.paymentStatus = paymentStatus;
      if (paymentStatus === 'PAID') data.paidAt = new Date();
    }

    const order = await prisma.order.update({ where: { id: params.id }, data });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
