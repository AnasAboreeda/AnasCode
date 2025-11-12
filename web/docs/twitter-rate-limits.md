# Twitter API Rate Limits Guide

## Understanding Rate Limits

Twitter API has rate limits to prevent abuse. When you hit a limit, you must wait for the window to reset.

### Free Tier Limits (per 15-minute window)

| Endpoint                                       | Requests per 15 min |
| ---------------------------------------------- | ------------------- |
| User lookup (GET /users/by/username/:username) | 300                 |
| User tweets (GET /users/:id/tweets)            | 1,500               |

**Note**: These are shared across all requests from your Bearer Token.

## Current Implementation

Our code includes:

- ✅ 2-second throttling between requests
- ✅ Rate limit detection (429 status)
- ✅ Reset time display
- ✅ Graceful error handling

## When You Hit Rate Limits

### Symptoms

```
Twitter API error: 429
Response body: {"title":"Too Many Requests","detail":"Too Many Requests","type":"about:blank","status":429}
```

### Solution

**Wait 15 minutes** and try again. The rate limit window resets every 15 minutes.

### Check Reset Time

The error message shows:

```
Twitter API rate limit reached. Resets at: [DATE TIME]
Wait approximately X minutes
```

## Testing Strategy

### ❌ Don't Do This

```bash
# Rapid testing - will hit rate limits
pnpm cache:refresh
pnpm cache:refresh
pnpm cache:refresh
```

### ✅ Do This Instead

1. **Test Once**

   ```bash
   pnpm cache:refresh
   ```

2. **Check if it worked**

   ```bash
   pnpm cache:stats
   ls -lh .cache/
   ```

3. **If successful**, commit the cache:

   ```bash
   git add .cache/
   git commit -m "chore: initial tweets cache"
   git push
   ```

4. **If rate limited**, wait 15 minutes before trying again

## Production Strategy

### GitHub Actions Approach (Recommended)

With daily GitHub Actions:

- **Runs**: Once per day at 6 AM
- **API Calls**: 2 per day
- **Monthly Total**: ~60 calls
- **Rate Limit Risk**: **Zero** (well under limits)

This is why we use GitHub Actions instead of real-time fetching!

### Manual Updates

If you want to manually update:

```bash
# 1. Post new tweets on Twitter

# 2. Wait a few minutes for Twitter to process

# 3. Refresh cache
pnpm cache:refresh

# 4. Commit and push
git add .cache/
git commit -m "chore: update tweets cache"
git push
```

**Frequency**: Max once per hour to be safe

## Avoiding Rate Limits

### Best Practices

1. **Cache Aggressively**
   - Our 7-day cache TTL means we rarely hit the API
   - Cache is committed to git
   - Site never makes runtime API calls

2. **Throttle Requests**
   - 2-second wait between requests (implemented)
   - Don't test repeatedly

3. **Use GitHub Actions**
   - Runs once daily
   - Predictable schedule
   - Easy to monitor

4. **Monitor Usage**
   - Check Twitter Developer Portal
   - Track monthly API calls
   - Set alerts at 80% usage

## If You're Rate Limited Now

### Option 1: Wait (Recommended)

```bash
# Check current time
date

# Wait 15 minutes, then:
pnpm cache:refresh
```

### Option 2: Use Test Data (Development Only)

Create a mock cache file for testing:

```bash
# Create .cache directory
mkdir -p .cache

# Create test cache (expires in 7 days)
cat > .cache/twitter_AnasAboreeda_10.json << 'EOF'
{
  "data": [
    {
      "id": "1234567890",
      "text": "Test tweet for development",
      "created_at": "2024-11-12T12:00:00.000Z",
      "author": {
        "username": "AnasAboreeda",
        "name": "Anas Aboreeda",
        "profile_image_url": "https://pbs.twimg.com/profile_images/example.jpg"
      },
      "public_metrics": {
        "retweet_count": 0,
        "reply_count": 0,
        "like_count": 0,
        "quote_count": 0
      }
    }
  ],
  "timestamp": $(date +%s)000,
  "expiresAt": $(($(date +%s) + 604800))000
}
EOF

# Check if it works
pnpm dev
```

### Option 3: Wait for GitHub Actions

Once you push to GitHub and set up the workflow:

- GitHub Actions will run daily
- It won't hit rate limits (only 2 calls/day)
- Cache will be committed automatically

## Monitoring

### Check API Usage

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Select your app
3. View "Usage" section
4. Monitor requests per month

### Rate Limit Headers

Twitter returns these headers:

```
x-rate-limit-limit: 300          # Max requests per window
x-rate-limit-remaining: 0        # Requests left
x-rate-limit-reset: 1699876543   # Unix timestamp when resets
```

Our code automatically reads and displays these!

## Summary

### Why This Happens

- Multiple test attempts in short time
- Twitter's 15-minute rate limit windows

### Why It's Not a Problem in Production

- GitHub Actions runs once daily (~2 API calls)
- Cache persists for 7 days
- Site reads from cache (0 runtime API calls)
- Well under 100 calls/month limit

### What to Do Now

1. ⏰ **Wait 15 minutes**
2. 🔄 **Run `pnpm cache:refresh`**
3. ✅ **Commit cache to git**
4. 🚀 **Push to GitHub**
5. ⚙️ **Set up GitHub Actions**
6. 🎉 **Never worry about rate limits again!**

The beauty of the caching strategy is that once the cache is committed, you'll rarely need to fetch from the API again! 🚀
