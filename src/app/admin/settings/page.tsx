'use client';

import { useState } from 'react';
import { Save, CreditCard, Mail, Globe, Bell, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'ONEWAY Parts LLC',
    siteUrl: 'https://onewayparts.com',
    contactEmail: 'info@onewayparts.com',
    phone: '(713) 555-1234',
    address: '16319 West Bellfort St Unit 12, Sugar Land, TX 77498',
    whatsappNumber: '17135551234',
    enablePayments: false,
    enableReviews: true,
    enableWishlist: true,
    enableAiRecommendations: false,
    stripeKey: '',
    paypalClientId: '',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    lowStockNotifications: true,
    orderNotifications: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const toggleFlag = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !(prev as any)[key] }));
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'features', label: 'Feature Flags', icon: Shield },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your store configuration</p>
        </div>
        <button onClick={handleSave} className="btn-primary">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab.id ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-2xl">
        {activeTab === 'general' && (
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Store Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input name="siteName" value={settings.siteName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input name="siteUrl" value={settings.siteUrl} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input name="phone" value={settings.phone} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input name="address" value={settings.address} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} className="input-field" />
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Payment Gateway</h2>
                <button
                  onClick={() => toggleFlag('enablePayments')}
                  className={cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors', settings.enablePayments ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}
                >
                  {settings.enablePayments ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                  {settings.enablePayments ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              {!settings.enablePayments && (
                <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700 mb-4">
                  Payments are currently disabled. Orders will be placed without payment and confirmed manually.
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Secret Key</label>
                  <input name="stripeKey" type="password" value={settings.stripeKey} onChange={handleChange} className="input-field" placeholder="sk_live_..." disabled={!settings.enablePayments} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Client ID</label>
                  <input name="paypalClientId" type="password" value={settings.paypalClientId} onChange={handleChange} className="input-field" placeholder="Your PayPal client ID" disabled={!settings.enablePayments} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">SMTP Configuration</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input name="smtpHost" value={settings.smtpHost} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                <input name="smtpPort" value={settings.smtpPort} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input name="smtpUser" value={settings.smtpUser} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input name="smtpPassword" type="password" value={settings.smtpPassword} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
            <label className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Low Stock Alerts</p>
                <p className="text-xs text-gray-500">Get notified when products fall below threshold</p>
              </div>
              <input type="checkbox" name="lowStockNotifications" checked={settings.lowStockNotifications} onChange={handleChange} className="rounded" />
            </label>
            <label className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">New Order Notifications</p>
                <p className="text-xs text-gray-500">Email when a new order is placed</p>
              </div>
              <input type="checkbox" name="orderNotifications" checked={settings.orderNotifications} onChange={handleChange} className="rounded" />
            </label>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Feature Flags</h2>
            <p className="text-sm text-gray-500">Toggle features on or off without redeploying.</p>
            {[
              { key: 'enablePayments', name: 'Online Payments', desc: 'Enable Stripe/PayPal checkout' },
              { key: 'enableReviews', name: 'Product Reviews', desc: 'Allow customers to leave reviews' },
              { key: 'enableWishlist', name: 'Wishlist', desc: 'Allow customers to save items to wishlist' },
              { key: 'enableAiRecommendations', name: 'AI Recommendations', desc: 'Show AI-powered product suggestions' },
            ].map((flag) => (
              <div key={flag.key} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{flag.name}</p>
                  <p className="text-xs text-gray-500">{flag.desc}</p>
                </div>
                <button
                  onClick={() => toggleFlag(flag.key)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                    (settings as any)[flag.key] ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {(settings as any)[flag.key] ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
