'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '', price: '', compareAtPrice: '',
    costPrice: '', stock: '0', lowStockThreshold: '5', sku: '', categoryId: '',
    brandName: '', status: 'DRAFT', featured: false,
    metaTitle: '', metaDescription: '', metaKeywords: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [fitments, setFitments] = useState<{ makeId: string; modelId: string; yearStart: string; yearEnd: string; trim: string; engine: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  // Fetch categories from DB
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data); })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 10));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const autoGenerateSEO = () => {
    if (!form.name) return toast.error('Enter a product name first');
    setForm((p) => ({
      ...p,
      metaTitle: `${p.name}${p.brandName ? ` by ${p.brandName}` : ''} | ONEWAY Parts`,
      metaDescription: p.shortDescription || p.description.substring(0, 155),
      metaKeywords: [p.name, p.brandName, 'auto parts', 'car accessories', 'ONEWAY Parts'].filter(Boolean).join(', '),
    }));
    toast.success('SEO metadata generated!');
  };

  const addFitment = () => {
    setFitments((prev) => [...prev, { makeId: '', modelId: '', yearStart: '', yearEnd: '', trim: '', engine: '' }]);
  };

  const removeFitment = (index: number) => {
    setFitments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        name: form.name,
        description: form.description,
        shortDescription: form.shortDescription || undefined,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined,
        stock: parseInt(form.stock) || 0,
        lowStockThreshold: parseInt(form.lowStockThreshold) || 5,
        sku: form.sku,
        brandName: form.brandName || undefined,
        status: form.status,
        featured: form.featured,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        metaKeywords: form.metaKeywords || undefined,
      };
      if (form.categoryId) payload.categoryId = form.categoryId;

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create product');
      }

      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 mb-2">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="e.g., Premium Ceramic Brake Pads" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="input-field" placeholder="Brief product summary (1-2 sentences)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={6} className="input-field" placeholder="Detailed product description..." />
              </div>
            </div>

            {/* Images */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Product Images</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">Drag and drop images or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB each. Max 10 images.</p>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="btn-secondary mt-4 inline-flex cursor-pointer text-sm py-2">
                  <Upload className="h-4 w-4" /> Choose Files
                </label>
              </div>
              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative h-20 w-20 rounded-lg border bg-gray-50 overflow-hidden">
                      <img src={URL.createObjectURL(img)} alt="" className="h-full w-full object-contain p-1" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 rounded-full bg-red-500 p-0.5 text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Fitment */}
            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Vehicle Fitment</h2>
                <button type="button" onClick={addFitment} className="btn-secondary text-sm py-1.5 px-3">
                  <Plus className="h-4 w-4" /> Add Vehicle
                </button>
              </div>
              {fitments.length === 0 ? (
                <p className="text-sm text-gray-500">No fitment data added yet. Click "Add Vehicle" to specify compatible vehicles.</p>
              ) : (
                <div className="space-y-3">
                  {fitments.map((_, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg bg-gray-50 p-3">
                      <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
                        <select className="input-field text-sm py-2"><option value="">Make</option><option>Toyota</option><option>Honda</option><option>Ford</option></select>
                        <select className="input-field text-sm py-2"><option value="">Model</option></select>
                        <input placeholder="Year Start" className="input-field text-sm py-2" />
                        <input placeholder="Year End" className="input-field text-sm py-2" />
                      </div>
                      <button type="button" onClick={() => removeFitment(i)} className="p-2 text-gray-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO */}
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">SEO</h2>
                <button type="button" onClick={autoGenerateSEO} className="btn-secondary text-sm py-1.5 px-3">
                  <Sparkles className="h-4 w-4" /> Auto Generate
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className="input-field" placeholder="Page title for search engines" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={2} className="input-field" placeholder="Description shown in search results" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input name="metaKeywords" value={form.metaKeywords} onChange={handleChange} className="input-field" placeholder="keyword1, keyword2, keyword3" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Status</h2>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="featured" checked={form.featured as any} onChange={handleChange} className="rounded" />
                <span className="text-sm text-gray-700">Featured product</span>
              </label>
            </div>

            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Pricing</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="input-field" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price</label>
                <input name="compareAtPrice" type="number" step="0.01" value={form.compareAtPrice} onChange={handleChange} className="input-field" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
                <input name="costPrice" type="number" step="0.01" value={form.costPrice} onChange={handleChange} className="input-field" placeholder="0.00" />
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Inventory</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input name="sku" value={form.sku} onChange={handleChange} required className="input-field" placeholder="BRK-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <input name="lowStockThreshold" type="number" value={form.lowStockThreshold} onChange={handleChange} className="input-field" />
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Organization</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} className="input-field">
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input name="brandName" value={form.brandName} onChange={handleChange} className="input-field" placeholder="Brand name" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
