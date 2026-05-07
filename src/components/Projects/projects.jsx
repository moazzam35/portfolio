import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import "./Project.css";

/* ─── Variants (CSS strings — same pattern as Header.jsx) ─────── */
const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, transform: "translateY(60%) skewY(8deg)" },
    visible: { opacity: 1, transform: "translateY(0%) skewY(0deg)" },
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(8px)", transform: "scale(1.04)" },
    visible: { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
    easing: "cubic-bezier(0.2, 0, 0, 1)",
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
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
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

/* ─── useInView hook (mirrors Header.jsx IntersectionObserver) ── */
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

/* ─── Animated span (mirrors TokenSpan in Header.jsx) ─────────── */
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

/* ─── Data ────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    title: "Wheelzy",
    year: "2025",
    role: "Frontend Dev",
    desc: "A high-end automotive marketplace UI with smooth micro-interactions, responsive layouts, and performance-optimized design inspired by real-world car platforms.",
    tags: ["Next.js", "Framer Motion", "UI Engineering", "Responsive Design", "Performance Optimization", "Impressive"],
    demo: "https://wheelzy-seven.vercel.app/",
    code: "https://github.com/moazzam35/wheelzy",
    num: "01",
    color: "#6366f1",
  },
  {
    id: 2,
    title: "ShopCraft",
    year: "2024",
    role: "Frontend Dev",
    desc: "Full-featured e-commerce experience with dynamic cart system, product flows, and smooth state-driven UI interactions from scratch.",
    tags: ["React.js", "E-commerce Architecture", "State Management", "Cart System", "UI Logic", "modren"],
    demo: "https://moazzam35.github.io/ShopCraft/#/",
    code: "https://github.com/moazzam35/ShopCraft",
    num: "02",
    color: "#1a9e6e",
  },
  {
    id: 3,
    title: "Country Cards",
    year: "2024",
    role: "API Integration",
    desc: "Interactive country explorer powered by live REST API with advanced filtering, search capabilities, and theme switching.",
    tags: ["React.js", "REST API Integration", "Data Fetching", "Routing", "Amazing"],
    demo: "https://moazzam35.github.io/country-cards",
    code: "https://github.com/moazzam35/country-cards",
    num: "03",
    color: "#f59e0b",
  },
  {
    id: 4,
    title: "CRUD Manager",
    year: "2024",
    role: "Full CRUD System",
    desc: "Robust CRUD application powered by REST API, featuring real-time data manipulation, form handling, and Axios-based architecture.",
    tags: ["React.js", "Axios", "REST API", "CRUD Operations", "Form Handling"],
    demo: "https://moazzam35.github.io/crud/",
    code: "https://github.com/moazzam35/crud",
    num: "04",
    color: "#ef4444",
  },
  {
    id: 5,
    title: "Pokémon Data",
    year: "2024",
    role: "Data Explorer",
    desc: "A fast and interactive Pokédex using PokéAPI with search, filtering, and optimized DOM rendering for large datasets.",
    tags: ["React.js", "PokéAPI", "Data Visualization", "Search System", "DOM Optimization"],
    demo: "https://moazzam35.github.io/pokemon-data/",
    code: "https://github.com/moazzam35/pokemon-data",
    num: "05",
    color: "#10b981",
  },
];

/* ─── Icons ────────────────────────────────────── */
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
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Detect touch ─────────────────────────────── */
const isTouch = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/* ─── Header ───────────────────────────────────── */
const SectionHeader = () => {
  const [ref, visible] = useInView({ threshold: 0.2 });

  return (
    <div className="pc-header" ref={ref} id="projects">

      {/* eyebrow — slideRight */}
      <AnimSpan visible={visible} config={VARIANTS.slideRight} duration={600} delay={0}>
        <p className="pc-header-eyebrow" style={{ margin: 0 }}>Selected work</p>
      </AnimSpan>

      {/* title — fadeUp */}
      <AnimSpan visible={visible} config={VARIANTS.fadeUp} duration={800} delay={100} style={{ display: "block", overflow: "hidden" }}>
        <h1 className="pc-header-title" style={{ margin: 0 }}>
          Projects I<br /><em>actually</em> built.
        </h1>
      </AnimSpan>

      {/* accent line — scaleX via transform */}
      <span
        style={{
          display: "block",
          height: "1px",
          background: "linear-gradient(90deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
          marginBottom: "16px",
          maxWidth: "340px",
          transformOrigin: "left center",
          transition: visible ? `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 250ms, opacity 900ms ease 250ms` : "none",
          transform: visible ? "scaleX(1)" : "scaleX(0)",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* sub — fade */}
      <AnimSpan visible={visible} config={VARIANTS.fade} duration={700} delay={350}>
        <p className="pc-header-sub" style={{ margin: 0 }}>
          No templates. No tutorials copy-pasted. Each one shipped, live, and battle-tested in the real world.
        </p>
      </AnimSpan>
    </div>
  );
};

/* ─── Card ─────────────────────────────────────── */
const ProjectCard = ({ project, index }) => {
  const { title, year, role, desc, tags, demo, code, num, color } = project;

  const cardRef = useRef(null);
  const [inViewRef, visible] = useInView({ threshold: 0.1 });

  /* Merge refs */
  const setRef = useCallback((el) => {
    cardRef.current = el;
    inViewRef.current = el;
  }, [inViewRef]);

  /* Framer Motion 3-D tilt — desktop only */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 25 });

  const entranceDelay = index * 120;

  /* Card inline style — blur entrance via CSS transition (same as Header.jsx) */
  const cardStyle = {
    transition: visible
      ? `opacity 1000ms ${VARIANTS.blur.easing} ${entranceDelay}ms,
         transform 1000ms ${VARIANTS.blur.easing} ${entranceDelay}ms,
         filter 1000ms ${VARIANTS.blur.easing} ${entranceDelay}ms`
      : "none",
    ...(visible ? VARIANTS.blur.visible : VARIANTS.blur.hidden),
  };

  /* Line — scaleX via transform */
  const lineStyle = {
    transformOrigin: "left center",
    transition: visible
      ? `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${entranceDelay + 300}ms`
      : "none",
    transform: visible ? "scaleX(1)" : "scaleX(0)",
  };

  /* Title hover */
  const handleTitleEnter = (e) => {
    e.currentTarget.style.transition = "transform 0.3s cubic-bezier(0.4,0,0.2,1)";
    e.currentTarget.style.transform = "translateX(4px)";
  };
  const handleTitleLeave = (e) => {
    e.currentTarget.style.transition = "transform 0.3s cubic-bezier(0.4,0,0.2,1)";
    e.currentTarget.style.transform = "translateX(0px)";
  };

  /* 3-D tilt handlers */
  const onMove = useCallback((e) => {
    if (isTouch()) return;
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const handleMouseEnter = () => {
    if (isTouch()) return;
    gsap.to(cardRef.current, { borderColor: `${color}40`, duration: 0.28 });
  };

  const handleMouseLeave = () => {
    if (isTouch()) return;
    gsap.to(cardRef.current, { borderColor: "rgba(255,255,255,0.06)", duration: 0.35 });
    mx.set(0); my.set(0);
  };

  return (
    <motion.article
      ref={setRef}
      className="pc-card"
      style={{
        "--accent": color,
        ...cardStyle,
        ...(isTouch() ? {} : { rotateX, rotateY, transformPerspective: 900 }),
      }}
      onMouseMove={onMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={title}
    >
      <div className="pc-top">
        <div className="pc-dot-group">
          <span className="pc-num">{num}</span>
        </div>
        <AnimSpan visible={visible} config={VARIANTS.fade} duration={500} delay={entranceDelay + 200}>
          <span className="pc-role">{role}</span>
        </AnimSpan>
      </div>

      {/* Line */}
      <div className="pc-line" style={lineStyle} />

      {/* Title */}
      <AnimSpan
        visible={visible}
        config={VARIANTS.fadeUp}
        duration={700}
        delay={entranceDelay + 150}
        style={{ display: "block", overflow: "hidden" }}
      >
        <h2
          className="pc-title"
          style={{ margin: 0, display: "inline-block" }}
          onMouseEnter={handleTitleEnter}
          onMouseLeave={handleTitleLeave}
        >
          {title}
        </h2>
      </AnimSpan>

      <AnimSpan visible={visible} config={VARIANTS.fade} duration={500} delay={entranceDelay + 220}>
        <span className="pc-year">{year}</span>
      </AnimSpan>

      <AnimSpan visible={visible} config={VARIANTS.fade} duration={600} delay={entranceDelay + 280}>
        <p className="pc-desc" style={{ margin: 0 }}>{desc}</p>
      </AnimSpan>

      {/* Tags — staggered fade (same stagger pattern as Header.jsx token spans) */}
      <ul className="pc-tags" aria-label="Technologies">
        {tags.map((t, i) => (
          <li key={t} className="pc-tag">
            <AnimSpan
              visible={visible}
              config={VARIANTS.pop}
              duration={350}
              delay={entranceDelay + 380 + i * 50}
            >
              {t}
            </AnimSpan>
          </li>
        ))}
      </ul>

        <div
          className="pc-actions"
          style={{
            transition: visible ? `opacity 500ms ${VARIANTS.fade.easing} ${entranceDelay + 500}ms` : "none",
            ...(visible ? VARIANTS.fade.visible : VARIANTS.fade.hidden),
          }}
        >
          {demo ? (
            <a href={demo} target="_blank" rel="noreferrer" className="pc-btn pc-btn--live">
              View live <ArrowIcon />
            </a>
          ) : (
            <span className="pc-btn pc-btn--live pc-btn--disabled">No demo</span>
          )}
          {code ? (
            <a href={code} target="_blank" rel="noreferrer" className="pc-btn pc-btn--code">
              <GitHubIcon /> Code
            </a>
          ) : (
            <span className="pc-btn pc-btn--code pc-btn--disabled" aria-disabled="true">
              <GitHubIcon /> Private
            </span>
          )}
        </div>
    </motion.article>
  );
};

/* ─── Drag scroll ──────────────────────────────── */
function useDragScroll(trackRef, cardWidth = 332) {
  const state = useRef({
    isDragging: false, startX: 0, startScroll: 0,
    velX: 0, lastX: 0, lastTime: 0, moved: false,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (isTouch()) return;

    const s = state.current;

    const down = (e) => {
      if (e.button !== 0) return;
      s.isDragging = true; s.moved = false;
      s.startX = e.clientX; s.startScroll = track.scrollLeft;
      s.lastX = e.clientX; s.lastTime = performance.now(); s.velX = 0;
      gsap.killTweensOf(track);
      track.style.cursor = "grabbing";
      track.setPointerCapture(e.pointerId);
    };

    const move = (e) => {
      if (!s.isDragging) return;
      e.preventDefault();
      const dx = e.clientX - s.startX;
      const now = performance.now();
      const dt = now - s.lastTime || 1;
      s.velX = (e.clientX - s.lastX) / dt;
      s.lastX = e.clientX; s.lastTime = now;
      if (Math.abs(dx) > 4) s.moved = true;
      track.scrollLeft = s.startScroll - dx;
    };

    const up = () => {
      if (!s.isDragging) return;
      s.isDragging = false;
      track.style.cursor = "grab";
      if (!s.moved) return;
      const momentum = -s.velX * 200;
      const max = track.scrollWidth - track.clientWidth;
      const projected = Math.max(0, Math.min(max, track.scrollLeft + momentum));
      const target = Math.round(projected / cardWidth) * cardWidth;
      gsap.to(track, { scrollLeft: target, duration: 0.65, ease: "power3.out" });
    };

    const clickCapture = (e) => {
      if (s.moved) { e.stopPropagation(); e.preventDefault(); s.moved = false; }
    };

    track.addEventListener("pointerdown", down);
    track.addEventListener("pointermove", move, { passive: false });
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);
    track.addEventListener("click", clickCapture, true);

    return () => {
      track.removeEventListener("pointerdown", down);
      track.removeEventListener("pointermove", move);
      track.removeEventListener("pointerup", up);
      track.removeEventListener("pointercancel", up);
      track.removeEventListener("click", clickCapture, true);
    };
  }, [trackRef, cardWidth]);
}

/* ─── Scroll dots ──────────────────────────────── */
const ScrollDots = ({ count, trackRef }) => {
  const dotsRef = useRef([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? track.scrollLeft / max : 0;
      const active = Math.round(pct * (count - 1));
      dotsRef.current.forEach((d, i) => d?.classList.toggle("pc-dot-nav--active", i === active));
    };

    track.addEventListener("scroll", update, { passive: true });
    update();
    return () => track.removeEventListener("scroll", update);
  }, [count, trackRef]);

  return (
    <div className="pc-dots-nav" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} ref={(el) => (dotsRef.current[i] = el)} className="pc-dot-nav" />
      ))}
    </div>
  );
};

/* ─── Scroll bar ───────────────────────────────── */
const ScrollBar = ({ trackRef }) => {
  const thumbRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? track.scrollLeft / max : 0;
      if (thumbRef.current) {
        thumbRef.current.style.transform = `scaleX(${pct})`;
      }
    };

    track.addEventListener("scroll", update, { passive: true });
    update();
    return () => track.removeEventListener("scroll", update);
  }, [trackRef]);

  return (
    <div className="pc-scrollbar">
      <div ref={thumbRef} className="pc-scrollbar-thumb" />
    </div>
  );
};

/* ─── Nav Buttons ──────────────────────────────── */
const NavButtons = ({ trackRef, count }) => {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const cardWidth =
    typeof window !== "undefined" && window.innerWidth >= 768 ? 376 : 332;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setCanPrev(track.scrollLeft > 4);
      setCanNext(track.scrollLeft < max - 4);
    };

    track.addEventListener("scroll", update, { passive: true });
    update();
    return () => track.removeEventListener("scroll", update);
  }, [trackRef]);

  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const target = Math.max(0, Math.min(max, track.scrollLeft + dir * cardWidth));
    gsap.to(track, { scrollLeft: target, duration: 0.6, ease: "power3.out" });
  };

  return (
    <div className="pc-controls">
      <span className="pc-count">{count} projects</span>

      <div className="pc-nav-btns">
        <motion.button
          className="pc-nav-btn"
          onClick={() => scroll(-1)}
          disabled={!canPrev}
          aria-label="Previous project"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          animate={{ opacity: canPrev ? 1 : 0.25 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ChevronLeftIcon />
        </motion.button>

        <motion.button
          className="pc-nav-btn"
          onClick={() => scroll(1)}
          disabled={!canNext}
          aria-label="Next project"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.06 }}
          animate={{ opacity: canNext ? 1 : 0.25 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ChevronRightIcon />
        </motion.button>
      </div>
    </div>
  );
};

/* ─── Grid ─────────────────────────────────────── */
const ProjectGrid = () => {
  const trackRef = useRef(null);
  const cardWidth = typeof window !== "undefined" && window.innerWidth >= 768 ? 376 : 332;
  useDragScroll(trackRef, cardWidth);

  return (
    <>
      <SectionHeader />

      <div className="pc-grid-wrap">
        <div className="pc-fade pc-fade--left" aria-hidden="true" />
        <div className="pc-fade pc-fade--right" aria-hidden="true" />

        <NavButtons trackRef={trackRef} count={PROJECTS.length} />

        <section ref={trackRef} className="pc-grid" aria-label="Projects">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </section>

        <ScrollBar trackRef={trackRef} />
        <ScrollDots count={PROJECTS.length} trackRef={trackRef} />
      </div>
    </>
  );
};

export default ProjectGrid;
export { ProjectCard, PROJECTS };