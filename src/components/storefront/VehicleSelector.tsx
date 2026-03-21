'use client';

import { useState, useEffect } from 'react';
import { Car, Search } from 'lucide-react';

interface VehicleSelectorProps {
  onSelect?: (selection: { makeId: string; modelId: string; year: number }) => void;
  compact?: boolean;
}

const popularMakes = [
  { id: '1', name: 'Toyota' },
  { id: '2', name: 'Honda' },
  { id: '3', name: 'Ford' },
  { id: '4', name: 'Chevrolet' },
  { id: '5', name: 'BMW' },
  { id: '6', name: 'Mercedes-Benz' },
  { id: '7', name: 'Nissan' },
  { id: '8', name: 'Hyundai' },
  { id: '9', name: 'Kia' },
  { id: '10', name: 'Volkswagen' },
];

export default function VehicleSelector({ onSelect, compact = false }: VehicleSelectorProps) {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [models, setModels] = useState<{ id: string; name: string }[]>([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + 1 - i);

  useEffect(() => {
    if (make) {
      // In production, fetch models from API
      // For now, use placeholder models
      const modelsByMake: Record<string, string[]> = {
        '1': ['Camry', 'Corolla', 'RAV4', 'Tacoma', 'Highlander', '4Runner'],
        '2': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey'],
        '3': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Bronco', 'Ranger'],
        '4': ['Silverado', 'Camaro', 'Equinox', 'Traverse', 'Tahoe', 'Malibu'],
        '5': ['3 Series', '5 Series', 'X3', 'X5', 'X1', '7 Series'],
        '6': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class', 'S-Class'],
        '7': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Frontier', 'Maxima'],
        '8': ['Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Kona', 'Palisade'],
        '9': ['Forte', 'Sportage', 'Telluride', 'Sorento', 'Soul', 'Seltos'],
        '10': ['Jetta', 'Tiguan', 'Atlas', 'Golf', 'Passat', 'Taos'],
      };
      const makeModels = modelsByMake[make] || [];
      setModels(makeModels.map((m, i) => ({ id: `${make}-${i}`, name: m })));
      setModel('');
    }
  }, [make]);

  const handleSearch = () => {
    if (year && make && model) {
      const params = new URLSearchParams({ year, make, model });
      window.location.href = `/products?${params.toString()}`;
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <select value={year} onChange={(e) => setYear(e.target.value)} className="input-field w-auto">
          <option value="">Year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={make} onChange={(e) => setMake(e.target.value)} className="input-field w-auto">
          <option value="">Make</option>
          {popularMakes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="input-field w-auto" disabled={!make}>
          <option value="">Model</option>
          {models.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
        </select>
        <button onClick={handleSearch} disabled={!year || !make || !model} className="btn-primary px-4 py-3">
          <Search className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Car className="h-5 w-5 text-brand-500" />
        <h3 className="text-lg font-bold text-gray-900">Find Parts for Your Vehicle</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <select value={year} onChange={(e) => setYear(e.target.value)} className="input-field">
          <option value="">Select Year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={make} onChange={(e) => setMake(e.target.value)} className="input-field">
          <option value="">Select Make</option>
          {popularMakes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="input-field" disabled={!make}>
          <option value="">Select Model</option>
          {models.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
        </select>
        <button onClick={handleSearch} disabled={!year || !make || !model} className="btn-primary">
          <Search className="h-4 w-4" />
          Find Parts
        </button>
      </div>
    </div>
  );
}
