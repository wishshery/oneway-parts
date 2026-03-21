'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3,
  Menu, X, LogOut, ChevronLeft, Tag, Truck, Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-brand-800 text-white transition-transform lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <Link href="/admin" className="text-xl font-bold">
            <span className="text-accent-light">OW</span> Admin
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold">A</div>
              <span className="hidden sm:inline font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
