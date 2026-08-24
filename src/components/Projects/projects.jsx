import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  memo,
} from "react";
import gsap from "gsap";
import "./Project.css";

/* ════════════════════════════════════════════════════════════════
   ANIMATION CONSTANTS
   ════════════════════════════════════════════════════════════════ */
const TAG_DELAY_MS = 45;
const TAG_BASE_DELAY_MS = 180;
const ACTION_BUFFER_MS = 80;
const HOVER_SCALE_ACTIVE = 1.02;
const HOVER_SCALE_PREVIEW = 1.02;
const HOVER_Y_OFFSET = -1;
const COVERFLOW_BLUR_PER_STEP = 1.1;
const COVERFLOW_MAX_BLUR = 2.5;
const COVERFLOW_MIN_SCALE = 0.66;
const COVERFLOW_SCALE_STEP = 0.09;
const COVERFLOW_OPACITY_STEP = 0.16;
const COVERFLOW_MIN_OPACITY = 0.32;
const COVERFLOW_DISTANT_OPACITY = 0.63;
const COVERFLOW_MAX_ROTATE = 34;
const COVERFLOW_ROTATE_BASE = 10;
const COVERFLOW_ROTATE_STEP = 6;
const COVERFLOW_Z_STEP = 40;
const COVERFLOW_ANIM_DURATION = 0.85;
const WHEEL_LOCK_MS = 380;
const SWIPE_THRESHOLD = 42;

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
      { threshold, rootMargin },
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
function AnimSpan({
  visible,
  config,
  duration = 700,
  delay = 0,
  children,
  style = {},
}) {
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
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

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
    title: "Resumate",
    year: "2026",
    role: "Full Stack AI Project",
    desc: "An AI-powered full-stack resume builder and career platform featuring AI resume generation, ATS scoring, keyword matching, professional templates, PDF export, cover letter generation, interview preparation, authentication, and responsive user experiences.",
    tags: [
      "Next.js",
      "React",
      "JavaScript",
      "Tailwind CSS",
      "AI Integration",
      "ATS Analysis",
      "Authentication",
      "PDF Generation",
      "Framer Motion",
      "GSAP",
      "Lucide React",
      "Full Stack",
    ],
    demo: "https://resumate-rouge-xi.vercel.app/",
    code: "https://github.com/moazzam35/resume_bulider",
    num: "02",
    color: "#5B4B8A",
  },
  {
    id: 2,
    title: "Aristocraft",
    year: "2026",
    role: "Full Stack project",
    desc: "A premium full-stack furniture e-commerce platform featuring secure authentication, product catalog, shopping cart, wishlist, order management, admin dashboard, responsive design, smooth animations, and a modern luxury shopping experience.",
    tags: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL",
      "Neon",
      "Authentication",
      "Admin Dashboard",
      "Zustand",
      "Framer Motion",
      "GSAP",
      "Full Stack",
    ],
    demo: "https://aristocraft-nine.vercel.app/",
    code: "https://github.com/moazzam35/aristocraft",
    num: "01",
    color: "#004b47",
  },
  {
    id: 3,
    title: "Wheelzy",
    year: "2026",
    role: "Full Stack project",
    desc: "A luxury full-stack automotive marketplace featuring authentication, vehicle listings, advanced search, responsive UI, premium animations, admin management, and a modern user experience inspired by real-world car platforms.",
    tags: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL",
      "Authentication",
      "Admin Panel",
      "Framer Motion",
      "GSAP",
      "Responsive Design",
      "Full Stack",
    ],
    demo: "https://wheelzy-seven.vercel.app/",
    code: "https://github.com/moazzam35/wheelzy",
    num: "02",
    color: "#6366f1",
  },
  {
    id: 4,
    title: "Roomora",
    year: "2026",
    role: "Full Stack project",
    desc: "A full-stack hotel management and booking platform allowing users to browse rooms, view availability, select accommodations, and manage bookings, with an admin dashboard for room, reservation, and user management.",
    tags: [
      "Next.js",
      "React",
      "JavaScript",
      "MongoDB",
      "Tailwind CSS",
      "Authentication",
      "Authorization",
      "Admin Dashboard",
      "CRUD",
      "Booking System",
      "Full Stack",
    ],
    demo: "",
    code: "https://github.com/moazzam35/Roomora",
    num: "03",
    color: "#B56B45",
  },
  {
    id: 5,
    title: "CareVista",
    year: "2026",
    role: "Full Stack project",
    desc: "A full-stack hospital management system designed to streamline patient, doctor, and appointment management with role-based access, administrative workflows, database-backed CRUD operations, and a responsive admin dashboard.",
    tags: [
      "Next.js",
      "React",
      "JavaScript",
      "MongoDB",
      "Tailwind CSS",
      "Authentication",
      "RBAC",
      "Admin Dashboard",
      "CRUD",
      "Appointment Management",
      "Full Stack",
    ],
    demo: "",
    code: "https://github.com/moazzam35/CareVista",
    num: "04",
    color: "#2F6B73",
  },

  {
    id: 6,
    title: "Wheelzy Dashboard",
    year: "2026",
    role: "Frontend Developer",
    desc: "A modern luxury car marketplace admin dashboard featuring analytics, vehicle management, responsive UI, dark/light theme support, smooth animations, and a premium enterprise-level experience.",
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
    num: "03",
    color: "#1c9c7d",
  },

  {
    id: 7,
    title: "ShopCraft",
    year: "2024",
    role: "Frontend Developer",
    desc: "A feature-rich e-commerce application with product browsing, shopping cart, state management, and responsive UI built from scratch using React.",
    tags: [
      "React.js",
      "E-commerce",
      "State Management",
      "Cart System",
      "Responsive Design",
    ],
    demo: "https://moazzam35.github.io/ShopCraft/#/",
    code: "https://github.com/moazzam35/ShopCraft",
    num: "04",
    color: "#1a9e6e",
  },

  {
    id: 8,
    title: "Country Cards",
    year: "2024",
    role: "Frontend Developer",
    desc: "Interactive country explorer powered by REST Countries API featuring live search, region filtering, routing, and dark mode.",
    tags: ["React.js", "REST API", "Data Fetching", "Routing", "Dark Mode"],
    demo: "https://moazzam35.github.io/country-cards",
    code: "https://github.com/moazzam35/country-cards",
    num: "05",
    color: "#f59e0b",
  },

  {
    id: 9,
    title: "CRUD Manager",
    year: "2024",
    role: "Frontend Developer",
    desc: "A CRUD application featuring REST API integration, Axios, form validation, and efficient state-driven data management.",
    tags: ["React.js", "Axios", "REST API", "CRUD Operations", "Form Handling"],
    demo: "https://moazzam35.github.io/crud/",
    code: "https://github.com/moazzam35/crud",
    num: "06",
    color: "#ef4444",
  },

  {
    id: 10,
    title: "Pokémon Data",
    year: "2024",
    role: "Frontend Developer",
    desc: "An interactive Pokédex powered by PokéAPI with fast searching, filtering, responsive layouts, and optimized rendering for large datasets.",
    tags: ["React.js", "PokéAPI", "Search", "Filtering", "Performance"],
    demo: "https://moazzam35.github.io/pokemon-data/",
    code: "https://github.com/moazzam35/pokemon-data",
    num: "07",
    color: "#10b981",
  },
];

/* ════════════════════════════════════════════════════════════════
   ICONS
   ════════════════════════════════════════════════════════════════ */

const ArrowIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 7h10M8 3l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M10 3L5 8l5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 3l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ════════════════════════════════════════════════════════════════
   SECTION HEADER
   ════════════════════════════════════════════════════════════════ */

const SectionHeader = () => {
  const [ref, visible] = useInView({ threshold: 0.2 });

  return (
    <div className="pc-header" ref={ref} id="projects">
      <AnimSpan
        visible={visible}
        config={VARIANTS.slideRight}
        duration={600}
        delay={0}
      >
        <p className="pc-header-eyebrow" style={{ margin: 0 }}>
          Selected work
        </p>
      </AnimSpan>

      <AnimSpan
        visible={visible}
        config={VARIANTS.fadeUp}
        duration={800}
        delay={100}
        style={{ display: "block", overflow: "hidden" }}
      >
        <h1 className="pc-header-title" style={{ margin: 0 }}>
          Projects I<br />
          <em>actually</em> built.
        </h1>
      </AnimSpan>

      <AnimSpan
        visible={visible}
        config={VARIANTS.fade}
        duration={700}
        delay={300}
      >
        <p className="pc-header-sub" style={{ margin: 0 }}>
          No templates. No tutorials copy-pasted. Each one shipped, live, and
          battle-tested in the real world.
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
        <AnimSpan
          visible={visible}
          config={VARIANTS.pop}
          duration={350}              delay={baseDelay + i * TAG_DELAY_MS}
        >
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

const ProjectActions = ({ demo, visible, delay = 0 }) => {
  const liveRef = useRef(null);
  const previewRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const hoverIn = (ref, scale) => {
    if (isTouch() || !ref.current) return;
    gsap.to(ref.current, { scale, y: HOVER_Y_OFFSET, duration: 0.3, ease: "power2.out" });
  };
  const hoverOut = (ref) => {
    if (isTouch() || !ref.current) return;
    gsap.to(ref.current, {
      scale: 1,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 10000);
  };

  if (demo) {
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
        <a
          ref={liveRef}
          href={demo}
          target="_blank"
          rel="noreferrer"
          className="pc-btn pc-btn--live"
          style={{ background: LIVE_BTN_COLOR }}
          onMouseDown={() => { if (!isTouch() && liveRef.current) gsap.to(liveRef.current, { scale: 0.93, duration: 0.1 }); }}
          onMouseUp={() => { if (!isTouch() && liveRef.current) gsap.to(liveRef.current, { scale: 1, duration: 0.2 }); }}
          onMouseEnter={() => hoverIn(liveRef, HOVER_SCALE_ACTIVE)}
          onMouseLeave={() => hoverOut(liveRef)}
        >
          View live <ArrowIcon />
        </a>
      </div>
    );
  }

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
      <a
        ref={previewRef}
        href="#"
        className={`pc-btn pc-btn--live pc-btn--preview${loading ? " pc-btn--loading" : ""}`}
        style={{ background: LIVE_BTN_COLOR }}
        onMouseDown={() => { if (!isTouch() && !loading && previewRef.current) gsap.to(previewRef.current, { scale: 0.93, duration: 0.1 }); }}
        onMouseUp={() => { if (!isTouch() && previewRef.current) gsap.to(previewRef.current, { scale: 1, duration: 0.2 }); }}
        onClick={handlePreview}
        onMouseEnter={() => hoverIn(previewRef, HOVER_SCALE_PREVIEW)}
        onMouseLeave={() => hoverOut(previewRef)}
      >
        {loading ? (
          <span className="pc-btn-loading-text">
            <span className="pc-btn-spinner" />
            Preview is creating
          </span>
        ) : (
          <>
            View live <ArrowIcon />
          </>
        )}
      </a>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   COVERFLOW
   ════════════════════════════════════════════════════════════════ */

function getMetrics(width) {
  if (width <= 480) {
    return {
      cardW: 78,
      cardH: 128,
      centerW: Math.min(width - 40, 300),
      centerH: 500,
      step: 44,
    };
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
    getMetrics(typeof window !== "undefined" ? window.innerWidth : 1200),
  );
  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setMetrics(getMetrics(window.innerWidth)),
      );
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
    const s = { down: false, startX: 0, dx: 0 };      const THRESHOLD = SWIPE_THRESHOLD;

    const down = (e) => {
      if (e.target.closest("a, button")) return;
      s.down = true;
      s.dx = 0;
      s.startX = e.clientX;
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

const CoverflowCard = memo(({
  project,
  index,
  activeIndex,
  setActiveIndex,
  registerRef,
  metrics,
}) => {
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
      role="group"
      aria-roledescription="slide"
      tabIndex={isActive ? -1 : 0}
      aria-label={`${project.title}, ${isActive ? "current slide" : `slide ${index + 1} of ${PROJECTS.length}`}`}
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

            <TagList
              tags={project.tags}
              visible={contentVisible}
              baseDelay={180}
            />

            <ProjectActions
              demo={project.demo}
              visible={contentVisible}
              delay={TAG_BASE_DELAY_MS + project.tags.length * TAG_DELAY_MS + ACTION_BUFFER_MS}
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
});

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
      const scale = active ? 1 : Math.max(COVERFLOW_MIN_SCALE, 0.94 - abs * COVERFLOW_SCALE_STEP);
      const opacity =
        active ? 1 : Math.max(COVERFLOW_DISTANT_OPACITY, 0.95 - abs * COVERFLOW_OPACITY_STEP);
      const blur = active ? 0 : Math.min(COVERFLOW_MAX_BLUR, Math.max(0, (abs - 1) * COVERFLOW_BLUR_PER_STEP));
      const rotateY = active ? 0 : dir * -Math.min(COVERFLOW_MAX_ROTATE, COVERFLOW_ROTATE_BASE + abs * COVERFLOW_ROTATE_STEP);
      const z = -abs * COVERFLOW_Z_STEP;
      const zIndex = 100 - abs;

      gsap.to(el, {
        x,
        z,
        rotateY,
        scale,
        opacity,
        zIndex,
        filter: `blur(${blur}px)`,
        duration: reduced ? 0.01 : COVERFLOW_ANIM_DURATION,
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
      setTimeout(() => (locked = false), WHEEL_LOCK_MS);
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [setActiveIndex]);

  /* keyboard navigation — ignored while typing in a field elsewhere on the page */
  useEffect(() => {
    const onKey = (e) => {
      if (isTypingTarget(document.activeElement)) return;
      if (e.key === "ArrowRight")
        setActiveIndex((p) => Math.min(PROJECTS.length - 1, p + 1));
      if (e.key === "ArrowLeft") setActiveIndex((p) => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setActiveIndex]);

  const goPrev = useCallback(
    () => setActiveIndex((p) => Math.max(0, p - 1)),
    [setActiveIndex],
  );
  const goNext = useCallback(
    () => setActiveIndex((p) => Math.min(PROJECTS.length - 1, p + 1)),
    [setActiveIndex],
  );
  useSwipeNav(trackRef, goPrev, goNext);

  return (
    <div
      ref={trackRef}
      className="pc-cf-track"
      style={{ perspective: "1400px", height: metrics.centerH + 40 }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
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
    gsap.to(ref.current, {
      scale: 1.08,
      borderColor: "rgba(255,255,255,0.35)",
      duration: 0.28,
      ease: "power2.out",
    });
  };
  const hoverOut = () => {
    if (isTouch()) return;
    gsap.to(ref.current, {
      scale: 1,
      borderColor: "rgba(255,255,255,0.1)",
      duration: 0.32,
      ease: "power2.out",
    });
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === -1 ? "Previous project" : "Next project"}
      className={`pc-cf-chevron ${dir === -1 ? "pc-cf-chevron--left" : "pc-cf-chevron--right"}`}
      style={{ opacity: disabled ? 0.2 : 1, transition: "opacity 0.25s ease-out" }}
      onMouseDown={() => { if (!isTouch() && !disabled && ref.current) gsap.to(ref.current, { scale: 0.9, duration: 0.1 }); }}
      onMouseUp={() => { if (!isTouch() && ref.current) gsap.to(ref.current, { scale: 1, duration: 0.15 }); }}
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
    >
      {dir === -1 ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  );
};

const Controls = ({ activeIndex, setActiveIndex }) => {
  const prev = useCallback(
    () => setActiveIndex((p) => Math.max(0, p - 1)),
    [setActiveIndex],
  );
  const next = useCallback(
    () => setActiveIndex((p) => Math.min(PROJECTS.length - 1, p + 1)),
    [setActiveIndex],
  );

  return (
    <>
      <NavChevron dir={-1} onClick={prev} disabled={activeIndex === 0} />
      <NavChevron
        dir={1}
        onClick={next}
        disabled={activeIndex === PROJECTS.length - 1}
      />

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
        <CoverflowTrack
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          metrics={metrics}
        />
        <Controls activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </div>
    </section>
  );
};

export default ProjectCoverflow;
export { PROJECTS };
