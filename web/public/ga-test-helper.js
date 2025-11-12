/**
 * Google Analytics Testing Helper
 *
 * Paste this script into your browser console to help test GA tracking.
 * It will log all GA events to the console in a readable format.
 */

(function () {
  console.log('%c🔍 Google Analytics Testing Helper Loaded', 'background: #4285f4; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');

  // Check if GA is loaded
  if (typeof window.gtag !== 'function') {
    console.warn('⚠️ Google Analytics (gtag) is not loaded yet. Wait a moment and refresh.');
    console.log('💡 If it still doesn\'t load, check if NEXT_PUBLIC_GA_MEASUREMENT_ID is set in your .env.local file');
    return;
  }

  console.log('✅ Google Analytics is loaded and ready');
  console.log('📊 Current dataLayer:', window.dataLayer);

  // Intercept gtag calls to log them nicely
  const originalGtag = window.gtag;
  let eventCount = 0;

  window.gtag = function (...args) {
    eventCount++;

    const [command, eventName, params] = args;

    if (command === 'event') {
      console.group(`%c📍 GA Event #${eventCount}: ${eventName}`, 'color: #4285f4; font-weight: bold;');
      console.log('Event Name:', eventName);
      if (params) {
        console.log('Parameters:');
        Object.entries(params).forEach(([key, value]) => {
          console.log(`  ${key}:`, value);
        });
      }
      console.log('Timestamp:', new Date().toLocaleTimeString());
      console.groupEnd();
    } else {
      console.log(`%cGA Command: ${command}`, 'color: #888;', args);
    }

    // Call original gtag
    return originalGtag.apply(this, args);
  };

  // Helper functions
  window.gaHelper = {
    getEvents: () => {
      return window.dataLayer.filter(item =>
        Array.isArray(item) && item[0] === 'event'
      );
    },

    getEventsByName: (eventName) => {
      return window.dataLayer.filter(item =>
        Array.isArray(item) && item[0] === 'event' && item[1] === eventName
      );
    },

    clearDataLayer: () => {
      window.dataLayer = [];
      console.log('✅ dataLayer cleared');
    },

    showStats: () => {
      const events = window.gaHelper.getEvents();
      const eventCounts = {};

      events.forEach(event => {
        const name = event[1];
        eventCounts[name] = (eventCounts[name] || 0) + 1;
      });

      console.group('%c📊 GA Event Statistics', 'color: #4285f4; font-weight: bold;');
      console.log('Total Events:', events.length);
      console.log('Events by Type:');
      Object.entries(eventCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([name, count]) => {
          console.log(`  ${name}: ${count}`);
        });
      console.groupEnd();
    },

    testScroll: async () => {
      console.log('🧪 Testing scroll depth tracking...');
      console.log('Scrolling to 50%...');
      window.scrollTo(0, document.body.scrollHeight * 0.5);
      await new Promise(r => setTimeout(r, 1000));
      console.log('Scrolling to 100%...');
      window.scrollTo(0, document.body.scrollHeight);
      console.log('✅ Check console for scroll_depth events');
    },

    testCopy: () => {
      console.log('🧪 Testing copy tracking...');
      const heading = document.querySelector('h1');
      if (heading) {
        const range = document.createRange();
        range.selectNodeContents(heading);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        console.log('✅ Text copied. Check console for content_copy event');
      } else {
        console.log('❌ No h1 found to copy');
      }
    },

    help: () => {
      console.group('%c📚 GA Testing Helper Commands', 'background: #4285f4; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
      console.log('gaHelper.getEvents()          - Get all tracked events');
      console.log('gaHelper.getEventsByName(name) - Get events by name (e.g., "button_click")');
      console.log('gaHelper.clearDataLayer()     - Clear all tracked events');
      console.log('gaHelper.showStats()          - Show event statistics');
      console.log('gaHelper.testScroll()         - Test scroll depth tracking');
      console.log('gaHelper.testCopy()           - Test copy tracking');
      console.log('gaHelper.help()               - Show this help');
      console.groupEnd();
    }
  };

  console.log('%c💡 Type gaHelper.help() to see available commands', 'color: #4285f4; font-style: italic;');

})();
