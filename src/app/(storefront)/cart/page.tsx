'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const total = subtotal();
  const shippingEstimate = total > 75 ? 0 : 9.99;
  const taxEstimate = total * 0.0825; // Texas sales tax

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-20 w-20 text-gray-200" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Looks like you haven't added any parts yet.</p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 rounded-xl border p-4">
              <div className="relative h-24 w-24 flex-shrink-0 rounded-lg bg-gray-50 overflow-hidden">
                <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-2" />
              </div>
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/products/${item.product.slug}`} className="font-medium text-gray-900 hover:text-brand-500">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">SKU: {item.product.sku}</p>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="p-1 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 hover:bg-gray-50">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[40px] text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-lg font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <Link href="/products" className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="rounded-xl border bg-gray-50 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{shippingEstimate === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingEstimate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (est.)</span>
                <span className="font-medium">{formatPrice(taxEstimate)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-base font-bold">Total</span>
                <span className="text-base font-bold">{formatPrice(total + shippingEstimate + taxEstimate)}</span>
              </div>
            </div>
            {shippingEstimate > 0 && (
              <p className="mt-3 text-xs text-gray-500">Add {formatPrice(75 - total)} more for free shipping</p>
            )}
            <Link href="/checkout" className="btn-primary mt-6 w-full py-3">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
