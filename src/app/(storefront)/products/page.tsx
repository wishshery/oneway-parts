'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, Grid3X3, LayoutList, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/storefront/ProductCard';
import VehicleSelector from '@/components/storefront/VehicleSelector';
import { cn } from '@/lib/utils';

// Demo products for the catalog
const demoProducts = [
  { id: '1', name: 'Premium Ceramic Brake Pads - Front', slug: 'premium-ceramic-brake-pads-front', price: 49.99, compareAtPrice: 69.99, image: '/images/placeholder.svg', sku: 'BRK-001', stock: 45, rating: 4.8, reviewCount: 124, brandName: 'StopTech', category: 'Brakes' },
  { id: '2', name: 'High-Performance Oil Filter', slug: 'high-performance-oil-filter', price: 12.99, compareAtPrice: null, image: '/images/placeholder.svg', sku: 'FLT-001', stock: 200, rating: 4.6, reviewCount: 89, brandName: 'K&N', category: 'Filters' },
  { id: '3', name: 'LED Headlight Bulbs H11 6000K', slug: 'led-headlight-bulbs-h11-6000k', price: 34.99, compareAtPrice: 49.99, image: '/images/placeholder.svg', sku: 'LGT-001', stock: 78, rating: 4.5, reviewCount: 67, brandName: 'Auxbeam', category: 'Lighting' },
  { id: '4', name: 'Complete Strut Assembly - Front Left', slug: 'complete-strut-assembly-front-left', price: 189.99, compareAtPrice: 249.99, image: '/images/placeholder.svg', sku: 'SUS-001', stock: 3, rating: 4.9, reviewCount: 45, brandName: 'Monroe', category: 'Suspension' },
  { id: '5', name: 'Cabin Air Filter - Activated Carbon', slug: 'cabin-air-filter-activated-carbon', price: 18.99, compareAtPrice: null, image: '/images/placeholder.svg', sku: 'FLT-002', stock: 150, rating: 4.3, reviewCount: 56, brandName: 'FRAM', category: 'Filters' },
  { id: '6', name: 'Alternator 150A Remanufactured', slug: 'alternator-150a-remanufactured', price: 219.99, compareAtPrice: 299.99, image: '/images/placeholder.svg', sku: 'ELC-001', stock: 12, rating: 4.7, reviewCount: 34, brandName: 'Bosch', category: 'Electrical' },
  { id: '7', name: 'Front Bumper Cover - Primed', slug: 'front-bumper-cover-primed', price: 149.99, compareAtPrice: null, image: '/images/placeholder.svg', sku: 'BDY-001', stock: 8, rating: 4.4, reviewCount: 23, brandName: 'Replace', category: 'Body Parts' },
  { id: '8', name: 'Serpentine Belt - Multi-Rib', slug: 'serpentine-belt-multi-rib', price: 24.99, compareAtPrice: 34.99, image: '/images/placeholder.svg', sku: 'ENG-001', stock: 95, rating: 4.6, reviewCount: 78, brandName: 'Gates', category: 'Engine Parts' },
  { id: '9', name: 'Brake Rotor Set - Drilled & Slotted', slug: 'brake-rotor-set-drilled-slotted', price: 89.99, compareAtPrice: 129.99, image: '/images/placeholder.svg', sku: 'BRK-002', stock: 34, rating: 4.8, reviewCount: 92, brandName: 'PowerStop', category: 'Brakes' },
  { id: '10', name: 'All-Weather Floor Mats Set', slug: 'all-weather-floor-mats-set', price: 59.99, compareAtPrice: null, image: '/images/placeholder.svg', sku: 'INT-001', stock: 60, rating: 4.7, reviewCount: 145, brandName: 'WeatherTech', category: 'Interior' },
  { id: '11', name: 'Ignition Coil Pack', slug: 'ignition-coil-pack', price: 39.99, compareAtPrice: 54.99, image: '/images/placeholder.svg', sku: 'ENG-002', stock: 42, rating: 4.5, reviewCount: 63, brandName: 'Delphi', category: 'Engine Parts' },
  { id: '12', name: 'Tail Light Assembly - LED', slug: 'tail-light-assembly-led', price: 79.99, compareAtPrice: 109.99, image: '/images/placeholder.svg', sku: 'LGT-002', stock: 25, rating: 4.6, reviewCount: 41, brandName: 'Spyder', category: 'Lighting' },
];

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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState(true);

  const searchQuery = searchParams.get('search') || '';

  let filtered = demoProducts;

  if (searchQuery) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (selectedCategory !== 'All') {
    const slug = selectedCategory.toLowerCase().replace(/\s+/g, '-');
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase() || p.category.toLowerCase().replace(/\s+/g, '-') === slug
    );
  }

  filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));

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
          <p className="text-sm text-gray-500 mt-1">{filtered.length} products found</p>
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
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="input-field w-20 text-sm py-2"
                placeholder="Min"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="input-field w-20 text-sm py-2"
                placeholder="Max"
              />
            </div>
          </div>

          {selectedCategory !== 'All' && (
            <button
              onClick={() => { setSelectedCategory('All'); setPriceRange([0, 500]); }}
              className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600"
            >
              <X className="h-3 w-3" /> Clear filters
            </button>
          )}
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-medium text-gray-900">No products found</p>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className={cn(
              'grid gap-4',
              gridView ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            )}>
              {filtered.map((product) => (
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
