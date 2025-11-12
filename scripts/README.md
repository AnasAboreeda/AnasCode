# Scripts

This directory contains utility scripts for the AnasCode project. These scripts are independent of the web application and can be run from the root of the repository.

## Available Scripts

### Link Checker

Crawls the website and verifies all internal and external links.

```bash
pnpm check-links                    # Check localhost:3000
pnpm check-links:local             # Check localhost:3000
pnpm check-links:prod              # Check production site
```

### Cache Management

Manages Twitter/X posts cache.

```bash
pnpm cache:tweets                  # Show usage
pnpm cache:refresh                 # Refresh tweets cache
pnpm cache:clear                   # Clear all cache
pnpm cache:stats                   # Show cache statistics
```

### Article Testing

Tests article discovery and validation.

```bash
pnpm test:articles                 # Test article loading
```

### Medium Conversion

Converts Medium exported HTML posts to MDX format.

```bash
pnpm convert:medium                # Convert Medium posts
```

## Installation

Before running any scripts, install dependencies from the root directory:

```bash
pnpm install
```

## Structure

- `check-links.ts` - Website link checker
- `manage-cache.ts` - Twitter/X cache management
- `test-articles.ts` - Article discovery testing
- `convert-medium-to-mdx.ts` - Medium HTML to MDX converter
