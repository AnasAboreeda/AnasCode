# Twitter Integration Architecture

## Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Actions (Daily 6 AM)                  │
│                                                                   │
│  1. Checkout repository                                          │
│  2. Install dependencies                                         │
│  3. Run: pnpm cache:refresh                                      │
│     ├─> Call Twitter API (2 requests)                           │
│     ├─> Fetch latest tweets                                     │
│     └─> Save to .cache/twitter_*.json                           │
│  4. Git commit: "chore: update Twitter cache [skip ci]"        │
│  5. Git push to main branch                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                         │
│                                                                   │
│  main/                                                           │
│  ├── .cache/                                                     │
│  │   └── twitter_AnasAboreeda_3.json ← Committed cache         │
│  ├── .github/workflows/                                          │
│  │   └── update-twitter-cache.yml    ← Daily workflow          │
│  └── src/lib/                                                    │
│      ├── twitter.ts                   ← API client              │
│      └── cache.ts                     ← Cache utilities         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Vercel (Auto-Deploy)                       │
│                                                                   │
│  1. Detects new commit                                           │
│  2. Pulls latest code (includes .cache/)                        │
│  3. Runs: pnpm build                                             │
│  4. Deploys to production                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Production Website                          │
│                                                                   │
│  User visits homepage                                            │
│       │                                                           │
│       ▼                                                           │
│  fetchUserTweets("AnasAboreeda", 3)                             │
│       │                                                           │
│       ├─> Check .cache/twitter_AnasAboreeda_3.json             │
│       │   ├─> Cache HIT (age: 12 hours)                        │
│       │   └─> Return cached tweets                              │
│       │                                                           │
│       └─> NO API CALL! ✅                                       │
│                                                                   │
│  Result: Instant load, zero API usage                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## API Call Flow

### Traditional Approach (Every Request)

```
User Request → Next.js Server → Twitter API → Response → User
                                    ↑
                               Rate Limited!
                           (100 calls/month)
```

### Our Approach (GitHub Actions)

```
GitHub Actions (Daily) → Twitter API → .cache/ → Git Commit
                              ↑
                         2 calls/day
                       ~60 calls/month

User Request → Next.js Server → .cache/ (local file) → Response → User
                                     ↑
                              NO API CALL!
                              Unlimited!
```

## Rate Limit Comparison

| Approach               | API Calls/Day | API Calls/Month | Under Limit? |
| ---------------------- | ------------- | --------------- | ------------ |
| Per Request (ISR 1h)   | ~720          | ~21,600         | ❌ WAY OVER  |
| Per Request (ISR 24h)  | ~30           | ~900            | ❌ 9x over   |
| GitHub Actions (Daily) | 2             | ~60             | ✅ 40% usage |
| Manual Only            | 0-10          | 0-10            | ✅ 10% usage |

## Cache Lifecycle

```
Day 0: 6:00 AM
├─> GitHub Action runs
├─> Fetch tweets (2 API calls)
├─> Save to .cache/twitter_*.json
├─> Commit: "chore: update Twitter cache"
├─> Push to GitHub
└─> Vercel deploys

Day 0-7: All Day
├─> Users visit site (1000s of requests)
├─> All read from .cache/ file
├─> Zero API calls
└─> Instant response

Day 1: 6:00 AM
├─> GitHub Action runs
├─> Check for new tweets
├─> If tweets changed:
│   ├─> Update cache
│   ├─> Commit changes
│   └─> Vercel redeploys
└─> If no change:
    └─> Skip commit (cache still valid)

Day 7: 6:00 AM
├─> Cache expires (7-day TTL)
├─> Force refresh from API
├─> Update cache regardless
└─> Reset 7-day cycle
```

## File Structure

```
AnasCode-V2/
├── .cache/                              ← Committed to git
│   └── twitter_AnasAboreeda_3.json     ← Tweet cache
│       {
│         "data": [...],                 ← 3 latest tweets
│         "timestamp": 1699776000000,    ← Fetch time
│         "expiresAt": 1700380800000     ← Expiry (7 days)
│       }
│
├── .github/
│   └── workflows/
│       └── update-twitter-cache.yml     ← Daily workflow
│
├── src/
│   ├── lib/
│   │   ├── cache.ts                     ← Cache utilities
│   │   │   ├── getCache()               ← Read cache
│   │   │   ├── setCache()               ← Write cache
│   │   │   └── getCacheStats()          ← Cache info
│   │   │
│   │   └── twitter.ts                   ← Twitter client
│   │       ├── fetchUserTweets()        ← Main function
│   │       │   ├─> Check cache first
│   │       │   ├─> Return if cache hit
│   │       │   ├─> Fetch from API if miss
│   │       │   └─> Save to cache
│   │       │
│   │       ├── generateOAuthSignature() ← OAuth 1.0a
│   │       └── buildOAuthHeader()       ← Auth headers
│   │
│   └── app/(site)/page.tsx              ← Homepage
│       └── fetchUserTweets("AnasAboreeda", 3)
│
├── scripts/
│   └── manage-cache.ts                  ← CLI tool
│       ├── pnpm cache:refresh
│       ├── pnpm cache:clear
│       └── pnpm cache:stats
│
└── docs/
    ├── github-actions-twitter.md        ← Full guide
    ├── twitter-caching.md               ← Cache strategy
    └── setup-checklist.md               ← Quick setup
```

## Environment Variables

### Development (.env.local)

```env
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_TOKEN_SECRET=xxx
```

### GitHub Actions (Secrets)

```
Settings → Secrets → Actions
├── TWITTER_API_KEY
├── TWITTER_API_SECRET
├── TWITTER_ACCESS_TOKEN
└── TWITTER_ACCESS_TOKEN_SECRET
```

### Vercel (NOT NEEDED!)

```
❌ No Twitter secrets needed in Vercel
✅ Site reads from committed .cache/ files
```

## Cost Breakdown

| Service            | Usage           | Limit           | Cost   |
| ------------------ | --------------- | --------------- | ------ |
| GitHub Actions     | ~2 min/day      | 2000 min/month  | Free   |
| Twitter API        | ~60 calls/month | 100 calls/month | Free   |
| Vercel Deployments | ~30/month       | 100/day         | Free   |
| Git Storage        | ~100 KB/year    | Unlimited       | Free   |
| **Total**          |                 |                 | **$0** |

## Performance Metrics

### Traditional (Live API)

- First Load: 500-1000ms (API latency)
- Subsequent: 500-1000ms (per request)
- API Calls: Every request
- Cold Start: 1-2 seconds

### Our Approach (Cached)

- First Load: 50-100ms (file read)
- Subsequent: 5-10ms (cached)
- API Calls: Zero
- Cold Start: Same as static content

## Summary

✅ **Zero runtime API calls** - All tweets from committed cache
✅ **Automatic updates** - GitHub Actions runs daily
✅ **Cost: $0** - Everything on free tiers
✅ **Fast** - File reads faster than API calls
✅ **Reliable** - No API rate limit errors
✅ **Scalable** - Handles unlimited traffic
✅ **Simple** - Standard git workflow

**Result**: Enterprise-grade caching on free tier! 🚀
