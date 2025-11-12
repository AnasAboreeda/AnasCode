# Twitter Integration Setup Guide

This guide will walk you through setting up Twitter API integration for your website.

## Prerequisites

- Twitter/X account
- Access to Twitter Developer Portal

## Step 1: Create Twitter Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign in with your Twitter account
3. Apply for a Developer Account (if you don't have one)
   - Select "Hobbyist" → "Exploring the API"
   - Fill out the application form
   - Agree to terms and conditions
4. Wait for approval (usually instant for basic access)

## Step 2: Create a Twitter App

1. In the Developer Portal, click **"Create Project"**
2. Name your project (e.g., "Personal Website")
3. Select use case: "Making a bot" or "Exploring the API"
4. Provide app description
5. Create your App

## Step 3: Get API Credentials

### Get API Keys and Access Tokens

1. In your app dashboard, go to **"Keys and tokens"** tab
2. Generate the following credentials:
   - **API Key** and **API Key Secret** (under "Consumer Keys")
   - **Access Token** and **Access Token Secret** (under "Authentication Tokens")
3. Click **"Generate"** for each if not already generated
4. **Copy and save all four credentials** - you won't be able to see the secrets again!

## Step 4: Configure App Permissions

1. In your app dashboard, go to **"Settings"** tab
2. Under **"User authentication settings"**, click **"Set up"** or **"Edit"**
3. Set **"App permissions"** to **"Read"** (minimum required)
4. Save your changes

## Step 5: Configure Environment Variables

### Local Development

Create/update `.env.local` in your project root:

```bash
# Twitter API Configuration (OAuth 1.0a)
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

Replace the placeholder values with your actual credentials from Step 3.

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all four environment variables:
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_TOKEN_SECRET`
4. Mark them as **Secret** for security
5. Click **Save**
6. Redeploy your site

## Step 6: Update Home Page Configuration

Open `src/app/(site)/page.tsx` and update the Twitter username:

```typescript
// Change 'anasaboreeda' to your actual Twitter username
const tweets = await fetchUserTweets("YOUR_USERNAME_HERE", 3);
```

## Step 7: Test Locally

1. Start your development server:

```bash
pnpm dev
```

2. Visit http://localhost:3000
3. You should see your recent tweets in the "Recent Thoughts" section

## Troubleshooting

### Error: "Twitter API credentials not set"

- Ensure `.env.local` exists in project root
- Verify all four environment variables are set correctly
- Check for typos in variable names
- Verify the variable name is exactly `TWITTER_BEARER_TOKEN`
- Restart your dev server after adding environment variables

### Error: "Failed to fetch user"

- Verify your Twitter username is correct (without @)
- Check that your Bearer Token is valid
- Ensure your Twitter account is public (or API has access)

### Error: "Failed to fetch tweets"

- Your account might be private
- You might not have any tweets
- API rate limit might be reached (wait 15 minutes)

### No tweets showing

- Check browser console for errors
- Verify your account has tweets (not just retweets/replies)
- Ensure `exclude: "retweets,replies"` is correct for your needs

## API Rate Limits

Twitter API v2 Free Tier limits:

- **User lookup**: 300 requests per 15 minutes
- **Timeline**: 180 requests per 15 minutes

With caching (`next: { revalidate: 3600 }`), your site will:

- Cache tweets for 1 hour
- Make minimal API calls
- Stay well within rate limits

## Customization

### Change number of tweets

In `src/app/(site)/page.tsx`:

```typescript
// Show 5 tweets instead of 3
const tweets = await fetchUserTweets("username", 5);
```

### Include replies and retweets

Edit `src/lib/twitter.ts`, line ~104:

```typescript
// Remove or modify this line
exclude: "retweets,replies", // Show all tweets
```

### Change cache duration

Edit `src/lib/twitter.ts`, line ~94 and ~112:

```typescript
next: { revalidate: 7200 }, // Cache for 2 hours instead of 1
```

### Customize tweet styling

Edit `src/components/molecules/TweetCard.tsx` to adjust:

- Colors
- Layout
- Fonts
- Metrics display

## Security Best Practices

1. ✅ **Never commit `.env.local`** - It's in `.gitignore`
2. ✅ **Use Bearer Token only** - Don't expose API keys in frontend
3. ✅ **Server-side only** - API calls happen on server (Next.js Server Components)
4. ✅ **Rotate tokens periodically** - Regenerate tokens if compromised
5. ✅ **Monitor usage** - Check Twitter Developer Portal for API usage

## Advanced: Multiple Users

To show tweets from multiple accounts:

```typescript
const tweets = await Promise.all([
  fetchUserTweets("user1", 2),
  fetchUserTweets("user2", 2),
  fetchUserTweets("user3", 2),
]).then((results) => results.flat());
```

## Resources

- [Twitter API Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Twitter API v2 User Timeline](https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/introduction)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

If you encounter issues:

1. Check Twitter API status: https://api.twitterstat.us/
2. Review Twitter Developer Portal logs
3. Check Next.js server logs for error messages
4. Verify all environment variables are set correctly

## What's Next?

- Add error boundaries for better error handling
- Create a dedicated `/tweets` page
- Add tweet search functionality
- Implement tweet threading display
- Add media/image support for tweets with photos
