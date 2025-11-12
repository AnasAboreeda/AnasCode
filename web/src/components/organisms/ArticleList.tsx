import { Article } from "@/content/articles";
import { buildArticleListJsonLd } from "@/lib/seo";

import ArticleListItem from "../molecules/ArticleListItem";

type ArticleListProps = {
  articles: Article[];
};

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <>
      <div>
        {articles.map((article) => (
          <ArticleListItem key={article.slug} article={article} />
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildArticleListJsonLd(articles)),
        }}
      />
    </>
  );
}
