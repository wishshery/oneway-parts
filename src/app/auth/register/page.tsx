'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Account created! Please sign in.');
        router.push('/auth/login');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Registration failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold">
            <span className="text-brand-500">ONEWAY</span>
            <span className="text-gray-700"> Parts</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Join ONEWAY Parts to track orders and save wishlist</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input name="name" value={form.name} onChange={handleChange} required className="input-field pl-10" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field pl-10" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input name="password" type="password" value={form.password} onChange={handleChange} required className="input-field pl-10" placeholder="Min. 8 characters" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className="input-field pl-10" placeholder="Re-enter password" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full py-3">
            <UserPlus className="h-4 w-4" />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-brand-500 hover:text-brand-600">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
