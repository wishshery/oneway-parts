import Link from 'next/link';
import { ArrowRight, Truck, Shield, Headphones, Award, Wrench, Zap, Car } from 'lucide-react';
import VehicleSelector from '@/components/storefront/VehicleSelector';

const featuredCategories = [
  { name: 'Brakes', slug: 'brakes', icon: '🔧', description: 'Pads, rotors, calipers & more', count: 340 },
  { name: 'Engine Parts', slug: 'engine-parts', icon: '⚙️', description: 'Belts, gaskets, pumps & more', count: 520 },
  { name: 'Filters', slug: 'filters', icon: '🛡️', description: 'Oil, air, cabin & fuel filters', count: 280 },
  { name: 'Lighting', slug: 'lighting', icon: '💡', description: 'Headlights, taillights, LEDs', count: 190 },
  { name: 'Suspension', slug: 'suspension', icon: '🏎️', description: 'Shocks, struts, control arms', count: 310 },
  { name: 'Electrical', slug: 'electrical', icon: '⚡', description: 'Batteries, alternators, starters', count: 245 },
  { name: 'Body Parts', slug: 'body-parts', icon: '🚗', description: 'Bumpers, mirrors, fenders', count: 410 },
  { name: 'Interior', slug: 'interior', icon: '🪑', description: 'Seats, mats, accessories', count: 180 },
];

const trustBadges = [
  { icon: Truck, title: 'Fast Shipping', desc: 'Orders ship within 24 hours' },
  { icon: Shield, title: 'Fitment Guarantee', desc: 'Parts guaranteed to fit your vehicle' },
  { icon: Headphones, title: 'Expert Support', desc: 'Automotive specialists on call' },
  { icon: Award, title: 'Quality Parts', desc: 'OEM and premium aftermarket' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1 text-sm font-medium text-accent-light mb-4">
              Trusted by 10,000+ car owners
            </span>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Premium Auto Parts
              <br />
              <span className="text-accent-light">Delivered to Your Door</span>
            </h1>
            <p className="mt-6 text-lg text-blue-100 max-w-xl">
              Shop thousands of high-quality car accessories and spare parts with guaranteed fitment for your vehicle. OEM and aftermarket — all at competitive prices.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="btn-accent text-base px-8 py-4">
                Shop All Parts
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/contact" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 text-base px-8 py-4">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Selector */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <VehicleSelector />
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex items-start gap-3">
              <div className="rounded-lg bg-brand-50 p-2.5">
                <badge.icon className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{badge.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Shop by Category</h2>
              <p className="mt-2 text-gray-500">Find the exact parts you need for your vehicle</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group rounded-xl bg-white p-6 border border-gray-100 transition-all hover:shadow-lg hover:border-brand-200"
              >
                <span className="text-3xl">{cat.icon}</span>
                <h3 className="mt-3 text-base font-semibold text-gray-900 group-hover:text-brand-500 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">{cat.description}</p>
                <p className="mt-2 text-xs font-medium text-brand-500">{cat.count}+ parts</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Why ONEWAY Parts?</h2>
          <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
            We're your one-stop shop for all car accessories and spare parts, backed by expert support and guaranteed fitment.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
              <Wrench className="h-7 w-7 text-brand-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Verified Fitment</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
              Every part is verified to fit your specific year, make, and model. No guessing, no returns.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
              <Zap className="h-7 w-7 text-accent-dark" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Fast & Free Shipping</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
              Free shipping on orders over $75. Most orders ship same day and arrive within 2-5 business days.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
              <Car className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">10,000+ Parts</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
              Massive catalog covering all major makes and models. OEM and premium aftermarket options.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Can't Find What You Need?</h2>
          <p className="mt-3 text-blue-100 max-w-lg mx-auto">
            Our automotive specialists can help you find the exact part for your vehicle. Reach out via phone, email, or WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-accent text-base px-8 py-4">
              Contact Us
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '17135551234'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary bg-green-600 border-green-600 text-white hover:bg-green-700 text-base px-8 py-4"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
