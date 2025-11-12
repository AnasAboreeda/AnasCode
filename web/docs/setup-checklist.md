# GitHub Actions Setup Checklist

Quick reference for setting up automated Twitter cache updates.

## ✅ Setup Steps

### 1. Twitter API Credentials

- [ ] Have Twitter API Key
- [ ] Have Twitter API Secret
- [ ] Have Access Token
- [ ] Have Access Token Secret

### 2. GitHub Repository Secrets

Add these in **Settings** → **Secrets and variables** → **Actions**:

- [ ] `TWITTER_API_KEY`
- [ ] `TWITTER_API_SECRET`
- [ ] `TWITTER_ACCESS_TOKEN`
- [ ] `TWITTER_ACCESS_TOKEN_SECRET`

### 3. Verify Workflow

- [ ] Workflow file exists: `.github/workflows/update-twitter-cache.yml`
- [ ] GitHub Actions enabled in repository
- [ ] `.cache/` is NOT in `.gitignore` (should be committed)

### 4. Initial Test

- [ ] Go to Actions tab
- [ ] Click "Update Twitter Cache" workflow
- [ ] Click "Run workflow" → "Run workflow"
- [ ] Wait for workflow to complete (green checkmark)
- [ ] Verify commit created: "chore: update Twitter cache [skip ci]"
- [ ] Check `.cache/` directory has files

### 5. Vercel Configuration (if using)

- [ ] Repository connected to Vercel
- [ ] Auto-deploy enabled
- [ ] **Remove** Twitter secrets from Vercel (not needed anymore!)

### 6. Deployment Verification

- [ ] Push changes to trigger deployment
- [ ] Visit deployed site
- [ ] Verify tweets are showing
- [ ] Check browser console (should see cache logs)

## 🔍 Verification Commands

```bash
# Check if cache exists locally
ls -la .cache/

# View cache contents
cat .cache/twitter_*.json

# Check cache stats
pnpm cache:stats

# Verify workflow file
cat .github/workflows/update-twitter-cache.yml
```

## ⚙️ Configuration Options

### Change Update Schedule

Edit `.github/workflows/update-twitter-cache.yml`:

```yaml
schedule:
  - cron: "0 6 * * *" # Daily at 6 AM UTC
  # Change to your preferred time
```

### Common Schedules

```yaml
- cron: "0 0 * * *" # Midnight UTC daily
- cron: "0 12 * * *" # Noon UTC daily
- cron: "0 6 * * 1-5" # Weekdays 6 AM UTC
- cron: "0 */12 * * *" # Every 12 hours
```

## 🚨 Troubleshooting

### Workflow Not Running

```bash
# Check workflow status
# Go to: GitHub → Actions tab → View runs
```

**Fix**: Manually trigger workflow to test

### Authentication Errors

```bash
# Verify secrets are set
# Go to: Settings → Secrets → Check all 4 secrets exist
```

**Fix**: Re-add secrets (copy-paste from Twitter Developer Portal)

### No Tweets Showing

```bash
# Check cache file exists
ls -la .cache/

# Check cache content
cat .cache/twitter_*.json | jq
```

**Fix**: Run `pnpm cache:refresh` locally, then push

## 📊 Expected Results

### After First Run

- ✅ New commit: "chore: update Twitter cache [skip ci]"
- ✅ File created: `.cache/twitter_AnasAboreeda_3.json`
- ✅ Cache size: ~2-5 KB
- ✅ Vercel deployment triggered (if connected)

### Daily Updates

- 🔄 Workflow runs automatically at 6 AM UTC
- 📝 Commits created only if tweets changed
- 🚀 Vercel auto-deploys on new commits
- 💾 API calls: ~2 per day, ~60 per month

## 📝 Next Steps

- [ ] Monitor first few workflow runs
- [ ] Check Twitter API usage in Developer Portal
- [ ] Adjust schedule if needed
- [ ] Remove Twitter secrets from Vercel (no longer needed)
- [ ] Celebrate zero runtime API calls! 🎉

## 📚 Documentation

- **Full Guide**: [`docs/github-actions-twitter.md`](./github-actions-twitter.md)
- **Cache Strategy**: [`docs/twitter-caching.md`](./twitter-caching.md)
- **Twitter Setup**: [`docs/twitter-setup.md`](./twitter-setup.md)
