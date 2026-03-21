'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Check, Truck, Shield, ChevronRight, Minus, Plus, Share2, Car } from 'lucide-react';
import { useCartStore, useWishlistStore, useRecentlyViewed, type CartProduct } from '@/lib/store';
import { formatPrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface ProductDetailProps {
  product: any;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'fitment' | 'reviews'>('description');

  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const wishlist = useWishlistStore();
  const addRecentlyViewed = useRecentlyViewed((s) => s.addProduct);
  const isWishlisted = wishlist.items.includes(product.id);

  const image = product.images?.[selectedImage]?.url || '/images/placeholder.svg';
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  useEffect(() => {
    addRecentlyViewed({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0]?.url || '/images/placeholder.svg',
      sku: product.sku,
      stock: product.stock,
    });
  }, [product]);

  const handleAddToCart = () => {
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0]?.url || '/images/placeholder.svg',
      sku: product.sku,
      stock: product.stock,
    };
    addItem(cartProduct, quantity);
    toast.success(`${product.name} added to cart`);
    setCartOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-500">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-brand-500">Parts</Link>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-500">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 border">
            <Image
              src={image}
              alt={product.images?.[selectedImage]?.alt || product.name}
              fill
              className="object-contain p-8"
              priority
            />
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-gray-50 transition-colors',
                    selectedImage === i ? 'border-brand-500' : 'border-transparent hover:border-gray-300'
                  )}
                >
                  <Image src={img.url} alt={img.alt || ''} fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {product.brandName && (
            <p className="text-sm font-medium text-brand-500 uppercase tracking-wider">{product.brandName}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn('h-4 w-4', i < Math.round(product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} reviews)</span>
            <span className="text-sm text-gray-300">|</span>
            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-medium text-red-600">
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className="mt-4">
            {inStock ? (
              <p className={cn('flex items-center gap-1 text-sm font-medium', lowStock ? 'text-amber-600' : 'text-green-600')}>
                <Check className="h-4 w-4" />
                {lowStock ? `Only ${product.stock} left in stock` : 'In Stock'}
              </p>
            ) : (
              <p className="text-sm font-medium text-red-600">Out of Stock</p>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-gray-600">{product.shortDescription}</p>
          )}

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-lg border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[48px] text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 hover:bg-gray-50"
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary flex-1 py-4 text-base"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>

            <button
              onClick={() => { wishlist.toggle(product.id); toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
              className={cn(
                'rounded-lg border p-3 transition-colors',
                isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'hover:bg-gray-50 text-gray-400'
              )}
            >
              <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />
            </button>
          </div>

          {/* Trust signals */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
              <Truck className="h-5 w-5 text-brand-500" />
              <span className="text-xs text-gray-600">Free shipping over $75</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
              <Shield className="h-5 w-5 text-brand-500" />
              <span className="text-xs text-gray-600">Fitment guaranteed</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-t pt-6">
            <div className="flex gap-6 border-b">
              {(['description', 'fitment', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'pb-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px',
                    activeTab === tab ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab === 'fitment' ? 'Vehicle Fitment' : tab}
                  {tab === 'reviews' && ` (${product.reviewCount})`}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === 'description' && (
                <div className="prose prose-sm max-w-none text-gray-600">
                  {product.description.split('\n\n').map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}

              {activeTab === 'fitment' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="h-5 w-5 text-brand-500" />
                    <h3 className="font-semibold text-gray-900">Compatible Vehicles</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Make</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Model</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Years</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Trim</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Engine</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.fitments?.map((f: any, i: number) => (
                          <tr key={i} className="border-b">
                            <td className="px-4 py-2">{f.model.make.name}</td>
                            <td className="px-4 py-2">{f.model.name}</td>
                            <td className="px-4 py-2">{f.yearStart}-{f.yearEnd}</td>
                            <td className="px-4 py-2">{f.trim || 'All'}</td>
                            <td className="px-4 py-2">{f.engine || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-8 text-gray-500">
                  <p className="font-medium">Customer reviews coming soon</p>
                  <p className="text-sm mt-1">Be the first to review this product</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
