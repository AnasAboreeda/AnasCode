import fs from "fs";
import path from "path";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache directory is in the web project
const CACHE_DIR = path.join(process.cwd(), "..", "web", ".cache");

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

      try {
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
      } catch {
        // Skip files that cannot be accessed (e.g., deleted during iteration)
        console.warn(`[Cache] Could not access file: ${file}`);
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
