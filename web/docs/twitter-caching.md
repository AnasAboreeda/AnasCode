# Twitter Cache Strategy

## Overview

To minimize Twitter API calls and stay within the free tier rate limit (100 requests/month), we implement a multi-layer caching strategy with persistent file storage.

## Caching Architecture

### 1. Persistent File Cache (Primary)

- **Location**: `.cache/` directory (gitignored)
- **TTL**: 7 days (configurable in `src/lib/twitter.ts`)
- **Storage**: JSON files with metadata (timestamp)
- **Benefits**:
  - Survives server restarts
  - Works in serverless environments (Vercel)
  - Minimal API calls (only ~4-5 per month with weekly updates)

### 2. How It Works

```
Request → Check file cache → Cache hit? → Return cached tweets
                           ↓
                       Cache miss
                           ↓
                    Call Twitter API
                           ↓
                Save to file cache (7-day TTL)
                           ↓
                   Return fresh tweets
```

## Configuration

### Cache Duration

Edit `CACHE_TTL_SECONDS` in `src/lib/twitter.ts`:

```typescript
// Current: 7 days
const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;

// Options:
// 3 days:  3 * 24 * 60 * 60
// 14 days: 14 * 24 * 60 * 60
// 30 days: 30 * 24 * 60 * 60
```

**Recommended**: 7-14 days for personal sites

### Rate Limit Calculation

With 7-day cache:

- API calls per month: ~4-5 (well under 100 limit)
- Requests per cache refresh: 2 (user lookup + tweets fetch)
- Total capacity: Can refresh ~50 times/month

## Cache Management

### Check Cache Status

```bash
pnpm cache:stats
```

Shows:

- Number of cached files
- Total cache size
- Age of oldest cache entry

### Refresh Cache (Force Update)

```bash
pnpm cache:refresh
```

Use this when:

- You've posted new tweets
- Want to manually update homepage
- Testing cache behavior

**Note**: This makes 2 API calls

### Clear All Cache

```bash
pnpm cache:clear
```

Removes all cached data. Next request will fetch from API.

## Deployment Considerations

### Vercel (Serverless)

**Important**: File system is ephemeral between deployments

**Solutions**:

1. **Cache in Build** (Recommended):

   ```json
   // package.json
   {
     "scripts": {
       "build": "pnpm cache:refresh && next build"
     }
   }
   ```

   - Fetches tweets during build time
   - Includes cache in deployment
   - Zero runtime API calls

2. **Vercel Blob Storage** (Future):
   - Persistent storage across deployments
   - Requires Vercel Blob package
   - Costs money after free tier

3. **Redis/Database** (Overkill):
   - More complex setup
   - Additional costs
   - Not needed for small sites

### Traditional Server (VPS/Docker)

File cache works perfectly:

- `.cache/` directory persists
- Automatic cache refresh every 7 days
- No deployment considerations

## Best Practices

### For Personal Sites

1. **Set cache to 7-14 days**
   - Personal sites don't need real-time updates
   - Maximize rate limit efficiency

2. **Refresh cache on new tweets**

   ```bash
   # After posting tweets
   pnpm cache:refresh
   git add .cache/
   git commit -m "chore: update tweets cache"
   git push
   ```

3. **Include cache in deployments** (optional)
   - Commit `.cache/` to git
   - Remove from `.gitignore`
   - Pros: Zero runtime API calls
   - Cons: Manual refresh needed

### For High-Traffic Sites

Consider:

- External cache service (Redis, Vercel KV)
- Database storage for tweets
- Webhook-based cache invalidation

## Monitoring

### Check API Usage

Monitor in Twitter Developer Portal:

- Dashboard → Your Project → App → Usage
- Track monthly request count
- Set up alerts at 80% usage

### Log Analysis

Watch console output:

```
[Cache] Hit: twitter_username_3 (age: 45m)  # Cache used ✅
[Cache] Miss: twitter_username_3            # API called ⚠️
[Twitter] Cached 3 tweets for @username     # Successful cache
```

## Troubleshooting

### Cache Not Working

1. Check `.cache/` directory exists
2. Verify file permissions (read/write)
3. Check console logs for cache hits/misses

### Too Many API Calls

1. Verify `CACHE_TTL_SECONDS` is set correctly
2. Check if cache files are being persisted
3. Ensure cache directory survives deployments

### Stale Tweets

1. Run `pnpm cache:refresh`
2. Consider reducing `CACHE_TTL_SECONDS`
3. Set up automated refresh on tweet webhooks

## Example: Build-Time Caching

Perfect for Vercel/Netlify deployments:

**package.json**:

```json
{
  "scripts": {
    "build": "pnpm cache:refresh && next build"
  }
}
```

**Benefits**:

- Tweets fetched during build
- Zero runtime API calls
- Cache included in deployment
- Perfect for static exports

**Drawbacks**:

- Need to redeploy for new tweets
- Manual `git push` after posting

**Frequency**: Once per build (typically when deploying new features)

## Alternatives Considered

| Method          | Pros               | Cons                    | Decision                       |
| --------------- | ------------------ | ----------------------- | ------------------------------ |
| Next.js ISR     | Built-in, simple   | Limited to 1h minimum   | Not enough for 100/month limit |
| In-memory cache | Fast               | Lost on restart         | Need persistent cache          |
| Database        | Persistent         | Adds complexity/cost    | Overkill for small site        |
| File cache      | Simple, persistent | Need deploy strategy    | ✅ **Chosen**                  |
| Redis           | Persistent, fast   | Additional service/cost | Future consideration           |

## Summary

The file-based caching system:

- ✅ Keeps you well under 100 API calls/month
- ✅ Simple, no external dependencies
- ✅ Works in development and production
- ✅ Easy to manage with CLI commands
- ✅ Persistent across server restarts
- ⚠️ Requires deployment strategy for Vercel

**Recommendation**: Use 7-day cache + build-time refresh for optimal results.
