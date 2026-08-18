import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./preloader.css";
import {
  HERO_CRITICAL_IMAGES,
  BACKGROUND_IMAGES,
  preloadImages,
  preloadInBackground,
  isMobileDevice,
  isTabletDevice,
} from "../../lib/preload";

const NAME = "MOAZZAM PASHA";
const DECILE_EASE = [0.76, 0, 0.24, 1];

/* --- loading policy ---------------------------------------------------
   MIN_DISPLAY_MS — UX floor: the preloader's own UI (characters, fill
   bar) needs ~1.6s to play out, so we never dismiss it faster than that,
   even when every asset is already cached. Not an artificial "loading"
   delay — readiness still gates the reveal.
   MAX_WAIT_MS — slow-network fallback: if the critical hero assets cannot
   finish within this window, the Hero is revealed anyway. It degrades
   gracefully because the background animation is procedural SVG; the
   preloaded PNGs are decorative accents, and any stragglers keep loading
   in the background.
------------------------------------------------------------------------ */
const MIN_DISPLAY_MS = 1600;
const MAX_WAIT_MS = 6000;

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 }
  },
  exit: {
    transition: { staggerChildren: 0.012 }
  }
};

const charVariants = {
  initial: { y: "110%", opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.215, 0.610, 0.355, 1] }
  },
  exit: {
    y: "110%",
    opacity: 0,
    transition: { duration: 0.4, ease: DECILE_EASE }
  }
};

const blockVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } },
  exit: { opacity: 0, y: 14, transition: { duration: 0.3, ease: "easeIn" } }
};

export default function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    loaded: 0,
    total: HERO_CRITICAL_IMAGES.length,
  });
  const deviceRef = useRef("desktop");

  useEffect(() => {
    let cancelled = false;

    // Detect the layout using the exact same breakpoint logic as
    // HeroBackground (Math.min(innerWidth, screen.width), < 640 = mobile).
    // Client-only — this component never runs on a server.
    if (isMobileDevice()) deviceRef.current = "mobile";
    else if (isTabletDevice()) deviceRef.current = "tablet";

    if (import.meta.env.DEV) {
      console.info(`[preload] layout: ${deviceRef.current}`);
    }

    const minDisplay = new Promise((resolve) => setTimeout(resolve, MIN_DISPLAY_MS));
    const fallback = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS));

    // Phase 1 — critical hero assets. This is the only thing the Hero
    // waits on; nothing below the fold is part of this phase.
    const critical = preloadImages(HERO_CRITICAL_IMAGES, {
      priority: "high",
      onProgress: (loaded, failed, total) => {
        if (!cancelled) setProgress({ loaded, total, failed });
      },
    });

    // Phase 2 — reveal the Hero as soon as the critical assets are ready
    // AND the preloader has played out (or the fallback fires first).
    // Phase 3 (remaining assets) continues in the background afterwards.
    Promise.all([minDisplay, Promise.race([critical, fallback])]).then(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleExitComplete = () => {
    // Phase 3 — hero is live; warm the below-fold images at idle priority.
    preloadInBackground(BACKGROUND_IMAGES);
    if (onComplete) onComplete();
  };

  const ratio = progress.total > 0 ? progress.loaded / progress.total : 0;
  // Cap at 90% while still loading so the bar never claims 100% before
  // the Hero is actually revealed; it snaps to 100% on exit.
  const fillScale = loading ? Math.min(ratio, 0.9) : 1;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {loading && (
        <motion.div
          className="preloader-canvas"
          initial={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.7, ease: DECILE_EASE, delay: 0.35 }}
        >
          <div className="preloader-central-stack">

            <motion.div
              className="stack-eyebrow"
              variants={blockVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <span>PORTFOLIO</span>
              <span>&copy;2026</span>
            </motion.div>

            <div className="stack-hero">
              <motion.h1
                className="display-name"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {[...NAME].map((char, i) => (
                  <span key={i} className="mask-box">
                    <motion.span variants={charVariants} className="glyph">
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>
            </div>

            <div className="stack-footer">
              <div className="progress-row">
                <div className="loading-track" />
                <motion.div
                  className="loading-fill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: fillScale }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              <div className="ftr-bottom">
                <motion.div
                  className="ftr-meta"
                  variants={blockVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <span>CREATIVE DEVELOPER</span>
                  <span>PUNJAB, PK</span>
                </motion.div>

                <motion.div
                  className="counter-block"
                  variants={blockVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <span className="counter-value">{progress.loaded}</span>
                  <span className="counter-label">/ {progress.total}</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
