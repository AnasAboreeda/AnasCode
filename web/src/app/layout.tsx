import './globals.css';

import { Inter } from 'next/font/google';

import FooterSection from '@/components/organisms/FooterSection/FooterSection';
import Navbar from '@/components/organisms/Navbar/Navbar';
import { defaultMetadata } from '@/lib/seo';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <FooterSection />
        <Analytics />
      </body>
    </html>
  );
}
