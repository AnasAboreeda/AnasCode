import { Metadata } from "next";

import { Article } from "@/content/articles";
import { site } from "@/content/site";

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title ? `${title} | ${site.title}` : site.title;
  const pageDescription = description || site.description;
  const url = `${site.url}${path}`;
  const ogImage = image || `${site.url}/og-default.png`;

  return {
    title: pageTitle,
    description: pageDescription,
    authors: [{ name: site.author.name, url: site.url }],
    creator: site.author.name,
    publisher: site.author.name,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": `${site.url}/rss`,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title: pageTitle,
      description: pageDescription,
      siteName: site.title,
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
    },
  };
}

export function buildArticleJsonLd(article: Article): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: site.author.name,
      url: site.url,
    },
    publisher: {
      "@type": "Person",
      name: site.author.name,
    },
    description: article.summary,
    mainEntityOfPage: article.canonicalUrl || `${site.url}/articles/${article.slug}`,
    keywords: article.tags.join(", "),
  };
}

export function buildPersonJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author.name,
    url: site.url,
    email: site.author.email,
    jobTitle: "Software Engineer",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.author.location,
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.url}`,
    })),
  };
}

export function buildArticleListJsonLd(articles: Article[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: article.canonicalUrl || `${site.url}/articles/${article.slug}`,
      name: article.title,
    })),
  };
}
