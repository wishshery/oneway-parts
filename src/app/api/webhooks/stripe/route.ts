import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isPaymentsEnabled } from '@/lib/payment';

/**
 * Stripe Webhook Handler (ready to enable)
 *
 * When payments are enabled, this handles:
 * - payment_intent.succeeded → Mark order as PAID
 * - payment_intent.payment_failed → Mark order as FAILED
 * - charge.refunded → Mark order as REFUNDED
 */
export async function POST(req: NextRequest) {
  if (!isPaymentsEnabled()) {
    return NextResponse.json({ received: true, message: 'Payments disabled' });
  }

  try {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // When Stripe is enabled:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    //
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const intent = event.data.object;
    //     await prisma.order.updateMany({
    //       where: { paymentIntentId: intent.id },
    //       data: { paymentStatus: 'PAID', status: 'CONFIRMED', paidAt: new Date() },
    //     });
    //     break;
    //   case 'payment_intent.payment_failed':
    //     await prisma.order.updateMany({
    //       where: { paymentIntentId: event.data.object.id },
    //       data: { paymentStatus: 'FAILED' },
    //     });
    //     break;
    // }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
