import { Article } from "@/content/articles";
import { formatDateShort } from "@/lib/dates";

import LinkText from "../atoms/LinkText";

type ArticleListItemProps = {
  article: Article;
};

export default function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <article className="mb-8 pb-8 border-b border-(--color-light-shade)/30 dark:border-zinc-800 last:border-0">
      <details className="group">
        <summary className="cursor-pointer list-none">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-(--color-dark-shade) dark:group-hover:text-(--color-light-shade) transition-colors leading-snug mb-2">
              {article.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              {article.source && (
                <>
                  <span className="font-medium">{article.source}</span>
                  <span>·</span>
                </>
              )}
              <time dateTime={article.date}>{formatDateShort(article.date)}</time>
            </div>
          </div>
        </summary>
        <div className="mt-4 pl-4 border-l-2 border-(--color-light-shade)/40 dark:border-(--color-dark-shade)">
          <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">{article.summary}</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-(--color-light-shade)/20 dark:bg-zinc-800 text-black dark:text-zinc-300 rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <LinkText href={`/articles/${article.slug}`} className="inline-flex items-center gap-1 font-medium">
            Read article →
          </LinkText>
        </div>
      </details>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            datePublished: article.date,
            author: { "@type": "Person", name: "Anas Aboreeda" },
            mainEntityOfPage:
              article.canonicalUrl || `https://www.anascode.com/articles/${article.slug}`,
          }),
        }}
      />
    </article>
  );
}
