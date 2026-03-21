/**
 * Payment Abstraction Layer
 *
 * This module provides a unified interface for payment processing.
 * Currently disabled by default via feature flag.
 * Supports Stripe and PayPal when enabled.
 */

export function isPaymentsEnabled(): boolean {
  return process.env.ENABLE_PAYMENTS === 'true';
}

export type PaymentProvider = 'stripe' | 'paypal';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  provider: PaymentProvider;
  clientSecret?: string;
  approvalUrl?: string;
}

export interface CreatePaymentParams {
  amount: number;
  currency?: string;
  orderId: string;
  customerEmail: string;
  description?: string;
  provider?: PaymentProvider;
}

/**
 * Create a payment intent via the configured provider.
 * Returns null if payments are disabled.
 */
export async function createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent | null> {
  if (!isPaymentsEnabled()) return null;

  const provider = params.provider || 'stripe';

  if (provider === 'stripe') {
    return createStripeIntent(params);
  } else if (provider === 'paypal') {
    return createPayPalOrder(params);
  }

  throw new Error(`Unsupported payment provider: ${provider}`);
}

async function createStripeIntent(params: CreatePaymentParams): Promise<PaymentIntent> {
  // When Stripe is enabled, uncomment:
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const intent = await stripe.paymentIntents.create({
  //   amount: Math.round(params.amount * 100),
  //   currency: params.currency || 'usd',
  //   metadata: { orderId: params.orderId },
  //   receipt_email: params.customerEmail,
  //   description: params.description || `Order ${params.orderId}`,
  // });
  // return {
  //   id: intent.id,
  //   amount: params.amount,
  //   currency: params.currency || 'usd',
  //   status: 'pending',
  //   provider: 'stripe',
  //   clientSecret: intent.client_secret,
  // };

  throw new Error('Stripe integration not yet enabled. Set ENABLE_PAYMENTS=true and provide STRIPE_SECRET_KEY.');
}

async function createPayPalOrder(params: CreatePaymentParams): Promise<PaymentIntent> {
  // When PayPal is enabled, uncomment:
  // const paypal = require('@paypal/checkout-server-sdk');
  // ... create PayPal order

  throw new Error('PayPal integration not yet enabled. Set ENABLE_PAYMENTS=true and provide PAYPAL_CLIENT_ID/SECRET.');
}

/**
 * Confirm a payment (verify it was successful).
 */
export async function confirmPayment(intentId: string, provider: PaymentProvider): Promise<boolean> {
  if (!isPaymentsEnabled()) return false;
  // Implementation when payments are enabled
  return false;
}

/**
 * Refund a payment.
 */
export async function refundPayment(intentId: string, provider: PaymentProvider, amount?: number): Promise<boolean> {
  if (!isPaymentsEnabled()) return false;
  // Implementation when payments are enabled
  return false;
}
