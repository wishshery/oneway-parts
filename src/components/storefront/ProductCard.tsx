'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCartStore, useWishlistStore, type CartProduct } from '@/lib/store';
import { formatPrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    image: string;
    sku: string;
    stock: number;
    rating?: number;
    reviewCount?: number;
    brandName?: string;
    category?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const wishlist = useWishlistStore();
  const isWishlisted = wishlist.items.includes(product.id);
  const inStock = product.stock > 0;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      sku: product.sku,
      stock: product.stock,
    };
    addItem(cartProduct);
    toast.success('Added to cart');
    setCartOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle(product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link href={`/products/${product.slug}`} className="group card overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-50 product-image-zoom">
        <Image
          src={product.image || '/images/placeholder.svg'}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">Out of Stock</span>
          </div>
        )}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute right-3 top-3 rounded-full p-2 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity',
            isWishlisted && 'opacity-100 text-red-500'
          )}
        >
          <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
        </button>
      </div>
      <div className="p-4">
        {product.brandName && (
          <p className="text-xs font-medium text-brand-500 uppercase tracking-wider mb-1">{product.brandName}</p>
        )}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-brand-500 transition-colors">
          {product.name}
        </h3>
        {product.rating !== undefined && (
          <div className="mt-1 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn('h-3 w-3', i < Math.round(product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="mt-3 w-full btn-primary py-2.5 text-xs"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
}
