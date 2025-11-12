import fs from "fs";
import path from "path";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const CACHE_DIR = path.join(process.cwd(), ".cache");

/**
 * Ensure cache directory exists
 */
function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Get cache file path for a key
 */
function getCacheFilePath(key: string): string {
  const sanitizedKey = key.replace(/[^a-z0-9]/gi, "_");
  return path.join(CACHE_DIR, `${sanitizedKey}.json`);
}

/**
 * Write data to cache with TTL (time to live in seconds)
 */
export function setCache<T>(key: string, data: T, ttlSeconds: number): void {
  try {
    ensureCacheDir();
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlSeconds * 1000,
    };
    const filePath = getCacheFilePath(key);
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), "utf-8");
    console.log(`[Cache] Written: ${key} (expires in ${ttlSeconds}s)`);
  } catch (error) {
    console.error(`[Cache] Error writing cache for ${key}:`, error);
  }
}

/**
 * Read data from cache, returns null if expired or not found
 */
export function getCache<T>(key: string): T | null {
  try {
    const filePath = getCacheFilePath(key);

    if (!fs.existsSync(filePath)) {
      console.log(`[Cache] Miss: ${key} (file not found)`);
      return null;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const entry: CacheEntry<T> = JSON.parse(content);

    // Check if cache is expired
    if (Date.now() > entry.expiresAt) {
      console.log(`[Cache] Expired: ${key}`);
      // Optionally delete expired cache
      fs.unlinkSync(filePath);
      return null;
    }

    const ageMinutes = Math.round((Date.now() - entry.timestamp) / 1000 / 60);
    console.log(`[Cache] Hit: ${key} (age: ${ageMinutes}m)`);
    return entry.data;
  } catch (error) {
    console.error(`[Cache] Error reading cache for ${key}:`, error);
    return null;
  }
}

/**
 * Clear all cache files
 */
export function clearCache(): void {
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      files.forEach((file) => {
        fs.unlinkSync(path.join(CACHE_DIR, file));
      });
      console.log(`[Cache] Cleared ${files.length} files`);
    }
  } catch (error) {
    console.error("[Cache] Error clearing cache:", error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  files: number;
  totalSize: number;
  oldestAge: number;
} {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      return { files: 0, totalSize: 0, oldestAge: 0 };
    }

    const files = fs.readdirSync(CACHE_DIR);
    let totalSize = 0;
    let oldestTimestamp = Date.now();

    files.forEach((file) => {
      const filePath = path.join(CACHE_DIR, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;

      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const entry: CacheEntry<unknown> = JSON.parse(content);
        if (entry.timestamp < oldestTimestamp) {
          oldestTimestamp = entry.timestamp;
        }
      } catch {
        // Ignore parse errors
      }
    });

    return {
      files: files.length,
      totalSize,
      oldestAge: Math.round((Date.now() - oldestTimestamp) / 1000 / 60),
    };
  } catch (error) {
    console.error("[Cache] Error getting stats:", error);
    return { files: 0, totalSize: 0, oldestAge: 0 };
  }
}
