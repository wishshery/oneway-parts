'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { debounce } from '@/lib/utils';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category?: string;
}

interface SearchBarProps {
  onSelect?: () => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = debounce(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(data.results || []);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    search(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
      setIsOpen(false);
      onSelect?.();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search parts by name, SKU, or vehicle..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </form>

      {/* Autocomplete dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-white shadow-lg z-50 overflow-hidden">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/products/${result.slug}`}
              onClick={() => { setIsOpen(false); setQuery(''); onSelect?.(); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <img src={result.image || '/images/placeholder.svg'} alt="" className="h-10 w-10 rounded object-contain bg-gray-50" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{result.name}</p>
                {result.category && <p className="text-xs text-gray-500">{result.category}</p>}
              </div>
              <span className="text-sm font-semibold text-brand-500">${result.price.toFixed(2)}</span>
            </Link>
          ))}
          <Link
            href={`/products?search=${encodeURIComponent(query)}`}
            onClick={() => { setIsOpen(false); onSelect?.(); }}
            className="block border-t px-4 py-3 text-center text-sm font-medium text-brand-500 hover:bg-gray-50"
          >
            View all results for "{query}"
          </Link>
        </div>
      )}
    </div>
  );
}
