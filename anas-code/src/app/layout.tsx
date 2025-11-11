import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import Navbar from "@/components/organisms/Navbar/Navbar";
import { defaultMetadata } from "@/lib/seo";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <FooterSection />
        </Providers>
      </body>
    </html>
  );
}
