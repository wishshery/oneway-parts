'use client';

import { Package, ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown, AlertTriangle, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

const stats = [
  { name: 'Total Revenue', value: '$24,580.00', change: '+12.5%', up: true, icon: DollarSign, color: 'bg-green-50 text-green-600' },
  { name: 'Orders', value: '156', change: '+8.2%', up: true, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
  { name: 'Products', value: '1,240', change: '+24', up: true, icon: Package, color: 'bg-purple-50 text-purple-600' },
  { name: 'Customers', value: '892', change: '+32', up: true, icon: Users, color: 'bg-amber-50 text-amber-600' },
];

const recentOrders = [
  { id: 'OW-K8F2A1-X9B3', customer: 'John Smith', total: 189.97, status: 'PENDING', date: '2 hours ago' },
  { id: 'OW-M3D7E2-P4K8', customer: 'Sarah Johnson', total: 49.99, status: 'CONFIRMED', date: '5 hours ago' },
  { id: 'OW-R1N5G4-L2M6', customer: 'Mike Williams', total: 324.50, status: 'SHIPPED', date: '1 day ago' },
  { id: 'OW-T6H9C3-W8V1', customer: 'Emily Davis', total: 79.99, status: 'DELIVERED', date: '2 days ago' },
  { id: 'OW-Y2J4B7-Q5F9', customer: 'Robert Brown', total: 159.99, status: 'PROCESSING', date: '2 days ago' },
];

const lowStockProducts = [
  { name: 'Complete Strut Assembly', sku: 'SUS-001', stock: 3, threshold: 5 },
  { name: 'Side Mirror Power Heated', sku: 'BDY-001', stock: 4, threshold: 5 },
  { name: 'Alternator 150A', sku: 'ELC-003', stock: 2, threshold: 5 },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="lg:col-span-2 rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-brand-500 hover:text-brand-600">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-brand-500">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {lowStockProducts.map((product) => (
              <div key={product.sku} className="rounded-lg bg-amber-50 p-4">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-600">{product.stock} remaining</span>
                  <span className="text-xs text-gray-400">Threshold: {product.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
