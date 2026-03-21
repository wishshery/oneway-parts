import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const footerLinks = {
  'Shop': [
    { name: 'All Parts', href: '/products' },
    { name: 'Brakes', href: '/products?category=brakes' },
    { name: 'Engine Parts', href: '/products?category=engine-parts' },
    { name: 'Filters', href: '/products?category=filters' },
    { name: 'Lighting', href: '/products?category=lighting' },
    { name: 'Suspension', href: '/products?category=suspension' },
  ],
  'Customer Service': [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Policy', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Order Tracking', href: '/orders' },
  ],
  'Company': [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '17135551234';

  return (
    <footer className="bg-brand-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold">
              <span className="text-accent-light">ONEWAY</span> Parts
            </Link>
            <p className="mt-4 text-sm text-blue-200">
              Premium auto parts and car accessories with guaranteed fitment for your vehicle.
            </p>
            <div className="mt-4 space-y-2 text-sm text-blue-200">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0" /> 16319 West Bellfort St Unit 12, Sugar Land, TX 77498</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> (713) 555-1234</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@onewayparts.com</p>
            </div>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-blue-200 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-blue-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-300">&copy; {new Date().getFullYear()} ONEWAY Parts LLC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <img src="https://cdn.jsdelivr.net/gh/nicehash/payments@master/visa.svg" alt="Visa" className="h-6 opacity-60" />
            <img src="https://cdn.jsdelivr.net/gh/nicehash/payments@master/mastercard.svg" alt="Mastercard" className="h-6 opacity-60" />
            <img src="https://cdn.jsdelivr.net/gh/nicehash/payments@master/amex.svg" alt="Amex" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
