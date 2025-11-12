import Link from "next/link";

import { Tweet, formatTweetText, getRelativeTime } from "@/lib/twitter";

interface TweetCardProps {
  tweet: Tweet;
}

export default function TweetCard({ tweet }: TweetCardProps) {
  const tweetUrl = `https://twitter.com/${tweet.author.username}/status/${tweet.id}`;
  const formattedText = formatTweetText(tweet);

  return (
    <article className="group relative">
      <Link
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200"
      >
        {/* Tweet Text - Main Focus */}
        <p className="text-base text-zinc-800 dark:text-zinc-200 leading-relaxed mb-4">
          {formattedText}
        </p>

        {/* Footer: Time and Metrics */}
        <div className="flex items-center justify-between text-sm">
          <time className="text-zinc-500 dark:text-zinc-400">
            {getRelativeTime(tweet.created_at)}
          </time>

          {tweet.public_metrics && (
            <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-500">
              {tweet.public_metrics.like_count > 0 && (
                <span className="flex items-center gap-1">
                  <span>♥</span>
                  <span>{tweet.public_metrics.like_count}</span>
                </span>
              )}
              {tweet.public_metrics.retweet_count > 0 && (
                <span className="flex items-center gap-1">
                  <span>↻</span>
                  <span>{tweet.public_metrics.retweet_count}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
