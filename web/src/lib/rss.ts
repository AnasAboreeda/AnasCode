import { Article } from "@/content/articles";
import { site } from "@/content/site";

export function buildRssFeed(articles: Article[]): string {
  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${article.canonicalUrl || `${site.url}/articles/${article.slug}`}</link>
      <guid>${article.canonicalUrl || `${site.url}/articles/${article.slug}`}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description><![CDATA[${article.summary}]]></description>
      ${article.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.title}</title>
    <link>${site.url}</link>
    <description>${site.description}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}
