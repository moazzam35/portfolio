import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./Header.css";

/* ─────────────────────────────────────
   SPLIT TEXT (inline)
───────────────────────────────────── */
const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, transform: "translateY(60%) skewY(8deg)" },
    visible: { opacity: 1, transform: "translateY(0%) skewY(0deg)" },
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "hidden",
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(12px)", transform: "scale(1.08)" },
    visible: { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    overflow: "visible",
  },
  glitch: {
    hidden: { opacity: 0, transform: "skewX(-12deg) translateX(-8px)" },
    visible: { opacity: 1, transform: "skewX(0deg) translateX(0px)" },
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    overflow: "visible",
  },
  rotateUp: {
    hidden: { opacity: 0, transform: "rotateX(90deg) translateY(50%)", transformOrigin: "bottom" },
    visible: { opacity: 1, transform: "rotateX(0deg) translateY(0%)", transformOrigin: "bottom" },
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "hidden",
    perspective: "600px",
  },
  pop: {
    hidden: { opacity: 0, transform: "scale(0.4)" },
    visible: { opacity: 1, transform: "scale(1)" },
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    overflow: "visible",
  },
  slideRight: {
    hidden: { opacity: 0, transform: "translateX(-40px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "visible",
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    easing: "ease-out",
    overflow: "visible",
  },
};

const RESET = { border:"none", outline:"none", boxShadow:"none", background:"transparent", padding:0, margin:0 };

function splitIntoChars(text) { return [...text].map((char,i) => ({ char, isSpace: char===" ", key: i })); }
function splitIntoWords(text) { return text.split(/(\s+)/).map((word,i) => ({ char: word, isSpace: /^\s+$/.test(word), key: i })); }

function TokenSpan({ char, visible, config, duration, tokenDelay, splitType }) {
  const style = {
    ...RESET,
    display: "inline-block",
    overflow: config.overflow === "hidden" ? "hidden" : "visible",
    transition: visible
      ? `opacity ${duration}ms ${config.easing} ${tokenDelay}ms,
         transform ${duration}ms ${config.easing} ${tokenDelay}ms,
         filter ${duration}ms ${config.easing} ${tokenDelay}ms`
      : "none",
    ...(visible ? config.visible : config.hidden),
  };
  return (
    <span style={style} aria-hidden="true">
      {splitType === "words"
        ? <span style={{ ...RESET, display: "inline-block" }}>{char}</span>
        : char}
    </span>
  );
}

function SplitText({
  text = "", tag = "p", splitType = "chars", variant = "fadeUp",
  delay = 40, duration = 700, initialDelay = 0, threshold = 0.1,
  rootMargin = "0px", once = true, className = "", style = {},
}) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const hasAnimated = useRef(false);
  const config = VARIANTS[variant] || VARIANTS.fadeUp;

  const tokens = useMemo(() => {
    if (splitType === "words") return splitIntoWords(text);
    return splitIntoChars(text);
  }, [text, splitType]);

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
        } else if (!once) setVisible(false);
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const Tag = tag;
  let animIndex = 0;

  return (
    <Tag ref={containerRef} className={className} style={{ display:"inline", ...style }} aria-label={text}>
      {config.perspective ? (
        <span style={{ display:"inline-block", perspective: config.perspective, border:"none", outline:"none", background:"transparent" }}>
          {tokens.map(token => {
            if (token.isSpace) return <span key={token.key} aria-hidden="true" style={RESET}>&nbsp;</span>;
            const idx = animIndex++;
            return <TokenSpan key={token.key} char={token.char} visible={visible} config={config} duration={duration} tokenDelay={initialDelay + idx * delay} splitType={splitType} />;
          })}
        </span>
      ) : (
        tokens.map(token => {
          if (token.isSpace) return <span key={token.key} aria-hidden="true" style={RESET}>&nbsp;</span>;
          const idx = animIndex++;
          return <TokenSpan key={token.key} char={token.char} visible={visible} config={config} duration={duration} tokenDelay={initialDelay + idx * delay} splitType={splitType} />;
        })
      )}
    </Tag>
  );
}


/* ─── Magnetic Link ────────────────────────────────────────────── */
function MagLink({ href, children, isActive, onClick, onEnter, onLeave }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.35}px)`;
  }, []);

  const onLeaveEl = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
    el.style.transform = "translate(0,0)";
    setTimeout(() => { if (el) el.style.transition = ""; }, 560);
    onLeave && onLeave();
  }, [onLeave]);

  return (
    <a
      ref={ref}
      href={href}
      className={`mag-link ${isActive ? "active" : ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeaveEl}
      onMouseEnter={onEnter}
      onClick={onClick}
    >
      <span className="mag-inner">{children}</span>
    </a>
  );
}


/* ─── Header ─────────────────────────────────────────────────── */
export default function Header() {
  const [open, setOpen]           = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [progress, setProgress]   = useState(0);
  const [active, setActive]       = useState("home");
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [cursorHover, setCursorHover] = useState(false);

  const links = ["Home", "About", "Projects", "Contact"];

  const marqueeText =
    "Available for work · Portfolio 2025 · Based in Pakistan · Front-end Developer · Creative Developer · ";

  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setScrolled(window.scrollY > 30);
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNav = (label) => {
    setActive(label.toLowerCase());
    setOpen(false);
  };

  return (
    <>
      {/* Custom cursor */}
      <div
        className={`cur ${cursorHover ? "hov" : ""}`}
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      {/* Scroll progress */}
      <div className="prog" style={{ width: `${progress}%` }} />

      {/* Mobile full-screen overlay */}
      <div className={`hd-panel ${open ? "open" : ""}`}>
        <nav className="hd-links">
          {links.map((l, i) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className={`hd-mlink ${active === l.toLowerCase() ? "act" : ""}`}
              onClick={() => handleNav(l)}
            >
              {/* Mobile menu — each item staggered with rotateUp on the label */}
              <span className="hd-mnum">0{i + 1}</span>
              <span className="hd-mlabel">
                <SplitText
                  text={l}
                  tag="span"
                  splitType="chars"
                  variant="rotateUp"
                  delay={45}
                  duration={600}
                  initialDelay={open ? i * 80 : 0}
                  threshold={0}
                  once={false}
                />
              </span>
              <span className="hd-marr">↗</span>
            </a>
          ))}
        </nav>

        {/* Marquee */}
        <div className="hd-mq">
          {[0, 1].map((rep) => (
            <div key={rep} className="hd-mq-track" aria-hidden={rep === 1}>
              {marqueeText.split("·").flatMap((t, i) => [
                <span key={`t${i}`}>{t.trim()}</span>,
                <span key={`d${i}`} className="hd-mq-dot"> · </span>,
              ])}
            </div>
          ))}
        </div>
      </div>

      {/* Header bar */}
      <header className={`hd ${scrolled ? "sc" : ""}`}>

        {/* Logo wordmark — glitch on chars, fires once on mount */}
        <a
          href="#home"
          className="hd-logo"
          onClick={() => handleNav("home")}
          onMouseEnter={() => setCursorHover(true)}
          onMouseLeave={() => setCursorHover(false)}
        >
          <div className="hd-mark">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="8" fill="#d4ff00" />
              <path
                d="M7 27L13 9L18 21L23 9L29 27"
                stroke="#000"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="hd-wordmark">
            {/* "Moazzam" — glitch per char */}
            <SplitText
              text="Moazzam"
              tag="span"
              splitType="chars"
              variant="glitch"
              delay={40}
              duration={550}
              initialDelay={80}
              threshold={0}
            />
            <em>.</em>
          </span>
        </a>

        {/* "Available" badge — blur + words, slightly delayed */}
        <div className="hd-badge">
          <div className="hd-dot" />
          <SplitText
            text="Available"
            tag="span"
            splitType="chars"
            variant="fadeUp"
            delay={35}
            duration={500}
            initialDelay={400}
            threshold={0}
          />
        </div>

        {/* Desktop nav — each link fadeUp chars, staggered by index */}
        <nav className="hd-nav">
          {links.map((l, i) => (
            <MagLink
              key={l}
              href={`#${l.toLowerCase()}`}
              isActive={active === l.toLowerCase()}
              onClick={() => handleNav(l)}
              onEnter={() => setCursorHover(true)}
              onLeave={() => setCursorHover(false)}
            >
              <SplitText
                text={l}
                tag="span"
                splitType="chars"
                variant="fadeUp"
                delay={40}
                duration={550}
                initialDelay={300 + i * 70}
                threshold={0}
              />
            </MagLink>
          ))}
        </nav>

        {/* CTA "Let's Talk" — pop chars, arrives last */}
        <a
          href="#contact"
          className="hd-cta"
          onClick={() => handleNav("contact")}
          onMouseEnter={() => setCursorHover(true)}
          onMouseLeave={() => setCursorHover(false)}
        >
          <span>
            <SplitText
              text="Let's Talk"
              tag="span"
              splitType="chars"
              variant="pop"
              delay={40}
              duration={500}
              initialDelay={600}
              threshold={0}
            />
          </span>
          <span className="cta-arr">↗</span>
        </a>

        {/* Hamburger — no text, skip */}
        <button
          className={`hd-ham ${open ? "open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
        </button>
      </header>
    </>
  );
}