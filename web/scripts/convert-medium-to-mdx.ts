import * as fs from 'fs';
import * as path from 'path';

import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

interface ArticleMetadata {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  canonicalUrl: string;
  published: boolean;
}

// Configure Turndown for better HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
});

// Add GitHub Flavored Markdown support
turndownService.use(gfm);

// Custom rules for better conversion
turndownService.addRule('codeBlock', {
  filter: (node: Node) => {
    return (
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    );
  },
  replacement: (_content: string, node: Node) => {
    const codeNode = node.firstChild as HTMLElement;
    const lang = codeNode.getAttribute('data-code-block-lang') || '';
    const code = codeNode.textContent || '';
    return '\n\n```' + lang + '\n' + code + '\n```\n\n';
  },
});

function extractMetadataFromHTML(htmlContent: string, filename: string): ArticleMetadata {
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  // Extract title
  const titleElement = doc.querySelector('h1.p-name, title');
  const title = titleElement?.textContent?.trim() || 'Untitled';

  // Extract subtitle as summary
  const subtitleElement = doc.querySelector('section[data-field="subtitle"]');
  const summary = subtitleElement?.textContent?.trim() || '';

  // Extract canonical URL
  const canonicalLink = doc.querySelector('a.p-canonical');
  const canonicalUrl = canonicalLink?.getAttribute('href') || '';

  // Extract date from filename (format: YYYY-MM-DD_Title)
  const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})_/);
  const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : '';

  // Check if it's a draft
  const published = !filename.startsWith('draft_');

  // Extract tags from content (this is a simple heuristic)
  const tags: string[] = [];
  const content = doc.querySelector('section[data-field="body"]')?.textContent || '';

  // Simple tag extraction based on common programming keywords
  const commonTags = [
    'java', 'spring-boot', 'microservices', 'security', 'aws', 'database',
    'algorithms', 'data-structures', 'architecture', 'performance',
    'cloud', 'devops', 'testing', 'best-practices'
  ];

  commonTags.forEach(tag => {
    if (content.toLowerCase().includes(tag.replace('-', ' '))) {
      tags.push(tag);
    }
  });

  return {
    title,
    date,
    summary,
    tags: tags.slice(0, 5), // Limit to 5 tags
    canonicalUrl,
    published,
  };
}

function extractContentFromHTML(htmlContent: string): string {
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  // Get the main content section
  const contentSection = doc.querySelector('section[data-field="body"]');

  if (!contentSection) {
    return '';
  }

  // Remove hidden sections
  const hiddenSections = contentSection.querySelectorAll('header, section[data-field="subtitle"], section[data-field="description"]');
  hiddenSections.forEach((section: Element) => section.remove());

  // Convert HTML to Markdown
  let markdown = turndownService.turndown(contentSection.innerHTML);

  // Post-process: Escape curly braces outside of code blocks for MDX
  markdown = escapeCurlyBracesOutsideCodeBlocks(markdown);

  return markdown;
}

function escapeCurlyBracesOutsideCodeBlocks(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // Check if we're entering or leaving a code block
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    // If we're in a code block, don't escape anything
    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // Outside code blocks, escape curly braces for MDX
    const escapedLine = line
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}');

    result.push(escapedLine);
  }

  return result.join('\n');
}

function extractImages(htmlContent: string, articleSlug: string): void {
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  const images = doc.querySelectorAll('img.graf-image');

  images.forEach((img: Element) => {
    const src = img.getAttribute('src') || img.getAttribute('data-src');
    if (src && src.startsWith('http')) {
      // Note: In a real implementation, you would download these images
      // For now, we'll just keep the external URLs
      console.log(`Image found for ${articleSlug}: ${src}`);
    }
  });
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

function generateFrontmatter(metadata: ArticleMetadata): string {
  const tags = metadata.tags.map(tag => `"${tag}"`).join(', ');

  // Escape single quotes for YAML single-quoted strings
  const escapeSingleQuotes = (str: string) => {
    return str.replace(/'/g, "''");
  };

  return `---
title: '${escapeSingleQuotes(metadata.title)}'
date: "${metadata.date}"
summary: '${escapeSingleQuotes(metadata.summary)}'
tags: [${tags}]
source: "Medium"
canonicalUrl: "${metadata.canonicalUrl}"
published: ${metadata.published}
---

`;
}

async function convertMediumToMDX() {
  const mediumPostsDir = path.join(process.cwd(), 'content/medium-export/posts');
  const outputDir = path.join(process.cwd(), 'content/articles');

  if (!fs.existsSync(mediumPostsDir)) {
    console.error('Medium posts directory not found:', mediumPostsDir);
    return;
  }

  const files = fs.readdirSync(mediumPostsDir).filter(f => f.endsWith('.html'));

  console.log(`Found ${files.length} HTML files to convert`);

  for (const file of files) {
    try {
      const filePath = path.join(mediumPostsDir, file);
      const htmlContent = fs.readFileSync(filePath, 'utf-8');

      // Extract metadata
      const metadata = extractMetadataFromHTML(htmlContent, file);

      // Skip if no date (likely a comment or short post)
      if (!metadata.date) {
        console.log(`Skipping ${file} - no date found`);
        continue;
      }

      // Create article slug
      const slug = createSlug(metadata.title);
      const articleDir = path.join(outputDir, slug);

      // Create article directory
      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
      }

      // Extract and save images
      extractImages(htmlContent, slug);

      // Extract content
      const content = extractContentFromHTML(htmlContent);

      // Generate frontmatter
      const frontmatter = generateFrontmatter(metadata);

      // Combine frontmatter and content
      const mdxContent = frontmatter + content;

      // Write MDX file
      const mdxFilePath = path.join(articleDir, 'index.mdx');
      fs.writeFileSync(mdxFilePath, mdxContent);

      console.log(`✓ Converted: ${file} -> ${slug}/index.mdx`);
    } catch (error) {
      console.error(`✗ Error converting ${file}:`, error);
    }
  }

  console.log('\nConversion complete!');
}

// Run the conversion
convertMediumToMDX().catch(console.error);
