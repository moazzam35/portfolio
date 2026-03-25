import { useEffect, useRef, useState, useMemo } from "react";

/**
 * SplitText — A zero-dependency, reusable animated text component.
 *
 * Props:
 *  text         {string}   — The text to render
 *  tag          {string}   — HTML tag to wrap with (default: "p")
 *  splitType    {string}   — "chars" | "words" | "lines"
 *  variant      {string}   — Animation preset (see VARIANTS below)
 *  delay        {number}   — Stagger delay per unit in ms (default: 40)
 *  duration     {number}   — Animation duration in ms (default: 700)
 *  initialDelay {number}   — Delay before the first element starts in ms (default: 0)
 *  threshold    {number}   — IntersectionObserver threshold (default: 0.15)
 *  rootMargin   {string}   — IntersectionObserver rootMargin (default: "0px")
 *  once         {boolean}  — Animate only once (default: true)
 *  className    {string}   — CSS class on the wrapper
 *  style        {object}   — Inline styles on wrapper
 *  onComplete   {function} — Callback when last element finishes animating
 */

// ─── Animation Variants ────────────────────────────────────────────────────────
const VARIANTS = {
  /** Classic rise with fade */
  fadeUp: {
    hidden: { opacity: 0, transform: "translateY(60%) skewY(8deg)" },
    visible: { opacity: 1, transform: "translateY(0%) skewY(0deg)" },
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "hidden", // clip the travel
  },
  /** Fall from above */
  fadeDown: {
    hidden: { opacity: 0, transform: "translateY(-80%)" },
    visible: { opacity: 1, transform: "translateY(0%)" },
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    overflow: "hidden",
  },
  /** Blurry entrance */
  blur: {
    hidden: { opacity: 0, filter: "blur(12px)", transform: "scale(1.08)" },
    visible: { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    overflow: "visible",
  },
  /** Glitch-style flicker */
  glitch: {
    hidden: { opacity: 0, transform: "skewX(-12deg) translateX(-8px)" },
    visible: { opacity: 1, transform: "skewX(0deg) translateX(0px)" },
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    overflow: "visible",
  },
  /** Rotate + rise from a clip */
  rotateUp: {
    hidden: { opacity: 0, transform: "rotateX(90deg) translateY(50%)", transformOrigin: "bottom" },
    visible: { opacity: 1, transform: "rotateX(0deg) translateY(0%)", transformOrigin: "bottom" },
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "hidden",
    perspective: "600px",
  },
  /** Simple fade */
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    easing: "ease-out",
    overflow: "visible",
  },
  /** Scale pop */
  pop: {
    hidden: { opacity: 0, transform: "scale(0.4)" },
    visible: { opacity: 1, transform: "scale(1)" },
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    overflow: "visible",
  },
  /** Slide in from the left */
  slideRight: {
    hidden: { opacity: 0, transform: "translateX(-40px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "visible",
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function splitIntoChars(text) {
  // Preserve spaces as visible tokens
  return [...text].map((char, i) => ({ char, isSpace: char === " ", key: i }));
}

function splitIntoWords(text) {
  return text.split(/(\s+)/).map((word, i) => ({
    char: word,
    isSpace: /^\s+$/.test(word),
    key: i,
  }));
}

function splitIntoLines(text) {
  return text.split("\n").map((line, i) => ({
    char: line,
    isSpace: false,
    key: i,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SplitText({
  text = "",
  tag = "p",
  splitType = "chars",
  variant = "fadeUp",
  delay = 40,
  duration = 700,
  initialDelay = 0,
  threshold = 0.15,
  rootMargin = "0px",
  once = true,
  className = "",
  style = {},
  onComplete,
}) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const hasAnimated = useRef(false);

  const config = VARIANTS[variant] || VARIANTS.fadeUp;

  // Split text into tokens
  const tokens = useMemo(() => {
    if (splitType === "words") return splitIntoWords(text);
    if (splitType === "lines") return splitIntoLines(text);
    return splitIntoChars(text);
  }, [text, splitType]);

  const animatableTokens = tokens.filter((t) => !t.isSpace);

  // IntersectionObserver trigger
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasAnimated.current) return;
          setVisible(true);
          hasAnimated.current = true;
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  // onComplete callback
  useEffect(() => {
    if (!visible || !onComplete) return;
    const totalDuration =
      initialDelay + animatableTokens.length * delay + duration;
    const timer = setTimeout(onComplete, totalDuration);
    return () => clearTimeout(timer);
  }, [visible]);

  const Tag = tag;

  // Build wrapper style
  const wrapperStyle = {
    display: "inline",
    ...style,
  };

  // Animatable token index counter (skip spaces)
  let animIndex = 0;

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={wrapperStyle}
      aria-label={text}
    >
      {config.perspective ? (
        <span style={{ display: "inline-block", perspective: config.perspective, border: "none", outline: "none", background: "transparent" }}>
          {tokens.map((token) => {
            if (token.isSpace) {
              return <span key={token.key} aria-hidden="true" style={{ border: "none", outline: "none" }}>&nbsp;</span>;
            }
            const idx = animIndex++;
            const tokenDelay = initialDelay + idx * delay;
            return (
              <TokenSpan
                key={token.key}
                char={token.char}
                visible={visible}
                config={config}
                duration={duration}
                tokenDelay={tokenDelay}
                splitType={splitType}
              />
            );
          })}
        </span>
      ) : (
        tokens.map((token) => {
          if (token.isSpace) {
            return <span key={token.key} aria-hidden="true" style={{ border: "none", outline: "none" }}>&nbsp;</span>;
          }
          const idx = animIndex++;
          const tokenDelay = initialDelay + idx * delay;
          return (
            <TokenSpan
              key={token.key}
              char={token.char}
              visible={visible}
              config={config}
              duration={duration}
              tokenDelay={tokenDelay}
              splitType={splitType}
            />
          );
        })
      )}
    </Tag>
  );
}

// ─── Shared hard reset — prevents Tailwind / global CSS from adding borders ───
const RESET = {
  border: "none",
  outline: "none",
  boxShadow: "none",
  background: "transparent",
  padding: 0,
  margin: 0,
};

// ─── Individual Token ─────────────────────────────────────────────────────────
function TokenSpan({ char, visible, config, duration, tokenDelay, splitType }) {
  const currentStyle = visible ? config.visible : config.hidden;

  const style = {
    ...RESET,
    display: splitType === "lines" ? "block" : "inline-block",
    overflow: config.overflow === "hidden" ? "hidden" : "visible",
    transition: visible
      ? `opacity ${duration}ms ${config.easing} ${tokenDelay}ms,
         transform ${duration}ms ${config.easing} ${tokenDelay}ms,
         filter ${duration}ms ${config.easing} ${tokenDelay}ms`
      : "none",
    ...currentStyle,
  };

  return (
    <span style={style} aria-hidden="true">
      {splitType === "words" ? (
        // inner span needed for clip-travel on words
        <span style={{ ...RESET, display: "inline-block" }}>{char}</span>
      ) : (
        char
      )}
    </span>
  );
}