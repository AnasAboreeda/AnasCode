import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import ArticleList from "@/components/organisms/ArticleList";
import SingleColumn from "@/components/templates/SingleColumn";
import { articles } from "@/content/articles";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: site.pages.articles.title,
  description: site.pages.articles.description,
  path: "/articles",
});

export default function ArticlesPage() {
  return (
    <SingleColumn>
      <Heading level={1}>{site.pages.articles.title}</Heading>
      <Text className="text-zinc-600 dark:text-zinc-400 mb-8">
        {site.pages.articles.description}
      </Text>
      <ArticleList articles={articles} />
    </SingleColumn>
  );
}
