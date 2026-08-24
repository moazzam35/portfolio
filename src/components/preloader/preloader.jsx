import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
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

/* --- loading policy --------------------------------------------------- */
const MIN_DISPLAY_MS = 1600;
const MAX_WAIT_MS = 6000;

export default function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    loaded: 0,
    total: HERO_CRITICAL_IMAGES.length,
  });
  const [exitAnimating, setExitAnimating] = useState(false);

  const canvasRef = useRef(null);
  const nameRef = useRef(null);
  const eyebrowRef = useRef(null);
  const metaRef = useRef(null);
  const counterRef = useRef(null);
  const fillRef = useRef(null);
  const charRefs = useRef([]);
  const hasEntered = useRef(false);
  const hasExited = useRef(false);

  const deviceRef = useRef("desktop");

  // Entrance animation (runs once on mount)
  useEffect(() => {
    if (hasEntered.current) return;
    hasEntered.current = true;

    const chars = charRefs.current.filter(Boolean);
    const blocks = [eyebrowRef.current, metaRef.current, counterRef.current].filter(Boolean);

    gsap.set(chars, { y: "110%", opacity: 0 });
    gsap.set(blocks, { opacity: 0, y: 14 });
    gsap.set(canvasRef.current, { y: 0 });

    const tl = gsap.timeline();

    tl.to(blocks[0], { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.15);

    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: [0.215, 0.610, 0.355, 1],
      stagger: 0.02,
    }, 0.15);

    tl.to(blocks[1], { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.4);
    tl.to(blocks[2], { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.4);
  }, []);

  // Animate fill bar
  useEffect(() => {
    if (fillRef.current) {
      gsap.to(fillRef.current, {
        scaleX: fillScale,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }, [progress.loaded, loading]);

  // Exit animation
  const handleExit = useCallback(() => {
    if (hasExited.current) return;
    hasExited.current = true;
    setExitAnimating(true);

    const chars = charRefs.current.filter(Boolean);
    const blocks = [eyebrowRef.current, metaRef.current, counterRef.current].filter(Boolean);

    const tl = gsap.timeline({
      onComplete: () => {
        preloadInBackground(BACKGROUND_IMAGES);
        if (onComplete) onComplete();
      },
    });

    tl.to(chars, {
      y: "110%",
      opacity: 0,
      duration: 0.4,
      ease: DECILE_EASE,
      stagger: 0.012,
    });

    tl.to(blocks, {
      opacity: 0,
      y: 14,
      duration: 0.3,
      ease: "power2.in",
    }, "<");

    tl.to(canvasRef.current, {
      y: "100%",
      duration: 0.7,
      ease: DECILE_EASE,
    }, 0.35);
  }, [onComplete]);

  useEffect(() => {
    let cancelled = false;

    if (isMobileDevice()) deviceRef.current = "mobile";
    else if (isTabletDevice()) deviceRef.current = "tablet";

    if (import.meta.env.DEV) {
      console.info(`[preload] layout: ${deviceRef.current}`);
    }

    const minDisplay = new Promise((resolve) => setTimeout(resolve, MIN_DISPLAY_MS));
    const fallback = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS));

    const critical = preloadImages(HERO_CRITICAL_IMAGES, {
      priority: "high",
      onProgress: (loaded, failed, total) => {
        if (!cancelled) setProgress({ loaded, total, failed });
      },
    });

    Promise.all([minDisplay, Promise.race([critical, fallback])]).then(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Trigger exit when loading finishes
  useEffect(() => {
    if (!loading && !hasExited.current) {
      // Small delay to let fill bar animate to 100%
      const timer = setTimeout(handleExit, 450);
      return () => clearTimeout(timer);
    }
  }, [loading, handleExit]);

  const ratio = progress.total > 0 ? progress.loaded / progress.total : 0;
  const fillScale = loading ? Math.min(ratio, 0.9) : 1;

  if (hasExited.current && !exitAnimating) return null;

  return (
    <div
      ref={canvasRef}
      className="preloader-canvas"
    >
      <div className="preloader-central-stack">

        <div className="stack-eyebrow" ref={eyebrowRef}>
          <span>PORTFOLIO</span>
          <span>&copy;2026</span>
        </div>

        <div className="stack-hero">
          <h1 className="display-name">
            {[...NAME].map((char, i) => (
              <span key={i} className="mask-box">
                <span
                  ref={(el) => { charRefs.current[i] = el; }}
                  className="glyph"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div className="stack-footer">
          <div className="progress-row">
            <div className="loading-track" />
            <div
              className="loading-fill"
              ref={fillRef}
              style={{ transformOrigin: "left", transform: `scaleX(${fillScale})` }}
            />
          </div>

          <div className="ftr-bottom">
            <div className="ftr-meta" ref={metaRef}>
              <span>CREATIVE DEVELOPER</span>
              <span>PUNJAB, PK</span>
            </div>

            <div className="counter-block" ref={counterRef}>
              <span className="counter-value">{progress.loaded}</span>
              <span className="counter-label">/ {progress.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
