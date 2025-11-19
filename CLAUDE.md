# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. Features a blog with MDX articles, Twitter integration with GitHub Actions caching, and comprehensive E2E testing.

## Monorepo Structure

- `/web` - Next.js application (main site)
- `/scripts` - Standalone utility scripts (link checker, cache management, article tools)

## Common Development Commands

### Web Application (in `/web` directory)

```bash
cd web
pnpm install        # Install dependencies
pnpm dev            # Start dev server at localhost:3000
pnpm build          # Production build
pnpm lint           # Run ESLint
pnpm format         # Format with Prettier
pnpm format:check   # Check formatting

# E2E Testing (Playwright)
pnpm test:e2e           # Run all E2E tests
pnpm test:e2e:ui        # Open Playwright UI
pnpm test:e2e:headed    # Run tests with browser visible
pnpm test:e2e:debug     # Debug tests
pnpm test:e2e:report    # View test report
```

### Utility Scripts (from root directory)

```bash
pnpm check-links        # Check links on localhost:3000
pnpm check-links:prod   # Check links on production site
pnpm cache:refresh      # Refresh Twitter cache
pnpm cache:clear        # Clear Twitter cache
pnpm cache:stats        # Show cache statistics
pnpm test:articles      # Test article discovery
pnpm convert:medium     # Convert Medium exports to MDX
```

## Architecture

### App Structure (Next.js App Router)

```
web/src/
├── app/
│   ├── layout.tsx                  # Root layout (no router-specific code)
│   ├── (site)/                     # Route group for main site
│   │   ├── layout.tsx              # Site layout with header/footer
│   │   ├── page.tsx                # Homepage
│   │   ├── about/page.tsx          # About page
│   │   ├── articles/
│   │   │   ├── page.tsx            # Articles list
│   │   │   └── [slug]/page.tsx     # Individual article
│   │   ├── links/page.tsx          # Links page
│   │   └── rss/route.ts            # RSS feed
│   ├── sitemap.ts                  # Dynamic sitemap
│   └── robots.ts                   # Robots.txt
├── components/
│   ├── atoms/                      # Basic UI components
│   ├── molecules/                  # Composite components
│   ├── organisms/                  # Complex components
│   ├── templates/                  # Page templates
│   └── analytics/                  # Analytics components
├── content/
│   ├── articles.ts                 # Article type definitions
│   ├── about.ts                    # About page content
│   ├── links.ts                    # Links page content
│   └── site.ts                     # Site metadata
└── lib/
    ├── mdx.ts                      # Article loading/parsing
    ├── mdx-compiler.ts             # MDX compilation with plugins
    ├── twitter.ts                  # Twitter API client with OAuth 1.0a
    ├── cache.ts                    # File-based caching utilities
    ├── rss.ts                      # RSS feed generation
    ├── seo.ts                      # SEO metadata helpers
    └── dates.ts                    # Date formatting utilities
```

### Component Organization (Atomic Design)

Components follow atomic design principles:
- **Atoms**: Single-purpose UI elements (buttons, inputs, links)
- **Molecules**: Simple combinations of atoms (navigation items, article cards)
- **Organisms**: Complex sections (header, footer, article grid)
- **Templates**: Page-level layouts

### Content Management

Articles are MDX files in `web/content/articles/`. Two supported structures:
1. Flat: `web/content/articles/my-slug.mdx`
2. Nested: `web/content/articles/my-slug/index.mdx` (for articles with images)

Required frontmatter:
```yaml
---
title: "Article Title"
date: "2024-11-12"
summary: "Brief description"
tags: ["tag1", "tag2"]
source: "Medium"              # Optional
canonicalUrl: "https://..."   # Optional
published: true               # Optional, defaults to true
---
```

Articles are automatically:
- Listed on `/articles` (sorted by date)
- Included in sitemap and RSS feed
- Given SEO metadata and JSON-LD structured data

## Twitter Integration Architecture

**Problem**: Twitter API free tier limits 100 requests/month. Traditional ISR or per-request fetching would exceed this within hours.

**Solution**: GitHub Actions-based caching system that fetches tweets once daily and commits the cache to git, making it available at build time with zero runtime API calls.

### Flow

1. **GitHub Actions** (daily at 6 AM):
   - Runs `pnpm cache:refresh` in scripts directory
   - Fetches tweets via Twitter OAuth 1.0a API (2 calls)
   - Saves to `.cache/twitter_AnasAboreeda_3.json`
   - Commits cache file to repository
   - Triggers Vercel deployment

2. **Build Time** (Vercel):
   - Pulls repository (includes `.cache/` directory)
   - Builds site with cached tweets
   - No API calls needed

3. **Runtime** (Production):
   - `fetchUserTweets()` reads from `.cache/` file
   - Zero API calls, instant response
   - Handles unlimited traffic

**Result**: ~60 API calls/month (well under 100 limit), $0 cost, instant load times.

### Cache Files

Location: `.cache/twitter_{username}_{count}.json`

Structure:
```json
{
  "data": [...],           // Tweet objects
  "timestamp": 1699776000, // Fetch time
}
```

**Important**: `.cache/` directory is committed to git (not in `.gitignore`).

## Testing

### E2E Tests (Playwright)

Located in `web/e2e/`:
- `home.spec.ts` - Homepage functionality
- `articles.spec.ts` - Article listing and detail pages
- `about.spec.ts` - About page
- `links.spec.ts` - Links page
- `navigation.spec.ts` - Navigation and routing
- `analytics.spec.ts` - Analytics tracking

Tests include accessibility checks using @axe-core/playwright.

### Pre-push Hook

The `.husky/pre-push` hook automatically runs:
1. `pnpm build` (in web directory)
2. `pnpm test:e2e` (in web directory)

Push is blocked if either fails.

## Key Technologies

- **Next.js 16**: App Router, React Server Components, Server Actions
- **React 19**: Includes React Compiler (babel-plugin-react-compiler)
- **TypeScript**: Strict mode enabled
- **Tailwind CSS 4**: New architecture with @tailwindcss/postcss
- **MDX**: Content with gray-matter frontmatter, rehype-pretty-code for syntax highlighting
- **Playwright**: E2E testing with accessibility checks
- **Twitter OAuth 1.0a**: Manual implementation for free tier API access
- **Vercel**: Deployment platform

## Path Aliases

TypeScript/Next.js configured with `@/*` pointing to `web/src/*`:

```typescript
import { Article } from "@/content/articles"
import { fetchUserTweets } from "@/lib/twitter"
```

## Environment Variables

### Development (`.env.local` in web directory)
```
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_TOKEN_SECRET=...
```

### GitHub Actions
Set in repository secrets:
- `TWITTER_API_KEY`
- `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_TOKEN_SECRET`

### Vercel
No Twitter secrets needed - reads from committed `.cache/` files.

## Important Conventions

1. **Scripts are independent**: The `/scripts` directory has its own `package.json` and runs with `tsx`. Scripts are run from the root directory, not from within `/scripts`.

2. **Cache is committed**: Unlike typical patterns, `.cache/` is tracked in git for build-time access.

3. **Component hierarchy**: Follow atomic design - don't skip levels (e.g., don't put molecules in atoms).

4. **Article structure**: Use nested folders (`slug/index.mdx`) when articles need co-located images/assets.

5. **Date format**: Always ISO format (`YYYY-MM-DD`) in frontmatter and content.

6. **Git hooks**: Husky manages pre-push hooks - don't bypass them unless absolutely necessary.

## Documentation

Additional docs in `web/docs/`:
- `adding-articles.md` - Comprehensive guide to adding MDX articles
- `twitter-architecture.md` - Detailed Twitter caching architecture
- `twitter-setup.md` - Twitter API setup instructions
- `github-actions-twitter.md` - GitHub Actions configuration
- `link-checker.md` - Link checking tool documentation
- `testing-analytics.md` - Analytics testing guide
- `syntax-highlighting.md` - Code highlighting configuration
