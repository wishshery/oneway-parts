import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkoutSchema } from '@/lib/validations';
import { generateOrderNumber } from '@/lib/utils';
import { sendEmail, orderConfirmationEmail } from '@/lib/email';
import { createPaymentIntent, isPaymentsEnabled } from '@/lib/payment';

export async function GET(req: NextRequest) {
  try {
    // TODO: Check admin auth
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { items: { include: { product: { select: { name: true, images: { take: 1 } } } } } },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders: orders.map((o) => ({
        ...o,
        subtotal: Number(o.subtotal),
        shippingCost: Number(o.shippingCost),
        tax: Number(o.tax),
        total: Number(o.total),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customerData = checkoutSchema.parse(body);
    const { items, subtotal, shippingCost, tax, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerData.customerName,
        customerEmail: customerData.customerEmail,
        customerPhone: customerData.customerPhone,
        shippingStreet: customerData.shippingStreet,
        shippingCity: customerData.shippingCity,
        shippingState: customerData.shippingState,
        shippingZip: customerData.shippingZip,
        shippingCountry: customerData.shippingCountry,
        notes: customerData.notes,
        subtotal,
        shippingCost,
        tax,
        total,
        status: 'PENDING',
        paymentStatus: isPaymentsEnabled() ? 'PENDING' : 'UNPAID',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Send confirmation email
    try {
      const emailContent = orderConfirmationEmail({
        orderNumber,
        customerName: customerData.customerName,
        items: items.map((i: any) => ({ name: i.name || 'Product', quantity: i.quantity, unitPrice: i.unitPrice })),
        subtotal,
        shippingCost,
        tax,
        total,
      });
      await sendEmail({ to: customerData.customerEmail, ...emailContent });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    // If payments enabled, create payment intent
    let paymentIntent = null;
    if (isPaymentsEnabled()) {
      paymentIntent = await createPaymentIntent({
        amount: total,
        orderId: order.id,
        customerEmail: customerData.customerEmail,
        description: `Order ${orderNumber}`,
      });
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      paymentIntent: paymentIntent ? { clientSecret: paymentIntent.clientSecret } : null,
    }, { status: 201 });
  } catch (error: any) {
    if (error?.issues) return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
