#!/usr/bin/env tsx

import { getAllArticles } from '../src/lib/mdx';

console.log('Testing article discovery...\n');

const articles = getAllArticles();

console.log(`Found ${articles.length} articles:\n`);

articles.forEach((article, index) => {
  console.log(`${index + 1}. ${article.title}`);
  console.log(`   Slug: ${article.slug}`);
  console.log(`   Date: ${article.date}`);
  console.log(`   Published: ${article.published !== false}`);
  console.log('');
});

if (articles.length === 0) {
  console.error('❌ No articles found! Check the article structure.');
  process.exit(1);
} else {
  console.log(`✅ Successfully found ${articles.length} articles!`);
}
