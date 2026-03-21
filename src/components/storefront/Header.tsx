'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, User, Heart, Phone, MapPin, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import SearchBar from './SearchBar';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItemCount = useCartStore((s) => s.itemCount());
  const setCartOpen = useCartStore((s) => s.setOpen);
  const isCartOpen = useCartStore((s) => s.isOpen);

  const categories = [
    { name: 'Brakes', slug: 'brakes' },
    { name: 'Engine Parts', slug: 'engine-parts' },
    { name: 'Filters', slug: 'filters' },
    { name: 'Lighting', slug: 'lighting' },
    { name: 'Suspension', slug: 'suspension' },
    { name: 'Electrical', slug: 'electrical' },
    { name: 'Body Parts', slug: 'body-parts' },
    { name: 'Interior', slug: 'interior' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="hidden sm:block bg-brand-800 text-white text-xs">
        <div className="container mx-auto px-4 flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> (713) 555-1234</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Sugar Land, TX</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Free Shipping on Orders Over $75</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 -ml-2">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold">
                <span className="text-brand-500">ONEWAY</span>
                <span className="text-gray-700"> Parts</span>
              </span>
            </Link>

            {/* Search - desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="lg:hidden p-2 text-gray-600 hover:text-brand-500">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/wishlist" className="hidden sm:flex p-2 text-gray-600 hover:text-brand-500">
                <Heart className="h-5 w-5" />
              </Link>
              <Link href="/auth/login" className="hidden sm:flex p-2 text-gray-600 hover:text-brand-500">
                <User className="h-5 w-5" />
              </Link>
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-600 hover:text-brand-500">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category nav - desktop */}
        <nav className="hidden lg:block border-t bg-gray-50">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-1 overflow-x-auto py-2">
              <li>
                <Link href="/products" className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-brand-500 transition-colors">
                  All Parts
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-brand-500 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile search */}
        {searchOpen && (
          <div className="lg:hidden border-t p-4">
            <SearchBar onSelect={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white absolute inset-x-0 top-full shadow-lg animate-slide-down">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">All Parts</Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/products?category=${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                  {cat.name}
                </Link>
              ))}
              <div className="border-t pt-2 mt-2">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Contact Us</Link>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Sign In</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
