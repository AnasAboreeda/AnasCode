"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
  }
  var dataLayer: unknown[];
}

function GoogleAnalyticsEventsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_search: searchParams.toString(),
      });
    }
  }, [pathname, searchParams]);

  // Track all clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const element = target.closest("a, button");

      if (!element) return;

      const elementType = element.tagName.toLowerCase();
      const elementText = element.textContent?.trim().slice(0, 50) || "no-text";
      const elementId = element.id || "no-id";
      const elementClass = element.className || "no-class";

      // Track link clicks
      if (elementType === "a") {
        const href = (element as HTMLAnchorElement).href;
        const isExternal = href && !href.includes(window.location.hostname);
        const isDownload = href && /\.(pdf|zip|doc|docx|xls|xlsx|ppt|pptx)$/i.test(href);

        if (isDownload) {
          window.gtag("event", "file_download", {
            link_url: href,
            link_text: elementText,
            link_id: elementId,
            link_classes: elementClass,
          });
        } else if (isExternal) {
          window.gtag("event", "outbound_link", {
            link_url: href,
            link_text: elementText,
            link_id: elementId,
            link_classes: elementClass,
          });
        } else {
          window.gtag("event", "internal_link", {
            link_url: href,
            link_text: elementText,
            link_id: elementId,
            link_classes: elementClass,
          });
        }
      }

      // Track button clicks
      if (elementType === "button") {
        window.gtag("event", "button_click", {
          button_text: elementText,
          button_id: elementId,
          button_classes: elementClass,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Track scroll depth
  useEffect(() => {
    const thresholds = [25, 50, 75, 90, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;

      thresholds.forEach((threshold) => {
        if (scrolled >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          window.gtag("event", "scroll_depth", {
            percent_scrolled: threshold,
            page_path: pathname,
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    const intervals = [10, 30, 60, 120, 300]; // seconds
    const tracked = new Set<number>();

    const intervalId = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      intervals.forEach((interval) => {
        if (timeSpent >= interval && !tracked.has(interval)) {
          tracked.add(interval);
          window.gtag("event", "time_on_page", {
            time_seconds: interval,
            page_path: pathname,
          });
        }
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [pathname]);

  // Track form interactions
  useEffect(() => {
    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      const formId = form.id || "no-id";
      const formName = form.name || "no-name";

      window.gtag("event", "form_submit", {
        form_id: formId,
        form_name: formName,
      });
    };

    const handleFormFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        const form = target.closest("form");
        if (form) {
          const formId = form.id || "no-id";
          window.gtag("event", "form_start", {
            form_id: formId,
          });
        }
      }
    };

    document.addEventListener("submit", handleFormSubmit);
    document.addEventListener("focusin", handleFormFocus, { once: true });

    return () => {
      document.removeEventListener("submit", handleFormSubmit);
      document.removeEventListener("focusin", handleFormFocus);
    };
  }, []);

  // Track copy/paste events
  useEffect(() => {
    const handleCopy = () => {
      const selection = window.getSelection()?.toString().slice(0, 100);
      if (selection) {
        window.gtag("event", "content_copy", {
          copied_text: selection,
          page_path: pathname,
        });
      }
    };

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, [pathname]);

  // Track video interactions (if any)
  useEffect(() => {
    const handleVideoPlay = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      window.gtag("event", "video_play", {
        video_src: video.src,
        video_title: video.title || "untitled",
      });
    };

    const handleVideoPause = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      window.gtag("event", "video_pause", {
        video_src: video.src,
        video_title: video.title || "untitled",
        video_current_time: Math.floor(video.currentTime),
      });
    };

    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      video.addEventListener("play", handleVideoPlay);
      video.addEventListener("pause", handleVideoPause);
    });

    return () => {
      videos.forEach((video) => {
        video.removeEventListener("play", handleVideoPlay);
        video.removeEventListener("pause", handleVideoPause);
      });
    };
  }, [pathname]);

  // Track search interactions
  useEffect(() => {
    const handleSearch = (e: Event) => {
      const form = e.target as HTMLFormElement;
      const searchInput = form.querySelector('input[type="search"], input[name*="search"]') as HTMLInputElement;

      if (searchInput) {
        window.gtag("event", "search", {
          search_term: searchInput.value,
        });
      }
    };

    const searchForms = document.querySelectorAll('form[role="search"], form:has(input[type="search"])');
    searchForms.forEach((form) => {
      form.addEventListener("submit", handleSearch);
    });

    return () => {
      searchForms.forEach((form) => {
        form.removeEventListener("submit", handleSearch);
      });
    };
  }, [pathname]);

  return null;
}

export function GoogleAnalyticsEvents() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsEventsInner />
    </Suspense>
  );
}
