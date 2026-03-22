'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, Grid3X3, LayoutList, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/storefront/ProductCard';
import VehicleSelector from '@/components/storefront/VehicleSelector';
import { cn } from '@/lib/utils';

const categories = ['All', 'Brakes', 'Engine Parts', 'Filters', 'Lighting', 'Suspension', 'Electrical', 'Body Parts', 'Interior'];
const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Best Selling', value: 'popular' },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('limit', '50');
        params.set('sort', sortBy);
        if (selectedCategory !== 'All') {
          params.set('category', selectedCategory.toLowerCase().replace(/\s+/g, '-'));
        }
        if (searchQuery) {
          params.set('search', searchQuery);
        }
        if (minPrice > 0) params.set('minPrice', String(minPrice));
        if (maxPrice < 500) params.set('maxPrice', String(maxPrice));

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (data.products) {
          setProducts(data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
            image: p.image || '/images/placeholder.svg',
            sku: p.sku,
            stock: p.stock,
            rating: p.rating != null ? Number(p.rating) : undefined,
            reviewCount: p.reviewCount || 0,
            brandName: p.brandName,
            category: p.category?.name || '',
          })));
          setTotal(data.pagination?.total || data.products.length);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, sortBy, searchQuery, minPrice, maxPrice]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Vehicle Selector */}
      <div className="mb-6">
        <VehicleSelector compact />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Results for "${searchQuery}"` : selectedCategory === 'All' ? 'All Parts' : selectedCategory}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="sm:hidden btn-secondary py-2 px-3 text-xs">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <div className="hidden sm:flex items-center gap-1 border rounded-lg">
            <button onClick={() => setGridView(true)} className={cn('p-2 rounded-l-lg', gridView && 'bg-gray-100')}>
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button onClick={() => setGridView(false)} className={cn('p-2 rounded-r-lg', !gridView && 'bg-gray-100')}>
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-auto text-sm py-2">
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className={cn('w-64 flex-shrink-0 space-y-6', showFilters ? 'block' : 'hidden sm:block')}>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'block w-full text-left rounded-lg px-3 py-2 text-sm transition-colors',
                    selectedCategory === cat ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="input-field w-20 text-sm py-2"
                placeholder="Min"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="input-field w-20 text-sm py-2"
                placeholder="Max"
              />
            </div>
          </div>

          {selectedCategory !== 'All' && (
            <button
              onClick={() => { setSelectedCategory('All'); setMinPrice(0); setMaxPrice(500); }}
              className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600"
            >
              <X className="h-3 w-3" /> Clear filters
            </button>
          )}
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
              <p className="mt-4 text-sm text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-medium text-gray-900">No products found</p>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className={cn(
              'grid gap-4',
              gridView ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            )}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><p>Loading products...</p></div>}>
      <CatalogContent />
    </Suspense>
  );
}
