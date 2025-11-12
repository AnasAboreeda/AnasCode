#!/usr/bin/env tsx

/**
 * Link Checker Script
 * Crawls the website and verifies all internal and external links
 * Usage: pnpm check-links [base-url]
 * Example: pnpm check-links http://localhost:3000
 */

import * as cheerio from "cheerio";

interface LinkResult {
  url: string;
  status: number;
  statusText: string;
  foundOn: string[];
}

interface CheckResults {
  success: LinkResult[];
  failed: LinkResult[];
  skipped: string[];
}

const visitedPages = new Set<string>();
const checkedLinks = new Map<string, LinkResult>();
const baseUrl = process.argv[2] || "http://localhost:3000";

// Links to skip (e.g., mailto, tel, or external domains that block crawlers)
const skipPatterns = [
  /^mailto:/,
  /^tel:/,
  /^#/, // Same-page anchors
];

async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkChecker/1.0)",
      },
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error);
    return null;
  }
}

async function checkLink(url: string, foundOn: string): Promise<void> {
  // Skip if already checked
  if (checkedLinks.has(url)) {
    const existing = checkedLinks.get(url)!;
    if (!existing.foundOn.includes(foundOn)) {
      existing.foundOn.push(foundOn);
    }
    return;
  }

  // Check if should be skipped
  if (skipPatterns.some((pattern) => pattern.test(url))) {
    return;
  }

  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkChecker/1.0)",
      },
    });

    checkedLinks.set(url, {
      url,
      status: response.status,
      statusText: response.statusText,
      foundOn: [foundOn],
    });

    const icon = response.ok ? "✓" : "✗";
    const color = response.ok ? "\x1b[32m" : "\x1b[31m";
    console.log(`${color}${icon}\x1b[0m ${response.status} ${url}`);
  } catch (error) {
    checkedLinks.set(url, {
      url,
      status: 0,
      statusText: error instanceof Error ? error.message : "Unknown error",
      foundOn: [foundOn],
    });
    console.log(`\x1b[31m✗\x1b[0m ERROR ${url}`);
  }
}

function normalizeUrl(href: string, currentPage: string): string {
  // Already absolute URL
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  // Relative to base
  if (href.startsWith("/")) {
    return `${baseUrl}${href}`;
  }

  // Relative to current page
  const currentUrl = new URL(currentPage);
  return new URL(href, currentUrl.origin + currentUrl.pathname).href;
}

async function crawlPage(url: string): Promise<void> {
  if (visitedPages.has(url)) {
    return;
  }

  visitedPages.add(url);
  console.log(`\n📄 Crawling: ${url}`);

  const html = await fetchPage(url);
  if (!html) {
    return;
  }

  const $ = cheerio.load(html);
  const links: string[] = [];

  // Extract all links
  $("a[href]").each((_index, element) => {
    const href = $(element).attr("href");
    if (href) {
      links.push(href);
    }
  });

  // Check each link
  for (const href of links) {
    const normalizedUrl = normalizeUrl(href, url);

    // Internal link - crawl it
    if (normalizedUrl.startsWith(baseUrl)) {
      await checkLink(normalizedUrl, url);

      // Only crawl HTML pages, not assets or RSS
      if (
        !normalizedUrl.includes(".") ||
        normalizedUrl.endsWith("/") ||
        normalizedUrl.includes("/articles") ||
        normalizedUrl.includes("/links") ||
        normalizedUrl.includes("/about")
      ) {
        await crawlPage(normalizedUrl);
      }
    }
    // External link - just check it
    else {
      await checkLink(normalizedUrl, url);
    }
  }
}

function printReport(results: CheckResults): void {
  console.log("\n" + "=".repeat(80));
  console.log("📊 LINK CHECK REPORT");
  console.log("=".repeat(80));

  console.log(`\n✓ Total links checked: ${checkedLinks.size}`);
  console.log(`✓ Successful: ${results.success.length}`);
  console.log(`✗ Failed: ${results.failed.length}`);
  console.log(`⊘ Skipped: ${results.skipped.length}`);

  if (results.failed.length > 0) {
    console.log("\n" + "=".repeat(80));
    console.log("❌ FAILED LINKS:");
    console.log("=".repeat(80));

    for (const link of results.failed) {
      console.log(`\n\x1b[31m✗ ${link.url}\x1b[0m`);
      console.log(`  Status: ${link.status} ${link.statusText}`);
      console.log(`  Found on:`);
      for (const page of link.foundOn) {
        console.log(`    - ${page}`);
      }
    }
  }

  console.log("\n" + "=".repeat(80));
}

async function main() {
  console.log("\n🔍 Starting link checker...");
  console.log(`Base URL: ${baseUrl}\n`);

  // Start crawling from the homepage
  await crawlPage(baseUrl);

  // Organize results
  const results: CheckResults = {
    success: [],
    failed: [],
    skipped: [],
  };

  for (const [_url, result] of checkedLinks) {
    if (result.status >= 200 && result.status < 400) {
      results.success.push(result);
    } else {
      results.failed.push(result);
    }
  }

  printReport(results);

  // Exit with error code if any links failed
  if (results.failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
