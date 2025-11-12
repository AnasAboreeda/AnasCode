# Automated Twitter Cache Updates with GitHub Actions

## Overview

This setup uses GitHub Actions to automatically fetch and cache your latest tweets every morning at 6:00 AM UTC. The cached tweets are committed to the repository, so your deployed site **never makes live API calls** to Twitter.

## How It Works

```
GitHub Actions (Daily 6 AM UTC)
    ↓
Fetch tweets from Twitter API (2 API calls)
    ↓
Save to .cache/ directory
    ↓
Commit changes to repository
    ↓
Vercel auto-deploys with fresh tweets
    ↓
Site serves tweets from committed cache (0 API calls)
```

## Setup Instructions

### 1. Add GitHub Secrets

Go to your GitHub repository:

1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name                   | Value                            |
| ----------------------------- | -------------------------------- |
| `TWITTER_API_KEY`             | Your Twitter API Key             |
| `TWITTER_API_SECRET`          | Your Twitter API Secret          |
| `TWITTER_ACCESS_TOKEN`        | Your Twitter Access Token        |
| `TWITTER_ACCESS_TOKEN_SECRET` | Your Twitter Access Token Secret |

### 2. Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. Enable workflows if prompted
3. The workflow will run automatically every day at 6:00 AM UTC

### 3. Configure Workflow Schedule (Optional)

Edit `.github/workflows/update-twitter-cache.yml`:

```yaml
on:
  schedule:
    # Change the cron schedule as needed
    - cron: "0 6 * * *" # 6 AM UTC daily


    # Examples:
    # - cron: '0 12 * * *'  # 12 PM UTC daily
    # - cron: '0 6 * * 1'   # 6 AM UTC every Monday
    # - cron: '0 */12 * * *' # Every 12 hours
```

**Cron Format**: `minute hour day month weekday`

**Common Schedules**:

- `0 6 * * *` - Every day at 6:00 AM UTC
- `0 0 * * *` - Every day at midnight UTC
- `0 8 * * 1-5` - Weekdays at 8:00 AM UTC
- `0 */6 * * *` - Every 6 hours

### 4. Manual Trigger

You can also run the workflow manually:

1. Go to **Actions** tab
2. Select **Update Twitter Cache** workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

## Verification

### Check Workflow Status

1. Go to **Actions** tab
2. Click on latest workflow run
3. View logs to see:
   - Cache refresh status
   - Number of tweets fetched
   - Commit status

### Expected Logs

```
✅ Successfully cached 3 tweets
Cache will expire in 7 days
[Cache] Written: twitter_AnasAboreeda_3 (expires in 604800s)
```

### Check Commits

The workflow creates commits like:

```
chore: update Twitter cache [skip ci]
```

**Note**: `[skip ci]` prevents infinite workflow loops

## API Usage

### Monthly API Calls

With daily updates:

- **API calls per day**: 2 (user lookup + tweets fetch)
- **API calls per month**: ~60
- **Free tier limit**: 100/month
- **Safety margin**: 40 calls remaining

### Runtime API Calls

- **Development**: 0 (reads from committed cache)
- **Production**: 0 (reads from committed cache)
- **Deployment**: 0 (uses committed cache)

**Total**: ~60 API calls/month (only from GitHub Actions)

## Cache Management

### View Cache Locally

```bash
# Check cache status
pnpm cache:stats

# View cache contents
cat .cache/twitter_AnasAboreeda_3.json
```

### Manual Cache Update

If you want to update cache immediately (e.g., after posting):

```bash
# Refresh cache locally
pnpm cache:refresh

# Commit and push
git add .cache/
git commit -m "chore: update Twitter cache"
git push
```

Or trigger GitHub Action manually (see step 4 above).

### Clear Cache

```bash
# Clear cache locally
pnpm cache:clear

# Commit removal
git add .cache/
git commit -m "chore: clear Twitter cache"
git push
```

## Troubleshooting

### Workflow Not Running

**Check**:

1. GitHub Actions enabled in repository settings
2. Workflow file in correct location: `.github/workflows/`
3. Repository has commits (cron jobs don't run on empty repos)

**Solution**: Trigger workflow manually to test

### Authentication Errors

**Check**:

1. All 4 secrets are set in GitHub
2. No extra spaces in secret values
3. Secrets match your Twitter app credentials

**Solution**: Re-add secrets in GitHub Settings

### No Changes Committed

**Possible Reasons**:

1. Cache hasn't expired yet (7-day TTL)
2. No new tweets since last run
3. API rate limit reached

**Check Logs**: Look for "No changes detected" message

### Workflow Fails

**Common Issues**:

1. Invalid Twitter credentials → Check secrets
2. Rate limit exceeded → Reduce frequency
3. Git push fails → Check repository permissions

**Solution**: Check workflow logs in Actions tab

## Deployment Integration

### Vercel

**Automatic**: Vercel watches your repository

- Detects cache commit
- Triggers new deployment
- Includes fresh tweets

**Configuration**: No changes needed, works out of the box

### Other Platforms

Same principle applies:

- Cache committed to git
- Platform detects changes
- Redeploys with fresh cache

## Benefits

✅ **Zero runtime API calls** - All tweets served from committed cache
✅ **Automatic updates** - Fresh tweets every morning
✅ **Version controlled** - Tweet history in git
✅ **No cold starts** - Cache always available
✅ **Rate limit friendly** - ~60 calls/month (under 100 limit)
✅ **Manual control** - Trigger updates anytime
✅ **Deployment sync** - Vercel auto-deploys on cache updates

## Monitoring

### GitHub Actions Dashboard

- View workflow runs
- Check success/failure status
- Review execution times
- Download logs

### Twitter Developer Portal

Monitor API usage:

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Select your app
3. View **Usage** metrics
4. Check monthly API call count

### Set Up Notifications

Get alerted on workflow failures:

1. Repository → **Settings** → **Notifications**
2. Enable **Actions** notifications
3. Or use GitHub mobile app

## Cost Analysis

| Resource           | Cost                         |
| ------------------ | ---------------------------- |
| GitHub Actions     | Free (2000 minutes/month)    |
| Twitter API        | Free (100 calls/month)       |
| Git Storage        | Negligible (~1 KB per cache) |
| Vercel Deployments | Free tier (100/day)          |
| **Total**          | **$0**                       |

## Alternatives Considered

| Method         | API Calls     | Real-time | Cost            | Decision          |
| -------------- | ------------- | --------- | --------------- | ----------------- |
| Live API calls | Every request | ✅        | Free tier       | ❌ Exceeds limits |
| Next.js ISR    | ~720/month    | ✅        | Free            | ❌ Too many calls |
| GitHub Actions | ~60/month     | ❌        | Free            | ✅ **Chosen**     |
| Webhook-based  | Only on tweet | ✅        | Requires server | ⚠️ Complex        |

## Future Enhancements

### Webhook Integration (Advanced)

Instead of daily schedule, update on new tweets:

1. Set up Twitter webhook
2. Trigger GitHub Actions via repository dispatch
3. Instant updates when you tweet

**Benefits**: Real-time updates, fewer API calls
**Complexity**: Requires webhook endpoint

### Multi-User Support

Fetch tweets from multiple users:

```yaml
- name: Refresh Twitter cache
  run: |
    pnpm cache:refresh
    # Add more users as needed
```

### Conditional Updates

Only update if you've tweeted:

```yaml
- name: Check for new tweets
  # Add logic to compare tweet count
  # Only commit if count increased
```

## Summary

This GitHub Actions workflow:

- ✅ Runs automatically every morning
- ✅ Fetches latest tweets (~2 API calls)
- ✅ Commits cache to repository
- ✅ Triggers Vercel deployment
- ✅ Site serves from cache (0 runtime calls)
- ✅ Stays well under 100 API calls/month
- ✅ Completely free

**Result**: Your website always shows fresh tweets without any runtime API calls! 🚀
