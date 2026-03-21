'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice, STATES } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    shippingStreet: '', shippingCity: '', shippingState: 'TX', shippingZip: '', notes: '',
  });

  const total = subtotal();
  const shipping = total > 75 ? 0 : 9.99;
  const tax = total * 0.0825;
  const grandTotal = total + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity, unitPrice: i.product.price })),
          subtotal: total,
          shippingCost: shipping,
          tax,
          total: grandTotal,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderNumber(data.orderNumber);
        setOrderPlaced(true);
        clearCart();
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="mt-2 text-gray-500">Thank you for your order. We'll email you a confirmation shortly.</p>
        <div className="mt-6 rounded-xl bg-gray-50 p-6">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-2xl font-bold text-brand-500 mt-1">{orderNumber}</p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Our team will review your order and reach out to confirm details and arrange payment.
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <Link href="/products" className="btn-primary mt-6 inline-flex">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Checkout form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input name="customerName" value={form.customerName} onChange={handleChange} required className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange} required className="input-field" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="customerPhone" type="tel" value={form.customerPhone} onChange={handleChange} className="input-field" placeholder="(555) 123-4567" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input name="shippingStreet" value={form.shippingStreet} onChange={handleChange} required className="input-field" placeholder="123 Main St" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input name="shippingCity" value={form.shippingCity} onChange={handleChange} required className="input-field" placeholder="Sugar Land" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select name="shippingState" value={form.shippingState} onChange={handleChange} required className="input-field">
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <input name="shippingZip" value={form.shippingZip} onChange={handleChange} required className="input-field" placeholder="77498" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl border p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Notes</h2>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input-field" placeholder="Any special instructions? (optional)" />
            </div>

            {/* Payment notice */}
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-6">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">Payment on Confirmation</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Online payments are not yet enabled. After you place your order, our team will contact you to confirm details and arrange payment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="rounded-xl border bg-gray-50 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative h-14 w-14 flex-shrink-0 rounded bg-white border">
                      <Image src={item.product.image} alt="" fill className="object-contain p-1" />
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400">{formatPrice(item.product.price)} x {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tax (est.)</span><span>{formatPrice(tax)}</span></div>
                <div className="border-t pt-2 flex justify-between text-base font-bold"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary mt-6 w-full py-4 text-base">
                <Lock className="h-4 w-4" />
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
              <p className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> Secure checkout
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
