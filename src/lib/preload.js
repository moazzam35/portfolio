/* ============================================================
   preload.js — reusable, production-safe image preloading for
   the Hero's critical assets.

   Used by the Preloader to:
   - detect mobile/tablet/desktop using the SAME breakpoint logic
     as HeroBackground (so the preloader and the Hero can never
     disagree on the layout)
   - preload the hero-critical raster assets before the Hero starts
   - progressively warm below-the-fold images in the background
   ============================================================ */

import worldImg from "../assets/images/world.png";
import resizerImg from "../assets/images/resizer.png";
import logoImg from "../assets/images/logo.png";
import iconImg from "../assets/images/icon.png";
import aboutMeImg from "../assets/images/about-me.png";

/* Breakpoints — must stay in sync with HeroBackground (BREAKPOINTS). */
export const BREAKPOINTS = { mobile: 640, tablet: 1024 };

/* Device width — mirrors HeroBackground's getDeviceWidth() exactly,
   so the preloader and the Hero always agree on mobile vs desktop. */
export function getDeviceWidth() {
  if (typeof window === "undefined" || typeof screen === "undefined") return 1024;
  // Math.min(innerWidth, screen.width) reports the real device width
  // even when the browser window is resized inside desktop mode.
  return Math.min(window.innerWidth, screen.width);
}

export function isMobileDevice() {
  return getDeviceWidth() < BREAKPOINTS.mobile;
}

export function isTabletDevice() {
  const w = getDeviceWidth();
  return w >= BREAKPOINTS.mobile && w < BREAKPOINTS.tablet;
}

export function isDesktopDevice() {
  return getDeviceWidth() >= BREAKPOINTS.tablet;
}

/* The only raster assets the Hero animation uses (the random icon pool
   inside HeroBackground). The imports here are identical to the ones in
   HeroBackground, so Vite emits the same hashed URLs — these preloads
   warm the exact HTTP cache entries the Hero's <img> elements hit. */
export const HERO_CRITICAL_IMAGES = [worldImg, resizerImg, logoImg, iconImg];

/* Below-the-fold images warmed after the Hero is live. */
export const BACKGROUND_IMAGES = [aboutMeImg];

/* Module-level cache: url -> Promise<Image>.
   Dedupes concurrent requests and reuses completed loads, so the same
   image is never downloaded twice (also survives re-mounts in StrictMode). */
const imageCache = new Map();

export function preloadImage(url, { priority = "high" } = {}) {
  const cached = imageCache.get(url);
  if (cached) return cached;

  if (typeof Image === "undefined") {
    return Promise.reject(new Error(`Image API unavailable: ${url}`));
  }

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    // Best-effort fetch priority hint; ignored by browsers that don't support it.
    img.fetchPriority = priority;
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Drop the failed entry so a later phase may retry; we never retry
      // automatically, so there are no infinite-retry loops.
      imageCache.delete(url);
      reject(new Error(`Failed to load image: ${url}`));
    };
    img.src = url;
  });

  imageCache.set(url, promise);
  return promise;
}

/* Preload a batch of images. Never rejects: individual failures are
   collected and reported while the remaining images keep loading.
   Returns { loaded, failed, total, failedUrls }. */
export async function preloadImages(urls, { onProgress, priority = "high" } = {}) {
  const unique = [...new Set(urls)];
  let loaded = 0;
  let failed = 0;
  const failedUrls = [];

  const report = () => {
    if (onProgress) onProgress(loaded, failed, unique.length);
  };
  report();

  await Promise.allSettled(
    unique.map((url) =>
      preloadImage(url, { priority }).then(
        () => {
          loaded += 1;
          report();
        },
        () => {
          failed += 1;
          failedUrls.push(url);
          report();
        }
      )
    )
  );

  if (failedUrls.length > 0) {
    // Loud in the console so broken assets are not silently hidden.
    console.warn(`[preload] ${failedUrls.length}/${unique.length} images failed:`, failedUrls);
  }

  return { loaded, failed, total: unique.length, failedUrls };
}

/* Fire-and-forget background preload: runs when the browser is idle,
   at low priority, and never blocks or rejects anything. */
export function preloadInBackground(urls) {
  const run = () => {
    preloadImages(urls, { priority: "low" }).catch(() => {});
  };
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 0);
  }
}
