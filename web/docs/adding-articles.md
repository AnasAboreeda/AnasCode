# Adding Articles to Your Website

This guide explains how to add new articles to your website using MDX files.

## Quick Start

1. Create a new `.mdx` file in `content/articles/`
2. Add frontmatter with article metadata
3. Write your content in Markdown/MDX
4. The article will automatically appear on the site

## File Structure

```text
content/articles/
├── my-article-slug.mdx
├── another-article.mdx
└── spring-boot-security.mdx
```

The filename becomes the URL slug: `yourdomain.com/articles/my-article-slug`

## Article Template

````mdx
---
title: "Your Article Title"
date: "2024-11-12"
summary: "A brief description of your article (shown in lists and meta descriptions)"
tags: ["tag1", "tag2", "tag3"]
source: "Medium" # Optional: where it was originally published
canonicalUrl: "https://medium.com/@you/article" # Optional: original URL
published: true # Optional: set to false to hide from production
---

# Your Article Title

Your article content starts here. You can use all Markdown features plus MDX components.

## Headings

Use standard Markdown headings (H1-H6).

## Text Formatting

- **Bold text**
- _Italic text_
- `Inline code`
- [Links](https://example.com)

## Code Blocks

\```javascript
function example() {
console.log("Syntax highlighted code");
}
\```

## Lists

### Unordered

- Item 1
- Item 2
  - Nested item

### Ordered

1. First item
2. Second item
3. Third item

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

## Tables

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
| More     | Data     | Here     |

## Images

![Alt text](https://via.placeholder.com/800x400)

## Horizontal Rules

---

## Advanced: MDX Components

You can import and use React components:

\```mdx
import { MyCustomComponent } from '@/components/MyCustomComponent'

<MyCustomComponent prop="value" />
\```
````

## Frontmatter Fields

### Required Fields

- **title**: Article title (shown in heading and metadata)
- **date**: Publication date in `YYYY-MM-DD` format
- **summary**: Brief description (150-300 characters recommended)
- **tags**: Array of tags for categorization

### Optional Fields

- **source**: Original publication source (e.g., "Medium", "AWS Tip")
- **canonicalUrl**: URL of original publication (if republishing)
- **published**: Set to `false` to hide from production (defaults to `true`)

## Examples

### Simple Blog Post

````mdx
---
title: "Getting Started with Next.js 15"
date: "2024-11-12"
summary: "A beginner-friendly guide to building modern web applications with Next.js 15 and React Server Components."
tags: ["nextjs", "react", "tutorial"]
published: true
---

# Getting Started with Next.js 15

Next.js 15 introduces powerful new features...

## Installation

\```bash
npx create-next-app@latest my-app
\```

...rest of your content...
````

### Technical Deep Dive

````mdx
---
title: "Optimizing Database Queries in PostgreSQL"
date: "2024-11-10"
summary: "Advanced techniques for query optimization, indexing strategies, and performance tuning in PostgreSQL databases."
tags: ["postgresql", "database", "performance"]
source: "Medium"
canonicalUrl: "https://medium.com/@you/postgresql-optimization"
published: true
---

# Optimizing Database Queries in PostgreSQL

When working with large datasets...

## Understanding Query Plans

\```sql
EXPLAIN ANALYZE
SELECT \* FROM users WHERE email = 'user@example.com';
\```

The query planner shows...
````

### Draft Article

```mdx
---
title: "Upcoming Feature: React 19 Server Actions"
date: "2024-11-15"
summary: "Exploring the new Server Actions API in React 19 and how it changes data mutations."
tags: ["react", "nextjs", "preview"]
published: false # Won't appear in production
---

# React 19 Server Actions

This article is a work in progress...
```

## Automatic Features

When you add an MDX file, it automatically:

1. **Appears in articles list** - Sorted by date (newest first)
2. **Shows on homepage** - Latest 5 articles displayed
3. **Gets own page** - At `/articles/your-slug`
4. **Generates sitemap** - Included in sitemap.xml
5. **Creates RSS entry** - Added to RSS feed
6. **Optimizes SEO** - Metadata and JSON-LD structured data

## Styling

The following elements are automatically styled:

- ✅ Headings (H1-H6)
- ✅ Paragraphs and line breaks
- ✅ Links (internal and external)
- ✅ Lists (ordered and unordered)
- ✅ Code blocks with syntax highlighting
- ✅ Inline code
- ✅ Blockquotes
- ✅ Tables
- ✅ Images
- ✅ Horizontal rules

All styling matches your site's design system.

## Best Practices

### 1. Use Descriptive Slugs

Good: `microservices-authentication-patterns`
Bad: `post-1` or `article-123`

### 2. Write Concise Summaries

- 150-300 characters ideal
- Focus on what readers will learn
- Include key topics/technologies

### 3. Choose Relevant Tags

- Use 2-5 tags per article
- Be consistent with tag names
- Use lowercase
- Think about how readers search

### 4. Date Format

Always use ISO format: `YYYY-MM-DD`

Good: `2024-11-12`
Bad: `Nov 12, 2024` or `12/11/2024`

### 5. Code Blocks

Always specify the language for syntax highlighting:

\```javascript ← Language specified
\```typescript
\```python
\```bash

### 6. Images

- Use descriptive alt text
- Optimize images before adding
- Consider using external CDN for large images

## Troubleshooting

### Article Not Showing Up

1. Check filename ends with `.mdx`
2. Verify frontmatter format (YAML between `---`)
3. Ensure `published: false` isn't set
4. Check date isn't in the future
5. Rebuild the site: `pnpm build`

### Styling Issues

- Verify MDX syntax is valid
- Check code block language is supported
- Ensure images have valid URLs

### Build Errors

- Validate frontmatter YAML syntax
- Check for unescaped special characters
- Verify all required fields are present

## Workflow

### Adding a New Article

```bash
# 1. Create the file
touch content/articles/my-new-article.mdx

# 2. Edit with your editor
code content/articles/my-new-article.mdx

# 3. Preview locally
pnpm dev

# 4. Visit: http://localhost:3000/articles/my-new-article

# 5. When ready, commit
git add content/articles/my-new-article.mdx
git commit -m "feat(content): add article about X"
git push

# 6. Deploy (automatic on Vercel)
```

### Updating an Existing Article

Just edit the `.mdx` file and save. Changes appear immediately after rebuild/redeploy.

### Removing an Article

**Option 1**: Delete the file
**Option 2**: Set `published: false` in frontmatter (keeps file but hides from production)

## Migration from articles.ts

The old `articles.ts` file with hardcoded metadata is now replaced by MDX files. To migrate:

1. For each entry in `articles.ts`, create an `.mdx` file
2. Copy the metadata to frontmatter
3. Add the full article content
4. The old entries will be automatically replaced

The `legacyArticles` export in `articles.ts` is kept for reference during migration.

## Advanced: Custom Components

You can create custom MDX components for special content:

```tsx
// src/components/mdx/Callout.tsx
export function Callout({ children, type = "info" }) {
  return <div className={`callout callout-${type}`}>{children}</div>;
}
```

Use in articles:

```mdx
import { Callout } from "@/components/mdx/Callout";

<Callout type="warning">This is an important warning!</Callout>
```

## Questions?

- Check `docs/link-checker.md` for verifying links
- See `src/lib/mdx.ts` for the article loading logic
- Review `content/articles/` for examples
