#!/usr/bin/env node

/**
 * Ensure Cache Script
 *
 * This script ensures that cache files exist before the build process.
 * It runs as a prebuild step to prevent ENOENT errors during deployment.
 *
 * Strategy:
 * 1. Check if cache directory and files exist
 * 2. If cache exists, exit successfully
 * 3. If cache is missing, create a minimal fallback cache
 * 4. Log status for debugging
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '..', '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'twitter_AnasAboreeda_5.json');

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    console.log('[Prebuild] Creating cache directory...');
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function main() {
  console.log('[Prebuild] Checking cache files...');

  // Ensure cache directory exists
  ensureCacheDir();

  // Check if cache file exists
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cache = JSON.parse(content);

      if (cache.data && Array.isArray(cache.data)) {
        console.log(`[Prebuild] ✅ Cache file exists with ${cache.data.length} items`);
        return;
      }
    } catch (error) {
      console.warn('[Prebuild] ⚠️  Cache file exists but is invalid:', error.message);
      console.warn('[Prebuild] ⚠️  Please run the cache refresh script to regenerate cache');
      return;
    }
  }

  // Cache doesn't exist - this is expected on first build or if cache was cleared
  console.log('[Prebuild] ℹ️  Cache file not found');
  console.log('[Prebuild] ℹ️  The app will work with empty tweets - cache will be populated by GitHub Actions');
  console.log('[Prebuild] ✅ Cache directory ready');
}

try {
  main();
  process.exit(0);
} catch (error) {
  console.error('[Prebuild] ❌ Error checking cache:', error);
  // Don't fail the build - just warn
  console.warn('[Prebuild] ⚠️  Continuing build');
  process.exit(0);
}
