import { useRef, useEffect, useState, useCallback, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import "./Project.css";

/* ════════════════════════════════════════════════════════════════
   ANIMATION SYSTEM
   ════════════════════════════════════════════════════════════════ */

const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, transform: "translateY(60%) skewY(8deg)" },
    visible: { opacity: 1, transform: "translateY(0%) skewY(0deg)" },
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  pop: {
    hidden: { opacity: 0, transform: "scale(0.4)" },
    visible: { opacity: 1, transform: "scale(1)" },
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    overflow: "visible",
  },
  slideRight: {
    hidden: { opacity: 0, transform: "translateX(-40px)" },
    visible: { opacity: 1, transform: "translateX(0px)" },
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "visible",
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "visible",
  },
};

/* useInView — scroll-triggered reveal */
function useInView({ threshold = 0.15, rootMargin = "0px", once = true } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
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

  return [ref, visible];
}

/* useRevealOnActive — triggers a reveal whenever a card becomes active */
function useRevealOnActive(active) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return visible;
}

/* AnimSpan — animated span */
function AnimSpan({ visible, config, duration = 700, delay = 0, children, style = {} }) {
  const spanStyle = {
    display: "inline-block",
    overflow: config.overflow === "hidden" ? "hidden" : "visible",
    transition: visible
      ? `opacity ${duration}ms ${config.easing} ${delay}ms,
         transform ${duration}ms ${config.easing} ${delay}ms,
         filter ${duration}ms ${config.easing} ${delay}ms`
      : "none",
    ...(visible ? config.visible : config.hidden),
    ...style,
  };
  return <span style={spanStyle}>{children}</span>;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isTouch = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/* isTypingTarget — true if focus is inside a field that should own arrow keys */
const isTypingTarget = (el) => {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
};

/* ════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════ */

const PROJECTS = [
  {
    id: 1,
    title: "Wheelzy Dashboard",
    year: "2026",
    role: "Frontend Developer",
    desc: "A modern luxury car marketplace admin dashboard featuring analytics, vehicle management, responsive UI, dark/light theme support, smooth animations, and premium user experience inspired by enterprise-level automotive platforms.",
    tags: [
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "Dashboard UI",
      "Dark Mode",
      "Responsive Design",
      "Admin Panel",
      "UI/UX",
    ],
    demo: "https://wheelzy-dashboard.vercel.app/",
    code: "https://github.com/moazzam35/wheelzy_Dashboard",
    num: "01",
    color: "#1c9c7d",
  },
  {
    id: 2,
    title: "Wheelzy",
    year: "2025",
    role: "Frontend Dev",
    desc: "A high-end automotive marketplace UI with smooth micro-interactions, responsive layouts, and performance-optimized design inspired by real-world car platforms.",
    tags: ["Next.js", "Framer Motion", "UI Engineering", "Responsive Design", "Performance Optimization"],
    demo: "https://wheelzy-seven.vercel.app/",
    code: "https://github.com/moazzam35/wheelzy",
    num: "02",
    color: "#6366f1",
  },
  {
    id: 3,
    title: "ShopCraft",
    year: "2024",
    role: "Frontend Dev",
    desc: "Full-featured e-commerce experience with dynamic cart system, product flows, and smooth state-driven UI interactions from scratch.",
    tags: ["React.js", "E-commerce Architecture", "State Management", "Cart System", "UI Logic"],
    demo: "https://moazzam35.github.io/ShopCraft/#/",
    code: "https://github.com/moazzam35/ShopCraft",
    num: "03",
    color: "#1a9e6e",
  },
  {
    id: 4,
    title: "Country Cards",
    year: "2024",
    role: "API Integration",
    desc: "Interactive country explorer powered by live REST API with advanced filtering, search capabilities, and theme switching.",
    tags: ["React.js", "REST API Integration", "Data Fetching", "Routing"],
    demo: "https://moazzam35.github.io/country-cards",
    code: "https://github.com/moazzam35/country-cards",
    num: "04",
    color: "#f59e0b",
  },
  {
    id: 5,
    title: "CRUD Manager",
    year: "2024",
    role: "Full CRUD System",
    desc: "Robust CRUD application powered by REST API, featuring real-time data manipulation, form handling, and Axios-based architecture.",
    tags: ["React.js", "Axios", "REST API", "CRUD Operations", "Form Handling"],
    demo: "https://moazzam35.github.io/crud/",
    code: "https://github.com/moazzam35/crud",
    num: "05",
    color: "#ef4444",
  },
  {
    id: 6,
    title: "Pokémon Data",
    year: "2024",
    role: "Data Explorer",
    desc: "A fast and interactive Pokédex using PokéAPI with search, filtering, and optimized DOM rendering for large datasets.",
    tags: ["React.js", "PokéAPI", "Data Visualization", "Search System", "DOM Optimization"],
    demo: "https://moazzam35.github.io/pokemon-data/",
    code: "https://github.com/moazzam35/pokemon-data",
    num: "06",
    color: "#10b981",
  },
];

/* ════════════════════════════════════════════════════════════════
   ICONS
   ════════════════════════════════════════════════════════════════ */

const GitHubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ════════════════════════════════════════════════════════════════
   SECTION HEADER
   ════════════════════════════════════════════════════════════════ */

const SectionHeader = () => {
  const [ref, visible] = useInView({ threshold: 0.2 });

  return (
    <div className="pc-header" ref={ref} id="projects">
      <AnimSpan visible={visible} config={VARIANTS.slideRight} duration={600} delay={0}>
        <p className="pc-header-eyebrow" style={{ margin: 0 }}>Selected work</p>
      </AnimSpan>

      <AnimSpan visible={visible} config={VARIANTS.fadeUp} duration={800} delay={100} style={{ display: "block", overflow: "hidden" }}>
        <h1 className="pc-header-title" style={{ margin: 0 }}>
          Projects I<br /><em>actually</em> built.
        </h1>
      </AnimSpan>

      <AnimSpan visible={visible} config={VARIANTS.fade} duration={700} delay={300}>
        <p className="pc-header-sub" style={{ margin: 0 }}>
          No templates. No tutorials copy-pasted. Each one shipped, live, and battle-tested in the real world.
        </p>
      </AnimSpan>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   TAGS
   ════════════════════════════════════════════════════════════════ */

const TagList = ({ tags, visible, baseDelay = 0 }) => (
  <ul className="pc-tags" aria-label="Technologies">
    {tags.map((t, i) => (
      <li key={t} className="pc-tag">
        <AnimSpan visible={visible} config={VARIANTS.pop} duration={350} delay={baseDelay + i * 45}>
          {t}
        </AnimSpan>
      </li>
    ))}
  </ul>
);

/* ════════════════════════════════════════════════════════════════
   BUTTONS
   ════════════════════════════════════════════════════════════════ */

const LIVE_BTN_COLOR = "#1a9e6e"; // ShopCraft accent — used for every "View live" button

const ProjectActions = ({ demo, code, visible, delay = 0 }) => {
  const liveRef = useRef(null);
  const codeRef = useRef(null);

  const hoverIn = (ref, scale) => {
    if (isTouch() || !ref.current) return;
    gsap.to(ref.current, { scale, y: -1, duration: 0.3, ease: "power2.out" });
  };
  const hoverOut = (ref) => {
    if (isTouch() || !ref.current) return;
    gsap.to(ref.current, { scale: 1, y: 0, duration: 0.35, ease: "power2.out" });
  };

  return (
    <div
      className="pc-actions"
      style={{
        transition: visible
          ? `opacity 500ms ${VARIANTS.fade.easing} ${delay}ms, transform 500ms ${VARIANTS.fadeUp.easing} ${delay}ms`
          : "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(10px)",
      }}
    >
      {demo ? (
        <motion.a
          ref={liveRef}
          href={demo}
          target="_blank"
          rel="noreferrer"
          className="pc-btn pc-btn--live"
          style={{ background: LIVE_BTN_COLOR }}
          whileTap={{ scale: 0.93 }}
          onMouseEnter={() => hoverIn(liveRef, 1.02)}
          onMouseLeave={() => hoverOut(liveRef)}
        >
          View live <ArrowIcon />
        </motion.a>
      ) : (
        <span className="pc-btn pc-btn--live pc-btn--disabled">No demo</span>
      )}
      {code ? (
        <motion.a
          ref={codeRef}
          href={code}
          target="_blank"
          rel="noreferrer"
          className="pc-btn pc-btn--code"
          whileTap={{ scale: 0.93 }}
          onMouseEnter={() => hoverIn(codeRef, 1.04)}
          onMouseLeave={() => hoverOut(codeRef)}
        >
          <GitHubIcon /> Code
        </motion.a>
      ) : (
        <span className="pc-btn pc-btn--code pc-btn--disabled" aria-disabled="true">
          <GitHubIcon /> Private
        </span>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   COVERFLOW
   ════════════════════════════════════════════════════════════════ */

function getMetrics(width) {
  if (width <= 480) {
    return { cardW: 78, cardH: 128, centerW: Math.min(width - 40, 300), centerH: 500, step: 44 };
  }
  if (width <= 768) {
    return { cardW: 110, cardH: 168, centerW: 320, centerH: 480, step: 70 };
  }
  if (width <= 1100) {
    return { cardW: 140, cardH: 200, centerW: 360, centerH: 470, step: 96 };
  }
  return { cardW: 160, cardH: 220, centerW: 400, centerH: 480, step: 120 };
}

function useMetrics() {
  const [metrics, setMetrics] = useState(() =>
    getMetrics(typeof window !== "undefined" ? window.innerWidth : 1200)
  );
  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setMetrics(getMetrics(window.innerWidth)));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return metrics;
}

/* Pointer-based swipe → prev/next */
function useSwipeNav(ref, onPrev, onNext) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = { down: false, startX: 0, dx: 0 };
    const THRESHOLD = 42;

    const down = (e) => {
      s.down = true; s.dx = 0; s.startX = e.clientX;
      el.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      if (!s.down) return;
      s.dx = e.clientX - s.startX;
    };
    const up = () => {
      if (!s.down) return;
      s.down = false;
      if (s.dx > THRESHOLD) onPrev();
      else if (s.dx < -THRESHOLD) onNext();
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [ref, onPrev, onNext]);
}

const CoverflowCard = ({ project, index, activeIndex, setActiveIndex, registerRef, metrics }) => {
  const isActive = index === activeIndex;
  const contentVisible = useRevealOnActive(isActive);

  const handleKeyDown = (e) => {
    if (isActive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <div
      ref={(el) => registerRef(el, index)}
      className={`pc-cf-card${isActive ? " pc-cf-card--active" : ""}`}
      style={{
        width: isActive ? metrics.centerW : metrics.cardW,
        height: isActive ? metrics.centerH : metrics.cardH,
      }}
      onClick={() => !isActive && setActiveIndex(index)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isActive ? -1 : 0}
      aria-label={project.title}
      aria-current={isActive ? "true" : undefined}
    >
      <div className="pc-cf-card-inner">
        <div className="pc-cf-top">
          <span className="pc-num">{project.num}</span>
          {isActive && <span className="pc-role-badge">{project.role}</span>}
        </div>

        {isActive && <div className="pc-cf-divider" />}

        {isActive ? (
          <div className="pc-cf-content">
            <h3 className="pc-cf-title">{project.title}</h3>
            <span className="pc-cf-year">{project.year}</span>

            <AnimSpan
              visible={contentVisible}
              config={VARIANTS.fadeUp}
              duration={550}
              delay={80}
              style={{ display: "block", overflow: "hidden" }}
            >
              <p className="pc-cf-desc">{project.desc}</p>
            </AnimSpan>

            <TagList tags={project.tags} visible={contentVisible} baseDelay={180} />

            <ProjectActions
              demo={project.demo}
              code={project.code}
              visible={contentVisible}
              delay={180 + project.tags.length * 45 + 80}
            />
          </div>
        ) : (
          <div className="pc-cf-content pc-cf-content--mini">
            <h3 className="pc-cf-title pc-cf-title--mini">{project.title}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const CoverflowTrack = ({ activeIndex, setActiveIndex, metrics }) => {
  const cardRefs = useRef([]);
  const trackRef = useRef(null);

  const registerRef = useCallback((el, i) => {
    cardRefs.current[i] = el;
  }, []);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();

    PROJECTS.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;

      const delta = i - activeIndex;
      const abs = Math.abs(delta);
      const dir = Math.sign(delta);
      const active = delta === 0;

      const x = delta * metrics.step;
      const scale = active ? 1 : Math.max(0.66, 0.94 - abs * 0.09);
      const opacity = abs > 5 ? 0 : active ? 1 : Math.max(0.32, 0.95 - abs * 0.16);
      const blur = active ? 0 : Math.min(2.5, Math.max(0, (abs - 1) * 1.1));
      const rotateY = active ? 0 : dir * -Math.min(34, 10 + abs * 6);
      const z = -abs * 40;
      const zIndex = 100 - abs;

      gsap.to(el, {
        x,
        z,
        rotateY,
        scale,
        opacity,
        zIndex,
        filter: `blur(${blur}px)`,
        duration: reduced ? 0.01 : 0.85,
        delay: reduced ? 0 : Math.min(abs * 0.025, 0.12),
        ease: "power4.out",
        pointerEvents: abs > 5 ? "none" : "auto",
        overwrite: "auto",
      });
    });
  }, [activeIndex, metrics]);

  /* wheel navigation */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let locked = false;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      if (locked) return;
      locked = true;
      setActiveIndex((prev) => {
        const dir = e.deltaY > 0 ? 1 : -1;
        return Math.min(PROJECTS.length - 1, Math.max(0, prev + dir));
      });
      setTimeout(() => (locked = false), 380);
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [setActiveIndex]);

  /* keyboard navigation — ignored while typing in a field elsewhere on the page */
  useEffect(() => {
    const onKey = (e) => {
      if (isTypingTarget(document.activeElement)) return;
      if (e.key === "ArrowRight") setActiveIndex((p) => Math.min(PROJECTS.length - 1, p + 1));
      if (e.key === "ArrowLeft") setActiveIndex((p) => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setActiveIndex]);

  const goPrev = useCallback(() => setActiveIndex((p) => Math.max(0, p - 1)), [setActiveIndex]);
  const goNext = useCallback(
    () => setActiveIndex((p) => Math.min(PROJECTS.length - 1, p + 1)),
    [setActiveIndex]
  );
  useSwipeNav(trackRef, goPrev, goNext);

  return (
    <div
      ref={trackRef}
      className="pc-cf-track"
      style={{ perspective: "1400px", height: metrics.centerH + 40 }}
    >
      {PROJECTS.map((project, i) => (
        <CoverflowCard
          key={project.id}
          project={project}
          index={i}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          registerRef={registerRef}
          metrics={metrics}
        />
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   CONTROLS / FOOTER
   ════════════════════════════════════════════════════════════════ */

const NavChevron = ({ dir, onClick, disabled }) => {
  const ref = useRef(null);

  const hoverIn = () => {
    if (isTouch() || disabled) return;
    gsap.to(ref.current, { scale: 1.08, borderColor: "rgba(255,255,255,0.35)", duration: 0.28, ease: "power2.out" });
  };
  const hoverOut = () => {
    if (isTouch()) return;
    gsap.to(ref.current, { scale: 1, borderColor: "rgba(255,255,255,0.1)", duration: 0.32, ease: "power2.out" });
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === -1 ? "Previous project" : "Next project"}
      className={`pc-cf-chevron ${dir === -1 ? "pc-cf-chevron--left" : "pc-cf-chevron--right"}`}
      whileTap={disabled ? {} : { scale: 0.9 }}
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
      animate={{ opacity: disabled ? 0.2 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {dir === -1 ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </motion.button>
  );
};

const Controls = ({ activeIndex, setActiveIndex }) => {
  const prev = useCallback(() => setActiveIndex((p) => Math.max(0, p - 1)), [setActiveIndex]);
  const next = useCallback(
    () => setActiveIndex((p) => Math.min(PROJECTS.length - 1, p + 1)),
    [setActiveIndex]
  );

  return (
    <>
      <NavChevron dir={-1} onClick={prev} disabled={activeIndex === 0} />
      <NavChevron dir={1} onClick={next} disabled={activeIndex === PROJECTS.length - 1} />

      <div className="pc-controls">
        <div className="pc-dots-nav">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to ${p.title}`}
              className={`pc-dot-nav${i === activeIndex ? " pc-dot-nav--active" : ""}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════════════
   ROOT
   ════════════════════════════════════════════════════════════════ */

const ProjectCoverflow = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const metrics = useMetrics();

  return (
    <section className="pc-section">
      <SectionHeader />

      <div className="pc-cf-wrap">
        <CoverflowTrack activeIndex={activeIndex} setActiveIndex={setActiveIndex} metrics={metrics} />
        <Controls activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </div>
    </section>
  );
};

export default ProjectCoverflow;
export { PROJECTS };