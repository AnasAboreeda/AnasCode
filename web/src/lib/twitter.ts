/**
 * Twitter API Integration
 * Fetches tweets using Twitter API v2 with persistent file caching
 */

import { getCache, setCache } from "./cache";

// Cache TTL: 1 day (86400 seconds) - to minimize API calls
const CACHE_TTL_SECONDS = 24 * 60 * 60;

export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author: {
    username: string;
    name: string;
    profile_image_url?: string;
  };
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  entities?: {
    urls?: Array<{
      url: string;
      expanded_url: string;
      display_url: string;
    }>;
    hashtags?: Array<{
      tag: string;
    }>;
    mentions?: Array<{
      username: string;
    }>;
  };
}

interface TwitterAPIResponse {
  data: Array<{
    id: string;
    text: string;
    created_at: string;
    author_id: string;
    public_metrics: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
    };
    entities?: {
      urls?: Array<{
        url: string;
        expanded_url: string;
        display_url: string;
      }>;
      hashtags?: Array<{
        tag: string;
      }>;
      mentions?: Array<{
        username: string;
      }>;
    };
  }>;
  includes?: {
    users: Array<{
      id: string;
      username: string;
      name: string;
      profile_image_url: string;
    }>;
  };
}

const TWITTER_API_BASE = "https://api.twitter.com/2";
const TWITTER_API_V1_BASE = "https://api.twitter.com/1.1";

/**
 * Generate OAuth 1.0a signature for Twitter API
 */
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessTokenSecret: string
): string {
  const crypto = require("crypto");

  // OAuth parameters
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_token: accessToken,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(32).toString("base64").replace(/\W/g, ""),
    oauth_version: "1.0",
  };

  // Combine all parameters
  const allParams: Record<string, string> = { ...params, ...oauthParams };

  // Create parameter string
  const paramString = Object.keys(allParams)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
    .join("&");

  // Create signature base string
  const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;

  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(accessTokenSecret)}`;

  // Generate signature
  const signature = crypto.createHmac("sha1", signingKey).update(signatureBase).digest("base64");

  return signature;
}

/**
 * Build OAuth 1.0a Authorization header
 */
function buildOAuthHeader(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessTokenSecret: string
): string {
  const crypto = require("crypto");

  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_token: accessToken,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(32).toString("base64").replace(/\W/g, ""),
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
    method,
    url,
    params,
    consumerKey,
    consumerSecret,
    accessToken,
    accessTokenSecret
  );

  const headerParams: Record<string, string> = {
    ...oauthParams,
    oauth_signature: signature,
  };

  const header =
    "OAuth " +
    Object.keys(headerParams)
      .sort()
      .map((key) => `${encodeURIComponent(key)}="${encodeURIComponent(headerParams[key])}"`)
      .join(", ");

  return header;
}

/**
 * Get cached tweets (read-only, never calls API)
 * Use this in the app to display tweets from cache
 *
 * Returns empty array if cache doesn't exist or is expired
 * Cache is populated by GitHub Actions or manual refresh script
 */
export async function getCachedTweets(
  username: string,
  maxResults: number = 5
): Promise<Tweet[]> {
  const cacheKey = `twitter_${username}_${maxResults}`;

  const cachedTweets = getCache<Tweet[]>(cacheKey);
  if (cachedTweets) {
    console.log(`[Twitter] Using cached tweets for @${username}`);
    return cachedTweets;
  }

  console.log(`[Twitter] No cached tweets found for @${username}`);
  return [];
}

/**
 * Fetch recent tweets from a user with persistent caching
 *
 * ⚠️ WARNING: This function makes API calls to Twitter!
 * Only use in scripts (manage-cache.ts) or GitHub Actions.
 * NEVER call from the app at runtime to avoid rate limits.
 *
 * Requires Twitter API credentials in environment variables
 *
 * Caching strategy:
 * - Checks file cache first (7-day TTL)
 * - Falls back to API if cache miss
 * - Stores successful API responses to cache
 * - Minimizes API calls to stay within rate limits (100/month for free tier)
 */
export async function fetchUserTweets(
  username: string,
  maxResults: number = 5
): Promise<Tweet[]> {
  const cacheKey = `twitter_${username}_${maxResults}`;

  // Try to get from cache first
  const cachedTweets = getCache<Tweet[]>(cacheKey);
  if (cachedTweets) {
    console.log(`[Twitter] Using cached tweets for @${username}`);
    return cachedTweets;
  }

  console.log(`[Twitter] Cache miss, fetching from API for @${username}`);

  // Use Bearer Token (simpler and works with Free tier)
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    console.error("TWITTER_BEARER_TOKEN is not set in environment variables");
    return [];
  }

  console.log(`[Twitter] Using Bearer Token: ${bearerToken.substring(0, 20)}...`);

  // Helper function to wait/throttle between requests
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // Step 1: Get user ID from username using API v2
    const userUrl = `${TWITTER_API_BASE}/users/by/username/${username}`;
    console.log(`[Twitter] Fetching user from: ${userUrl}`);

    const userResponse = await fetch(userUrl, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      cache: "no-store", // Don't use Next.js cache, we handle caching ourselves
    });

    console.log(`[Twitter] User response status: ${userResponse.status}`);

    if (!userResponse.ok) {
      const errorBody = await userResponse.text();
      console.error(`Twitter API error: ${userResponse.status}`);
      console.error(`Response body:`, errorBody);

      if (userResponse.status === 429) {
        const resetTime = userResponse.headers.get("x-rate-limit-reset");
        if (resetTime) {
          const resetDate = new Date(parseInt(resetTime) * 1000);
          const waitMinutes = Math.ceil((resetDate.getTime() - Date.now()) / 60000);
          console.warn(`Twitter API rate limit reached. Resets at: ${resetDate.toLocaleString()}`);
          console.warn(`Wait approximately ${waitMinutes} minutes`);
        } else {
          console.warn("Twitter API rate limit reached. Try again in 15 minutes.");
        }
      } else if (userResponse.status === 401) {
        console.error("Twitter API authentication failed. Check your credentials.");
      } else if (userResponse.status === 403) {
        console.error("Twitter API forbidden. Your app may not have the required access level.");
      }
      return [];
    }

    const userData = await userResponse.json();
    console.log("[Twitter] User data:", userData);

    // Wait 2 seconds before next request to avoid rate limiting
    console.log("[Twitter] Waiting 2 seconds before fetching tweets...");
    await wait(2000);

    if (!userData.data?.id) {
      console.error("[Twitter] No user ID found in response");
      return [];
    }

    const userId = userData.data.id;

    // Step 2: Fetch user's tweets using API v2
    const tweetsParams = {
      max_results: maxResults.toString(),
      "tweet.fields": "created_at,public_metrics,entities",
      "user.fields": "username,name,profile_image_url",
      expansions: "author_id",
      exclude: "retweets,replies", // Only original tweets
    };

    const tweetsUrl = `${TWITTER_API_BASE}/users/${userId}/tweets`;
    const tweetsUrlWithParams = `${tweetsUrl}?${new URLSearchParams(tweetsParams)}`;
    console.log(`[Twitter] Fetching tweets from: ${tweetsUrlWithParams}`);

    const tweetsResponse = await fetch(tweetsUrlWithParams, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      cache: "no-store", // Don't use Next.js cache, we handle caching ourselves
    });

    if (!tweetsResponse.ok) {
      const errorBody = await tweetsResponse.text();
      console.error(`Failed to fetch tweets: ${tweetsResponse.status}`);
      console.error(`Response body:`, errorBody);

      if (tweetsResponse.status === 429) {
        const resetTime = tweetsResponse.headers.get("x-rate-limit-reset");
        if (resetTime) {
          const resetDate = new Date(parseInt(resetTime) * 1000);
          console.warn(`Twitter API rate limit reached. Resets at: ${resetDate.toLocaleString()}`);
          console.warn(`Wait approximately ${Math.ceil((resetDate.getTime() - Date.now()) / 60000)} minutes`);
        } else {
          console.warn("Twitter API rate limit reached. Try again in 15 minutes.");
        }
      } else if (tweetsResponse.status === 403) {
        console.error("Twitter API forbidden. Your app may not have the required access level (need at least Free tier).");
      }
      return [];
    }

    const tweetsData: TwitterAPIResponse = await tweetsResponse.json();

    // Step 3: Transform data to our Tweet type
    const tweets: Tweet[] = tweetsData.data.map((tweet) => {
      const author = tweetsData.includes?.users.find(
        (user) => user.id === tweet.author_id
      );

      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        author: {
          username: author?.username || username,
          name: author?.name || username,
          profile_image_url: author?.profile_image_url,
        },
        public_metrics: tweet.public_metrics,
        entities: tweet.entities,
      };
    });

    // Cache the successful response
    setCache(cacheKey, tweets, CACHE_TTL_SECONDS);
    console.log(`[Twitter] Cached ${tweets.length} tweets for @${username}`);

    return tweets;
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return [];
  }
}

/**
 * Format tweet text with clickable links
 */
export function formatTweetText(tweet: Tweet): string {
  let text = tweet.text;

  // Replace t.co URLs with display URLs
  if (tweet.entities?.urls) {
    tweet.entities.urls.forEach((url) => {
      text = text.replace(url.url, url.display_url);
    });
  }

  return text;
}

/**
 * Get relative time string (e.g., "2h ago", "3d ago")
 */
export function getRelativeTime(date: string): string {
  const now = new Date();
  const tweetDate = new Date(date);
  const diffMs = now.getTime() - tweetDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return tweetDate.toLocaleDateString();
  }
}
