import Heading from "@/components/atoms/Heading";
import LinkText from "@/components/atoms/LinkText";
import Text from "@/components/atoms/Text";
import SingleColumn from "@/components/templates/SingleColumn";
import { articles } from "@/content/articles";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sitemap",
  description: "Complete list of all pages and articles on AnasCode",
  path: "/sitemap-page",
});

export default function SitemapPage() {
  return (
    <SingleColumn>
      <section className="mb-12">
        <Heading level={1}>Sitemap</Heading>
        <Text className="text-zinc-600 dark:text-zinc-400">
          Complete list of all pages and articles on this site
        </Text>
      </section>

      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-4">
          Main Pages
        </Heading>
        <ul className="space-y-2">
          <li>
            <LinkText href="/">Home</LinkText>
          </li>
          <li>
            <LinkText href="/articles">Articles</LinkText>
          </li>
          <li>
            <LinkText href="/about">About</LinkText>
          </li>
          <li>
            <LinkText href="/links">Links</LinkText>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-4">
          Articles ({articles.length})
        </Heading>
        <ul className="space-y-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <div>
                <LinkText href={`/articles/${article.slug}`}>
                  {article.title}
                </LinkText>
                <Text className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {article.tags.join(", ")}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-4">
          Technical Resources
        </Heading>
        <ul className="space-y-2">
          <li>
            <LinkText href="/rss">RSS Feed</LinkText>
            <Text className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
              Subscribe to get updates on new articles
            </Text>
          </li>
          <li>
            <LinkText href="/sitemap.xml" external>
              XML Sitemap
            </LinkText>
            <Text className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
              Machine-readable sitemap for search engines
            </Text>
          </li>
        </ul>
      </section>
    </SingleColumn>
  );
}
