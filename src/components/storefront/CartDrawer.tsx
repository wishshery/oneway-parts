'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice, cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const total = subtotal();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={cn(
        'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 flex flex-col',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5" />
            Cart ({items.length})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
              <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
              <p className="mt-1 text-sm text-gray-500">Browse our catalog to find the parts you need.</p>
              <Link href="/products" onClick={onClose} className="btn-primary mt-6">
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 rounded-lg border p-3">
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-md bg-gray-50 overflow-hidden">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-1" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <Link href={`/products/${item.product.slug}`} onClick={onClose} className="text-sm font-medium text-gray-900 hover:text-brand-500 line-clamp-2">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">SKU: {item.product.sku}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[28px] text-center text-xs font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50" disabled={item.quantity >= item.product.stock}>
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.product.id)} className="p-1 text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping and taxes calculated at checkout</p>
            <Link href="/checkout" onClick={onClose} className="btn-primary w-full py-3">
              Proceed to Checkout
            </Link>
            <Link href="/cart" onClick={onClose} className="btn-secondary w-full">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
