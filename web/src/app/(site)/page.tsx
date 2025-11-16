import Heading from "@/components/atoms/Heading";
import LinkText from "@/components/atoms/LinkText";
import Text from "@/components/atoms/Text";
import ArticleList from "@/components/organisms/ArticleList";
import TweetList from "@/components/organisms/TweetList";
import SingleColumn from "@/components/templates/SingleColumn";
import { articles } from "@/content/articles";
import { site } from "@/content/site";
import { getCachedTweets } from "@/lib/twitter";

export default async function HomePage() {
  const recentArticles = articles.slice(0, 5);

  // Get cached tweets (never calls API, only reads from cache)
  // Cache is populated by GitHub Actions daily or via `pnpm cache:refresh`
  // Note: maxResults must match the cache file (currently 5)
  const tweets = await getCachedTweets("AnasAboreeda", 5);
  const recentTweets = tweets.slice(0, 3); // Show only 3 most recent

  return (
    <SingleColumn>
      <section className="mb-12 max-w-xl">
        <Heading level={1}>{site.pages.home.title}</Heading>
        <Text className="text-xl text-zinc-700 dark:text-zinc-300 mb-2">
          {site.pages.home.subtitle}
        </Text>
        <Text className="text-zinc-600 dark:text-zinc-400">
          {site.pages.home.tagline}
        </Text>
      </section>

      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-6">
          {site.pages.home.recentArticlesTitle}
        </Heading>
        <ArticleList articles={recentArticles} />
        <Text className="mt-6">
          <LinkText href="/articles">{site.pages.home.viewAllArticlesText}</LinkText>
        </Text>
      </section>

      {recentTweets.length > 0 && (
        <section className="mb-12">
          <Heading level={2} className="text-2xl mb-6">
            Recent Thoughts
          </Heading>
          <TweetList tweets={recentTweets} />
        </section>
      )}
    </SingleColumn>
  );
}
