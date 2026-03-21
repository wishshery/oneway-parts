'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        router.push('/admin');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold">
            <span className="text-brand-500">ONEWAY</span>
            <span className="text-gray-700"> Parts</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full py-3">
            <LogIn className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-brand-500 hover:text-brand-600">
              Create Account
            </Link>
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Demo admin: admin@onewayparts.com / admin123
        </p>
      </div>
    </div>
  );
}
