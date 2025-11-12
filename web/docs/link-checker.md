# Link Checker

Automated tool to verify all links on the website work correctly.

## Usage

### Check local development site

```bash
# Start the dev server first
pnpm dev

# In another terminal, run the link checker
pnpm check-links:local
```

### Check production site

```bash
pnpm check-links:prod
```

### Check custom URL

```bash
pnpm check-links http://localhost:3000
```

## What it checks

- ✅ All internal links (navigation, article links, etc.)
- ✅ All external links (GitHub, LinkedIn, Medium, RSS)
- ✅ Crawls all pages automatically
- ✅ Detects broken links (404s)
- ✅ Shows which pages contain broken links

## Skipped links

The checker automatically skips:

- `mailto:` links
- `tel:` links
- Same-page anchor links (`#section`)

## CI Integration

You can add this to your CI/CD pipeline:

```yaml
# .github/workflows/check-links.yml
name: Check Links

on:
  pull_request:
  schedule:
    - cron: "0 0 * * 0" # Weekly on Sundays

jobs:
  check-links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm build
      - run: pnpm start &
      - run: sleep 5 # Wait for server to start
      - run: pnpm check-links:local
```

## Example output

```text
🔍 Starting link checker...
Base URL: http://localhost:3000

📄 Crawling: http://localhost:3000
✓ 200 http://localhost:3000/articles
✓ 200 http://localhost:3000/links
✓ 200 http://localhost:3000/about
✓ 200 https://github.com/aboureadaa
✓ 200 https://linkedin.com/in/aboureadaa
✗ 404 https://example.com/broken-link

================================================================================
📊 LINK CHECK REPORT
================================================================================

✓ Total links checked: 25
✓ Successful: 24
✗ Failed: 1
⊘ Skipped: 3

================================================================================
❌ FAILED LINKS:
================================================================================

✗ https://example.com/broken-link
  Status: 404 Not Found
  Found on:
    - http://localhost:3000/articles
```
