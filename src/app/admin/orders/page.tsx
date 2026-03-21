'use client';

import { useState } from 'react';
import { Search, Download, Eye, Filter, ChevronDown, RefreshCw } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';

const demoOrders = [
  { id: 'OW-K8F2A1-X9B3', customer: 'John Smith', email: 'john@example.com', items: 3, total: 189.97, status: 'PENDING', paymentStatus: 'UNPAID', date: '2024-03-18 14:30' },
  { id: 'OW-M3D7E2-P4K8', customer: 'Sarah Johnson', email: 'sarah@example.com', items: 1, total: 49.99, status: 'CONFIRMED', paymentStatus: 'UNPAID', date: '2024-03-18 10:15' },
  { id: 'OW-R1N5G4-L2M6', customer: 'Mike Williams', email: 'mike@example.com', items: 5, total: 324.50, status: 'SHIPPED', paymentStatus: 'PAID', date: '2024-03-17 09:45' },
  { id: 'OW-T6H9C3-W8V1', customer: 'Emily Davis', email: 'emily@example.com', items: 2, total: 79.99, status: 'DELIVERED', paymentStatus: 'PAID', date: '2024-03-16 16:20' },
  { id: 'OW-Y2J4B7-Q5F9', customer: 'Robert Brown', email: 'robert@example.com', items: 4, total: 159.99, status: 'PROCESSING', paymentStatus: 'UNPAID', date: '2024-03-16 11:00' },
  { id: 'OW-A9C1D5-E3F7', customer: 'Lisa Chen', email: 'lisa@example.com', items: 1, total: 219.99, status: 'PENDING', paymentStatus: 'UNPAID', date: '2024-03-15 14:10' },
  { id: 'OW-B4G6H8-I2J0', customer: 'David Kim', email: 'david@example.com', items: 2, total: 94.98, status: 'CANCELLED', paymentStatus: 'REFUNDED', date: '2024-03-14 08:30' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
};

const paymentColors: Record<string, string> = {
  UNPAID: 'bg-amber-100 text-amber-700',
  PAID: 'bg-green-100 text-green-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
  FAILED: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  let filtered = demoOrders;
  if (search) {
    filtered = filtered.filter(
      (o) => o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (statusFilter !== 'ALL') {
    filtered = filtered.filter((o) => o.status === statusFilter);
  }

  const handleExport = () => {
    // CSV export
    const headers = 'Order,Customer,Email,Items,Total,Status,Payment,Date\n';
    const rows = demoOrders.map((o) => `${o.id},${o.customer},${o.email},${o.items},${o.total},${o.status},${o.paymentStatus},${o.date}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oneway-orders.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{demoOrders.length} total orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-secondary text-sm py-2">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button className="btn-secondary text-sm py-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="input-field pl-10 py-2" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto py-2">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Customer</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Items</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Payment</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-brand-500">{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">{order.items}</td>
                  <td className="px-4 py-3 text-right text-sm font-bold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      defaultValue={order.status}
                      className={cn('badge cursor-pointer border-0 text-xs', statusColors[order.status])}
                      onChange={(e) => {
                        // In production: update via API
                        console.log('Update order', order.id, 'to', e.target.value);
                      }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`badge ${paymentColors[order.paymentStatus]}`}>{order.paymentStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500">{order.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-brand-500" title="View Details">
                      <Eye className="h-4 w-4" />
                    </button>
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
