import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { generateOrganizationSchema } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ONEWAY Parts LLC - Premium Auto Parts & Accessories',
  description:
    'Shop premium car accessories and spare parts at ONEWAY Parts LLC. Brake pads, filters, lighting, engine parts and more with fitment guarantee for your vehicle. Sugar Land, TX.',
  keywords: 'auto parts, car accessories, spare parts, brake pads, oil filters, ONEWAY Parts, Sugar Land TX',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ONEWAY Parts LLC',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' },
          }}
        />
      </body>
    </html>
  );
}
