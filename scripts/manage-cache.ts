#!/usr/bin/env node

/**
 * Twitter Cache Manager
 *
 * Usage:
 *   pnpm cache:tweets refresh  - Refresh tweets cache (only if expired or missing)
 *   pnpm cache:tweets clear    - Clear all cached tweets (use sparingly)
 *   pnpm cache:tweets stats    - Show cache statistics
 */

import { resolve } from "path";

import { config } from "dotenv";

import { clearCache, getCacheStats } from "../web/src/lib/cache";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), "web/.env.local") });

const command = process.argv[2];

async function refreshTweetsCache() {
  console.log("🔄 Refreshing tweets cache...");

  // Import dynamically to avoid build issues
  const { fetchUserTweets } = await import("../web/src/lib/twitter");

  // Don't clear cache - let fetchUserTweets check if cache is still valid
  // If cache exists and is not expired, it will be reused
  // If expired or missing, it will fetch from API
  const tweets = await fetchUserTweets("AnasAboreeda", 10);

  if (tweets.length > 0) {
    console.log(`✅ Successfully cached ${tweets.length} tweets`);
    console.log("Cache will expire in 7 days");
  } else {
    console.log("⚠️  No tweets fetched (check API credentials or rate limits)");
  }
}

function showStats() {
  const stats = getCacheStats();
  console.log("📊 Cache Statistics:");
  console.log(`   Files: ${stats.files}`);
  console.log(`   Total Size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
  console.log(`   Oldest Cache: ${stats.oldestAge} minutes old`);
}

function clearAllCache() {
  console.log("🗑️  Clearing cache...");
  clearCache();
  console.log("✅ Cache cleared");
}

async function main() {
  switch (command) {
    case "refresh":
      await refreshTweetsCache();
      break;
    case "clear":
      clearAllCache();
      break;
    case "stats":
      showStats();
      break;
    default:
      console.log("Twitter Cache Manager");
      console.log("");
      console.log("Usage:");
      console.log("  pnpm cache:tweets refresh  - Refresh tweets cache");
      console.log("  pnpm cache:tweets clear    - Clear all cache");
      console.log("  pnpm cache:tweets stats    - Show cache stats");
      process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
