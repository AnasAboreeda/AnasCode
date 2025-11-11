import type { Metadata } from "next";

const siteName = "Anas Aboreeda";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anascode.com";
const defaultTitle = "Anas Aboreeda | Engineering Leader & AI Architect";
const defaultDescription =
  "Principal Software Engineer and Engineering Manager building AI platforms that ship, scale, and earn trust. AWS, Kubernetes, modern data stacks, governance, reliability.";

/**
 * Generate SEO metadata for pages
 */
export function generateSEO({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageUrl = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}/og-image.png`;

  return {
    title: pageTitle,
    description: pageDescription,
    robots: noIndex
      ? {
        index: false,
        follow: false,
      }
      : {
        index: true,
        follow: true,
      },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
      creator: "@AnasAboreeda",
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = generateSEO({});
