# AnasCode

This is my personal portfolio. Where you can find a lot about me and what I enjoy doing, some blog articles, study notes, problem solving and much more.

## Project Structure

This is a monorepo with the following structure:

- `/web` - Next.js web application
- `/scripts` - Utility scripts (link checking, cache management, article conversion)

## Quick Start

### Web Application

```bash
cd web
pnpm install
pnpm dev
```

### Scripts

From the root directory:

```bash
pnpm install
pnpm check-links        # Run link checker
pnpm cache:refresh      # Refresh tweets cache
pnpm test:articles      # Test article loading
```

See [scripts/README.md](scripts/README.md) for detailed script documentation.
