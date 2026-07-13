// SkillsSection.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  { name: "React", level: 92, icon: "react" },
  { name: "Next.js", level: 88, icon: "nextjs" },
  { name: "JavaScript", level: 95, icon: "javascript" },
  { name: "TypeScript", level: 90, icon: "typescript" },
  { name: "Node.js", level: 87, icon: "nodejs" },
  { name: "Express.js", level: 85, icon: "express" },
  { name: "MongoDB", level: 82, icon: "mongodb" },
  { name: "Tailwind CSS", level: 93, icon: "tailwind" },
  { name: "GSAP", level: 80, icon: "gsap" },
  { name: "Framer Motion", level: 84, icon: "framer" },
];

function TechIcon({ name, className }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "react":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="12" rx="9" ry="3.6" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "nextjs":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 8v8" />
          <path d="M9 8l6 8" />
          <path d="M15 8v8" />
        </svg>
      );
    case "javascript":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 14c0 1.2.8 2 2 2s1.6-.6 1.6-1.6V9" />
          <path d="M15.5 9c-1.4 0-2 .7-2 1.6 0 2 3 1.6 3 3.4 0 1-.8 1.6-1.8 1.6S13 15 13 14" opacity="0" />
        </svg>
      );
    case "typescript":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h4" />
          <path d="M11 9v6" />
          <path d="M15 15c.3.5.8.9 1.5.9.9 0 1.5-.5 1.5-1.2 0-1.7-3-1.2-3-3 0-.8.7-1.4 1.6-1.4.7 0 1.2.3 1.4.7" />
        </svg>
      );
    case "nodejs":
      return (
        <svg {...common}>
          <path d="M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3L12 3z" />
          <path d="M9 12.5c0 1 .8 1.8 2 1.8h1c1.2 0 2-.6 2-1.6 0-2.1-4.6-1.2-4.6-3.4 0-1 .9-1.6 2.1-1.6 1 0 1.7.4 2.1 1" opacity="0" />
          <path d="M12 8.4v7.2" />
        </svg>
      );
    case "express":
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="12" rx="1.5" />
          <path d="M7 6V5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V6" />
          <path d="M8 12h8" />
          <path d="M8 15h5" />
        </svg>
      );
    case "mongodb":
      return (
        <svg {...common}>
          <path d="M12 3c3 3 4.5 6.2 4.5 9.3 0 3.6-2 6.2-4.5 7.7-2.5-1.5-4.5-4.1-4.5-7.7C7.5 9.2 9 6 12 3z" />
          <path d="M12 15v6" />
        </svg>
      );
    case "tailwind":
      return (
        <svg {...common}>
          <path d="M6 12c1-3 2.6-4.5 5-4.5 3 0 3.6 2.5 6 2.5 1.7 0 2.6-.9 3-2.5-1 3-2.6 4.5-5 4.5-3 0-3.6-2.5-6-2.5-1.7 0-2.6.9-3 2.5z" />
          <path d="M3 16.5c1-3 2.6-4.5 5-4.5 3 0 3.6 2.5 6 2.5 1.7 0 2.6-.9 3-2.5-1 3-2.6 4.5-5 4.5-3 0-3.6-2.5-6-2.5-1.7 0-2.6.9-3 2.5z" />
        </svg>
      );
    case "gsap":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12a4 4 0 1 1 4 4" />
          <path d="M12 9v3h3" />
        </svg>
      );
    case "framer":
      return (
        <svg {...common}>
          <path d="M6 3h12v6h-6l6 6h-12v-6h6L6 3z" />
        </svg>
      );
    default:
      return null;
  }
}

function SkillRow({ skill, index, registerRow }) {
  const rowRef = useRef(null);
  const fillRef = useRef(null);
  const glowRef = useRef(null);
  const shimmerRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    registerRow(index, {
      row: rowRef.current,
      fill: fillRef.current,
      glow: glowRef.current,
      shimmer: shimmerRef.current,
      percent: percentRef.current,
      level: skill.level,
    });
  }, [index, registerRow, skill.level]);

  return (
    <motion.div
      ref={rowRef}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex items-center gap-4 rounded-2xl px-4 py-4 transition-colors duration-300 hover:bg-white/[0.035] sm:gap-5 sm:px-5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lime-400 transition-colors duration-300 group-hover:border-lime-400/30 group-hover:text-lime-300">
        <TechIcon name={skill.icon} className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="truncate text-sm font-medium text-neutral-200 sm:text-base">
            {skill.name}
          </span>
          <span
            ref={percentRef}
            className="shrink-0 font-mono text-xs tabular-nums text-lime-400/90 sm:text-sm"
          >
            0%
          </span>
        </div>

        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            ref={fillRef}
            className="relative h-full w-0 rounded-full bg-gradient-to-r from-lime-500 to-lime-300 transition-[filter] duration-300 group-hover:brightness-125"
          >
            <div
              ref={shimmerRef}
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </div>
          <div
            ref={glowRef}
            className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-lime-300 opacity-0 blur-[3px] shadow-[0_0_10px_3px_rgba(163,230,53,0.55)]"
            style={{ left: "0%" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const rowsData = useRef(new Map());

  const registerRow = (index, data) => {
    rowsData.current.set(index, data);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const entries = Array.from(rowsData.current.values());

          entries.forEach((entry, i) => {
            const { fill, glow, shimmer, percent, level } = entry;
            if (!fill || !glow || !percent) return;

            if (prefersReducedMotion) {
              gsap.set(fill, { width: `${level}%` });
              gsap.set(glow, { left: `${level}%`, opacity: 1 });
              percent.textContent = `${level}%`;
              gsap.set(glow, { opacity: 0, delay: 0.6 });
              return;
            }

            const proxy = { value: 0 };

            gsap.to(proxy, {
              value: level,
              duration: 1.4,
              delay: i * 0.12,
              ease: "power3.out",
              onStart: () => {
                gsap.set(glow, { opacity: 1 });
              },
              onUpdate: () => {
                const v = proxy.value;
                fill.style.width = `${v}%`;
                glow.style.left = `${v}%`;
                percent.textContent = `${Math.round(v)}%`;
              },
              onComplete: () => {
                gsap.to(glow, { opacity: 0, duration: 0.6, delay: 0.3 });
              },
            });

            if (shimmer) {
              gsap.fromTo(
                shimmer,
                { x: "-100%" },
                {
                  x: "100%",
                  duration: 1.4,
                  delay: i * 0.12,
                  ease: "power3.out",
                }
              );
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black px-6 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 sm:mb-16"
        >
          <span className="mb-3 block text-xs font-medium uppercase tracking-[0.2em] text-lime-400/80">
            Skills
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Technical Proficiency
          </h2>
          <p className="mt-3 max-w-md text-sm text-neutral-400 sm:text-base">
            Technologies I use to design, build, and ship full-stack
            applications.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col divide-y divide-white/[0.06] rounded-3xl border border-white/[0.06] bg-white/[0.015] p-2 backdrop-blur-sm sm:p-3"
        >
          {SKILLS.map((skill, index) => (
            <SkillRow
              key={skill.name}
              skill={skill}
              index={index}
              registerRow={registerRow}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}