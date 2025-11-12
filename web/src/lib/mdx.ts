import fs from "fs";
import path from "path";

import matter from "gray-matter";

import { Article } from "@/content/articles";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export interface ArticleFrontmatter {
  title: string;
  date: string; // ISO yyyy-mm-dd
  summary: string;
  tags: string[];
  source?: string;
  canonicalUrl?: string;
  published?: boolean; // Optional flag to hide unpublished articles
}

/**
 * Get all article slugs from the articles directory
 * Supports both flat structure (slug.mdx) and nested structure (slug/index.mdx)
 */
export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const entries = fs.readdirSync(articlesDirectory, { withFileTypes: true });
  const slugs: string[] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      // Flat structure: slug.mdx
      slugs.push(entry.name.replace(/\.mdx$/, ""));
    } else if (entry.isDirectory()) {
      // Nested structure: slug/index.mdx
      const indexPath = path.join(articlesDirectory, entry.name, "index.mdx");
      if (fs.existsSync(indexPath)) {
        slugs.push(entry.name);
      }
    }
  }

  return slugs;
}

/**
 * Get article data by slug
 * Supports both flat structure (slug.mdx) and nested structure (slug/index.mdx)
 */
export function getArticleBySlug(slug: string): {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
} | null {
  try {
    // Try nested structure first (slug/index.mdx)
    let fullPath = path.join(articlesDirectory, slug, "index.mdx");

    // Fall back to flat structure (slug.mdx)
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(articlesDirectory, `${slug}.mdx`);
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: data as ArticleFrontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

/**
 * Get all articles sorted by date (newest first)
 */
export function getAllArticles(): Article[] {
  const slugs = getAllArticleSlugs();

  const articles = slugs
    .map((slug) => {
      const article = getArticleBySlug(slug);
      if (!article) return null;

      // Filter out unpublished articles in production
      if (
        process.env.NODE_ENV === "production" &&
        article.frontmatter.published === false
      ) {
        return null;
      }

      return {
        slug,
        ...article.frontmatter,
      } as Article;
    })
    .filter((article): article is Article => article !== null);

  // Sort by date (newest first)
  return articles.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get article metadata for static generation
 */
export function getArticleMetadata(slug: string) {
  const article = getArticleBySlug(slug);
  if (!article) return null;

  return {
    slug,
    ...article.frontmatter,
  };
}
