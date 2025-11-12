# Testing Google Analytics

This guide explains how to test Google Analytics tracking in both automated tests and the browser.

## Running Automated Tests

### Run all tests including analytics

```bash
pnpm test:e2e
```

### Run only analytics tests

```bash
pnpm test:e2e analytics.spec.ts
```

### Run tests in UI mode (interactive)

```bash
pnpm test:e2e:ui
```

### Run tests in headed mode (see browser)

```bash
pnpm test:e2e:headed
```

### Debug analytics tests

```bash
pnpm test:e2e:debug analytics.spec.ts
```

## Testing in the Browser

### Method 1: Using Browser DevTools Console

1. **Start your development server:**

   ```bash
   pnpm dev
   ```

2. **Open your site in the browser:**
   - Navigate to `http://localhost:3000`
   - Open DevTools (F12 or Right-click > Inspect)
   - Go to the Console tab

3. **Check if Google Analytics is loaded:**

   ```javascript
   // Check if gtag function exists
   typeof window.gtag;
   // Should return: "function"

   // Check dataLayer
   window.dataLayer;
   // Should return: Array with GA events
   ```

4. **Monitor events in real-time:**

   ```javascript
   // Log all GA events to console
   const originalGtag = window.gtag;
   window.gtag = function (...args) {
     console.log("GA Event:", args);
     originalGtag.apply(this, args);
   };
   ```

5. **Test specific interactions:**
   - Click a link and check console for `internal_link` or `outbound_link`
   - Click a button and check for `button_click`
   - Scroll down and check for `scroll_depth`
   - Copy text and check for `content_copy`
   - Wait 10+ seconds and check for `time_on_page`

### Method 2: Using Google Analytics DebugView

1. **Enable debug mode in your .env.local:**

   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_GA_DEBUG_MODE=true
   ```

2. **Install Google Analytics Debugger Chrome Extension:**
   - Go to Chrome Web Store
   - Search for "Google Analytics Debugger"
   - Install the extension
   - Enable it (icon will turn blue)

3. **View events in real-time:**
   - Open your Google Analytics account
   - Go to Admin > DebugView
   - Open your site in the browser with the extension enabled
   - See all events appear in real-time

### Method 3: Using Network Tab

1. **Open DevTools Network tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Filter by "gtag" or "collect"

2. **Perform actions on your site:**
   - Click links, buttons
   - Scroll, copy text
   - Each action should create a network request to Google Analytics

3. **Inspect requests:**
   - Click on a request to see details
   - Check the "Payload" or "Preview" tab
   - You'll see event names and parameters

### Method 4: Using Google Tag Assistant

1. **Install Google Tag Assistant Legacy:**
   - Chrome extension for debugging Google tags
   - More detailed than the debugger

2. **Connect to your site:**
   - Click the extension icon
   - Click "Connect" on your site
   - See all GA events with full details

## Event Types to Test

### Page Views

- Navigate between pages
- Check for `page_view` event with `page_path` parameter

### Link Clicks

- **Internal links**: Click links to pages on your site
  - Event: `internal_link`
  - Parameters: `link_url`, `link_text`, `link_id`, `link_classes`

- **External links**: Click links to other websites
  - Event: `outbound_link`
  - Parameters: `link_url`, `link_text`, `link_id`, `link_classes`

- **File downloads**: Click PDF/ZIP/DOC links
  - Event: `file_download`
  - Parameters: `link_url`, `link_text`, `link_id`, `link_classes`

### Button Clicks

- Click any button on the site
- Event: `button_click`
- Parameters: `button_text`, `button_id`, `button_classes`

### Scroll Depth

- Scroll to different positions: 25%, 50%, 75%, 90%, 100%
- Event: `scroll_depth`
- Parameters: `percent_scrolled`, `page_path`

### Time on Page

- Stay on page for: 10s, 30s, 60s, 120s, 300s
- Event: `time_on_page`
- Parameters: `time_seconds`, `page_path`

### Content Copy

- Select and copy text (Ctrl+C / Cmd+C)
- Event: `content_copy`
- Parameters: `copied_text`, `page_path`

### Form Interactions

- Focus on form field
  - Event: `form_start`
  - Parameters: `form_id`

- Submit form
  - Event: `form_submit`
  - Parameters: `form_id`, `form_name`

### Video Interactions

- Play a video
  - Event: `video_play`
  - Parameters: `video_src`, `video_title`

- Pause a video
  - Event: `video_pause`
  - Parameters: `video_src`, `video_title`, `video_current_time`

### Search

- Submit a search form
- Event: `search`
- Parameters: `search_term`

## Troubleshooting

### Events not showing up?

1. **Check if GA_MEASUREMENT_ID is set:**

   ```bash
   echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
   ```

2. **Check console for errors:**
   - Open DevTools Console
   - Look for any JavaScript errors

3. **Verify gtag is loaded:**

   ```javascript
   console.log(typeof window.gtag); // should be "function"
   console.log(window.dataLayer); // should be an array
   ```

4. **Check Network tab:**
   - Make sure requests to `googletagmanager.com` are successful
   - Look for `collect` or `gtag` requests

### Events showing in console but not in GA?

1. **Wait a few minutes** - GA can have a delay (use DebugView for real-time)
2. **Check your GA_MEASUREMENT_ID** - Make sure it's correct
3. **Verify GA4 property** - Make sure you're using GA4, not Universal Analytics

## Production Testing

Once deployed to production with a real `GA_MEASUREMENT_ID`:

1. Open your production site
2. Use Google Analytics DebugView for real-time events
3. Or wait 24-48 hours and check Reports in GA dashboard
4. Go to **Reports > Engagement > Events** to see all tracked events

## Best Practices

- Test in incognito/private mode to avoid ad blockers
- Test on different devices and browsers
- Verify events have correct parameters
- Check that no PII (Personally Identifiable Information) is being tracked
- Monitor error rates in GA to catch tracking issues
