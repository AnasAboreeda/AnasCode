import "./globals.css";

import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";

import { GoogleAnalyticsEvents } from "@/components/analytics/GoogleAnalyticsEvents";
import { buildMetadata } from "@/lib/seo";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next"

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = buildMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={`${roboto.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/anas-code-anas-aboreeda-favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/anas-code-anas-aboreeda-favicon.png" />
      </head>
      <body>
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <GoogleAnalyticsEvents />
        <SpeedInsights />
      </body>
    </html>
  );
}
