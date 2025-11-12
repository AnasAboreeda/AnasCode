# Google Analytics Testing - Quick Start

## 🚀 Quick Browser Test

1. **Start your dev server:**

   ```bash
   pnpm dev
   ```

2. **Open http://localhost:3000 in your browser**

3. **Open DevTools Console (F12)**

4. **Paste this into console:**

   ```javascript
   // Load the testing helper
   const script = document.createElement("script");
   script.src = "/ga-test-helper.js";
   document.head.appendChild(script);
   ```

5. **Use helper commands:**
   ```javascript
   gaHelper.help(); // Show all commands
   gaHelper.showStats(); // See event statistics
   gaHelper.testScroll(); // Test scroll tracking
   gaHelper.testCopy(); // Test copy tracking
   gaHelper.getEvents(); // See all events
   ```

## 🧪 Run Automated Tests

```bash
# Run all analytics tests
pnpm test:e2e analytics.spec.ts

# Run in UI mode (interactive)
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed analytics.spec.ts
```

## 👀 What to Look For

When you interact with the site, you should see console logs like:

```
📍 GA Event #1: page_view
  Event Name: page_view
  Parameters:
    page_path: /
    page_search:
  Timestamp: 4:06:00 PM

📍 GA Event #2: internal_link
  Event Name: internal_link
  Parameters:
    link_url: http://localhost:3000/about
    link_text: About
    link_id: no-id
    link_classes: ...
  Timestamp: 4:06:05 PM
```

## 📊 Event Types

Test these interactions:

- ✅ **Page navigation** → `page_view`
- ✅ **Click internal links** → `internal_link`
- ✅ **Click external links** → `outbound_link`
- ✅ **Click buttons** → `button_click`
- ✅ **Scroll page** → `scroll_depth` (25%, 50%, 75%, 90%, 100%)
- ✅ **Copy text** → `content_copy`
- ✅ **Stay on page** → `time_on_page` (10s, 30s, 60s, 120s, 300s)
- ✅ **Submit forms** → `form_start`, `form_submit`
- ✅ **Search** → `search`

## 🔧 Troubleshooting

**No events showing?**

1. Check if GA script is loaded: `typeof window.gtag` should be `"function"`
2. Check dataLayer: `window.dataLayer` should be an array
3. Make sure you set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`

**Events in console but not in GA dashboard?**

1. Use Google Analytics DebugView for real-time events
2. Regular reports can take 24-48 hours to update

## 📚 Full Documentation

See [docs/testing-analytics.md](./testing-analytics.md) for complete testing guide.
