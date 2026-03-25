import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "./project.css";

// ─────────────────────────────────────────────
//  PROJECT DATA
// ─────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: "ShopCraft",
    year: "2024",
    role: "Frontend Dev",
    desc: "An e-commerce store built from scratch. Product listings, cart logic, checkout — the whole thing.",
    tags: ["React.js","E-commerce UI","Shopping Cart Logic","Payment Integration","State Management","Responsive Design","User Experience (UX)"],
    demo: "https://moazzam35.github.io/ShopCraft/#/",
    code: "https://github.com/moazzam35/ShopCraft",
    accent: "#1a9e6e",
    num: "01",
  },
  {
    id: 2,
    title: "Country Cards",
    year: "2024",
    role: "API Integration",
    desc: "Browse every country using a live REST API. Search, filter by region, toggle dark mode.",
    tags: ["React.js","REST API Integration","React Router","Dynamic Filtering","Search Functionality","Dark Mode UI","Responsive Layout"],
    demo: "https://moazzam35.github.io/country-cards",
    code: "https://github.com/moazzam35/country-cards",
    accent: "#1a9e6e",
    num: "02",
  },
  {
    id: 3,
    title: "CRUD Manager",
    year: "2024",
    role: "Full CRUD",
    desc: "Posts app with full create, read, update, delete. Wired to a REST API via Axios.",
    tags: ["React.js","CRUD Operations","Axios API Calls","Form Handling","State Management","RESTful Services","Component-Based Architecture"],
    demo: "https://moazzam35.github.io/crud/",
    code: "https://github.com/moazzam35/crud",
    accent: "#1a9e6e",
    num: "03",
  },
  {
    id: 4,
    title: "Pokémon Data",
    year: "2024",
    role: "Data Explorer",
    desc: "A Pokédex built with vanilla JS and the open PokéAPI. Search and filter all 900+ Pokémon.",
    tags: ["JavaScript (ES6)","API Integration","PokéAPI","Search & Filter","DOM Manipulation","Responsive UI","Performance Optimization"],
    demo: "https://moazzam35.github.io/pokemon-data/",
    code: "https://github.com/moazzam35/pokemon-data",
    accent: "#1a9e6e",
    num: "04",
  }
];


// ─────────────────────────────────────────────
//  SPLIT TEXT (inline — no extra import needed)
// ─────────────────────────────────────────────
const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, transform: "translateY(60%) skewY(8deg)" },
    visible: { opacity: 1, transform: "translateY(0%) skewY(0deg)" },
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "hidden",
  },
  fadeDown: {
    hidden: { opacity: 0, transform: "translateY(-80%)" },
    visible: { opacity: 1, transform: "translateY(0%)" },
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
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
};

const RESET = { border:"none", outline:"none", boxShadow:"none", background:"transparent", padding:0, margin:0 };

function splitIntoChars(text) {
  return [...text].map((char, i) => ({ char, isSpace: char === " ", key: i }));
}
function splitIntoWords(text) {
  return text.split(/(\s+)/).map((word, i) => ({ char: word, isSpace: /^\s+$/.test(word), key: i }));
}
function splitIntoLines(text) {
  return text.split("\n").map((line, i) => ({ char: line, isSpace: false, key: i }));
}

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
      {splitType === "words"
        ? <span style={{ ...RESET, display: "inline-block" }}>{char}</span>
        : char}
    </span>
  );
}

function SplitText({
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
  // allow forcing visible (e.g. card already in view on mount)
  forceVisible,
}) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const hasAnimated = useRef(false);
  const config = VARIANTS[variant] || VARIANTS.fadeUp;

  const tokens = useMemo(() => {
    if (splitType === "words") return splitIntoWords(text);
    if (splitType === "lines") return splitIntoLines(text);
    return splitIntoChars(text);
  }, [text, splitType]);

  const animatableTokens = tokens.filter(t => !t.isSpace);

  useEffect(() => {
    if (forceVisible !== undefined) { setVisible(forceVisible); return; }
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
  }, [threshold, rootMargin, once, forceVisible]);

  useEffect(() => {
    if (!visible || !onComplete) return;
    const totalDuration = initialDelay + animatableTokens.length * delay + duration;
    const timer = setTimeout(onComplete, totalDuration);
    return () => clearTimeout(timer);
  }, [visible]);

  const Tag = tag;
  let animIndex = 0;

  return (
    <Tag ref={containerRef} className={className} style={{ display: "inline", ...style }} aria-label={text}>
      {config.perspective ? (
        <span style={{ display: "inline-block", perspective: config.perspective, border:"none", outline:"none", background:"transparent" }}>
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


// ─────────────────────────────────────────────
//  SVG ICONS
// ─────────────────────────────────────────────
const ArrowSvg = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1.5 10.5L10.5 1.5M10.5 1.5H4.5M10.5 1.5V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GhSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);


// ─────────────────────────────────────────────
//  CARD — card title uses `glitch` on mount
//         card desc uses `fadeUp` on mount
// ─────────────────────────────────────────────
function Card({ p, active, idx }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      className={`card${active ? " card--active" : ""}${hov ? " card--hov" : ""}`}
      style={{ "--accent": p.accent, animationDelay: `${idx * 0.08}s` }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span className="card-wm">{p.num}</span>

      <div className="card-meta">
        <span className="card-year"></span>
        <span className="card-role">
          {/* Role text slides in from left, staggered by card index */}
          <SplitText
            text={p.role}
            tag="span"
            splitType="chars"
            variant="slideRight"
            delay={35}
            duration={500}
            initialDelay={idx * 80}
            threshold={0.1}
          />
        </span>
      </div>

      <div className="card-rule" />

      {/* Card title — glitch entrance, chars, staggered */}
      <h3 className="card-title">
        <SplitText
          text={p.title}
          tag="span"
          splitType="chars"
          variant="glitch"
          delay={45}
          duration={550}
          initialDelay={idx * 60 + 100}
          threshold={0.1}
        />
      </h3>

      {/* Card desc — blur entrance, words */}
      <p className="card-desc">
        <SplitText
          text={p.desc}
          tag="span"
          splitType="words"
          variant="blur"
          delay={30}
          duration={600}
          initialDelay={idx * 60 + 200}
          threshold={0.1}
        />
      </p>

      <div className="card-tags">
        {p.tags.map(t => (
          <span key={t} className="card-tag">{t}</span>
        ))}
      </div>

      <div className="card-footer">
        <a href={p.demo} target="_blank" rel="noopener noreferrer" className="card-btn card-btn--demo">
          View live <ArrowSvg />
        </a>
        <a href={p.code} target="_blank" rel="noopener noreferrer" className="card-btn card-btn--code">
          <GhSvg /> Code
        </a>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
//  PROJECTS SECTION
// ─────────────────────────────────────────────
export default function Projects() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const CARD_W = 380 + 20;

  const goTo = useCallback((i) => {
    const n = (i + PROJECTS.length) % PROJECTS.length;
    setActive(n);
    trackRef.current?.scrollTo({ left: n * CARD_W, behavior: "smooth" });
  }, []);

  const drag = useRef({ on: false, x: 0, s: 0 });
  const onDown = e => { drag.current = { on: true, x: e.pageX, s: trackRef.current.scrollLeft }; };
  const onMove = e => { if (!drag.current.on) return; trackRef.current.scrollLeft = drag.current.s - (e.pageX - drag.current.x); };
  const onUp = () => { drag.current.on = false; };

  useEffect(() => {
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (paused.current) return;
      setActive(prev => {
        const next = (prev + 1) % PROJECTS.length;
        trackRef.current?.scrollTo({ left: next * CARD_W, behavior: "smooth" });
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, [CARD_W]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleScroll = () => {
      const idx = Math.round(track.scrollLeft / CARD_W);
      setActive(Math.max(0, Math.min(idx, PROJECTS.length - 1)));
    };
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [CARD_W]);

  return (
    <section
      className="proj"
      id="projects"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <button className="side-btn side-btn--l" onClick={() => goTo(active - 1)} aria-label="Previous project">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button className="side-btn side-btn--r" onClick={() => goTo(active + 1)} aria-label="Next project">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <header className="proj-hdr">
        <div>
          {/* Eyebrow — fadeUp, words, quick stagger */}
          <p className="proj-eyebrow">
            <SplitText
              text={`selected work — ${PROJECTS.length} projects`}
              tag="span"
              splitType="words"
              variant="fadeUp"
              delay={60}
              duration={600}
              initialDelay={0}
              threshold={0.1}
            />
          </p>

          {/* Main heading — rotateUp per char, dramatic stagger */}
          <h2 className="proj-heading">
            <SplitText
              text="Things I've"
              tag="span"
              splitType="chars"
              variant="rotateUp"
              delay={55}
              duration={750}
              initialDelay={150}
              threshold={0.1}
            />
            <br />
            {/* The italic "actually built." — pop variant, delayed after first line */}
            <em>
              <SplitText
                text="actually built."
                tag="span"
                splitType="chars"
                variant="pop"
                delay={50}
                duration={700}
                initialDelay={700}
                threshold={0.1}
              />
            </em>
          </h2>
        </div>

        <div className="proj-hdr-right">
          {/* Sub paragraph — blur, words, delayed after heading finishes */}
          <p className="proj-sub">
            <SplitText
              text="Personal projects made to learn, ship, and solve real problems."
              tag="span"
              splitType="words"
              variant="blur"
              delay={45}
              duration={700}
              initialDelay={900}
              threshold={0.1}
            />
          </p>
        </div>
      </header>

      <div className="proj-track-wrap">
        <div className="proj-track" ref={trackRef} onMouseDown={onDown} onMouseMove={onMove}>
          <div className="track-pad" />
          {PROJECTS.map((p, i) => (
            <Card key={p.id} p={p} active={active === i} idx={i} />
          ))}
          <div className="track-pad" />
        </div>
      </div>

      <div className="proj-dots">
        {PROJECTS.map((pr, i) => (
          <button
            key={i}
            title={pr.title}
            className={`proj-dot${active === i ? " proj-dot--on" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to ${pr.title}`}
          />
        ))}
      </div>
    </section>
  );
}