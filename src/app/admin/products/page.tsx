'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Upload, Download, Edit, Trash2, Eye, MoreHorizontal, Filter } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';

const demoProducts = [
  { id: '1', name: 'Premium Ceramic Brake Pads - Front', sku: 'BRK-001', price: 49.99, stock: 45, status: 'ACTIVE', category: 'Brakes', image: '/images/placeholder.svg' },
  { id: '2', name: 'High-Performance Oil Filter', sku: 'FLT-001', price: 12.99, stock: 200, status: 'ACTIVE', category: 'Filters', image: '/images/placeholder.svg' },
  { id: '3', name: 'LED Headlight Bulbs H11 6000K', sku: 'LGT-001', price: 34.99, stock: 78, status: 'ACTIVE', category: 'Lighting', image: '/images/placeholder.svg' },
  { id: '4', name: 'Complete Strut Assembly - Front Left', sku: 'SUS-001', price: 189.99, stock: 3, status: 'ACTIVE', category: 'Suspension', image: '/images/placeholder.svg' },
  { id: '5', name: 'Cabin Air Filter - Activated Carbon', sku: 'FLT-002', price: 18.99, stock: 150, status: 'DRAFT', category: 'Filters', image: '/images/placeholder.svg' },
  { id: '6', name: 'Alternator 150A Remanufactured', sku: 'ELC-001', price: 219.99, stock: 2, status: 'ACTIVE', category: 'Electrical', image: '/images/placeholder.svg' },
  { id: '7', name: 'Front Bumper Cover - Primed', sku: 'BDY-001', price: 149.99, stock: 8, status: 'DRAFT', category: 'Body Parts', image: '/images/placeholder.svg' },
  { id: '8', name: 'Serpentine Belt - Multi-Rib', sku: 'ENG-001', price: 24.99, stock: 95, status: 'ACTIVE', category: 'Engine Parts', image: '/images/placeholder.svg' },
];

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  ARCHIVED: 'bg-red-100 text-red-700',
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  let filtered = demoProducts;
  if (search) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
  }
  if (statusFilter !== 'ALL') {
    filtered = filtered.filter((p) => p.status === statusFilter);
  }

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedProducts((prev) => prev.length === filtered.length ? [] : filtered.map((p) => p.id));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{demoProducts.length} total products</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm py-2">
            <Upload className="h-4 w-4" /> CSV Import
          </button>
          <button className="btn-secondary text-sm py-2">
            <Download className="h-4 w-4" /> Export
          </button>
          <Link href="/admin/products/new" className="btn-primary text-sm py-2">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-10 py-2"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto py-2">
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Bulk actions */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-brand-50 p-3 mb-4">
          <span className="text-sm font-medium text-brand-700">{selectedProducts.length} selected</span>
          <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">Bulk Edit</button>
          <button className="text-sm text-red-600 hover:text-red-700 font-medium">Delete Selected</button>
        </div>
      )}

      {/* Products table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" onChange={toggleAll} checked={selectedProducts.length === filtered.length && filtered.length > 0} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Price</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Stock</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => toggleSelect(product.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="h-10 w-10 rounded bg-gray-100 object-contain p-1" />
                      <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{product.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{product.category}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('text-sm font-medium', product.stock <= 5 ? 'text-red-600' : 'text-gray-700')}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`badge ${statusStyles[product.status]}`}>{product.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-brand-500" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-brand-500" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
