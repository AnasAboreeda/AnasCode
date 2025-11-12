import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

import { useMDXComponents } from "@/../mdx-components";
import Heading from "@/components/atoms/Heading";
import LinkText from "@/components/atoms/LinkText";
import Text from "@/components/atoms/Text";
import SingleColumn from "@/components/templates/SingleColumn";
import { formatDate } from "@/lib/dates";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/mdx";
import { buildArticleJsonLd, buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return buildMetadata({
    title: article.frontmatter.title,
    description: article.frontmatter.summary,
    path: `/articles/${slug}`,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;

  return (
    <SingleColumn>
      <article>
        {/* Article Header */}
        <header className="mb-8">
          <Heading level={1} className="mb-4">
            {frontmatter.title}
          </Heading>

          <div className="flex flex-wrap gap-2 items-center text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
            {frontmatter.source && (
              <>
                <span>·</span>
                <span>{frontmatter.source}</span>
              </>
            )}
          </div>

          <Text className="text-lg text-zinc-700 dark:text-zinc-300 mb-6">
            {frontmatter.summary}
          </Text>

          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Canonical Link Notice */}
        {frontmatter.canonicalUrl && (
          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <Text className="text-sm text-zinc-600 dark:text-zinc-400">
              Originally published on{" "}
              <LinkText href={frontmatter.canonicalUrl} external>
                {frontmatter.source?.trim() || "external site"}
              </LinkText>
            </Text>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <MDXRemote
            source={content}
            components={useMDXComponents({})}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>
      </article>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildArticleJsonLd({
              slug,
              ...frontmatter,
            })
          ),
        }}
      />
    </SingleColumn>
  );
}
