import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from "framer-motion";

/* ─── COLOR PALETTE — change values here ─── */
const COLORS = {
  bg: "#0a0a0a",           // base black background
  yellowGreen: "#E8FF3A",  // primary neon accent
  maroon: "#800000",       // deep red-brown — swap hex if you want a different shade of maroon
  lavender: "#C8A2C8",     // muted purple-pink — swap hex if you want lighter/darker lavender
  brown: "#775144",        // warm brown (your hex)
  darkTeal: "#123832",     // deep green-teal (your hex)
  offWhite: "#F0EDE6",     // body text / text items
  yellow : "#ffd700",       // optional: for any additional accent or highlight
};

const ROWS = [
  {
    id: "r1",
    speed: -0.38,
    items: [
      { type: "text", content: "FULL STACK" },
      { type: "card", bg: COLORS.yellowGreen, color: "#080808", label: "FULL STACK\nDEVELOPER", sub: "MERN & Next.js", accent: "#080808" },
      { type: "text", content: "NEXT.JS" },
      { type: "card", bg: COLORS.maroon, color: "#fff", label: "BACKEND\nENGINEER", sub: "Node & Express", accent: COLORS.yellowGreen },
      { type: "text", content: "NODE.JS" },
      { type: "card", bg: COLORS.darkTeal, color: "#fff", label: "API\nDESIGN", sub: "REST & GraphQL", accent: COLORS.yellowGreen },
      { type: "text", content: "MONGODB" },
      { type: "card", bg: COLORS.brown, color: COLORS.yellowGreen, label: "DATABASE\nARCHITECT", sub: "SQL & NoSQL", accent: "#fff" },
    ],
  },
  {
    id: "r2",
    speed: 0.44,
    items: [
      { type: "card", bg: COLORS.lavender, color: "#080808", label: "NEON\nPOSTGRES", sub: "Serverless SQL", accent: "#080808" },
      { type: "text", content: "POSTGRESQL" },
      { type: "card", bg: COLORS.yellow, color: "#080808", label: "MODERN\nWEB", sub: "Design Systems", accent: "#080808" },
      { type: "text", content: "EXPRESS" },
      { type: "card", bg: COLORS.darkTeal, color: "#fff", label: "DIGITAL\nEXP.", sub: "Web & App", accent: COLORS.lavender },
      { type: "text", content: "JAVASCRIPT" },
      { type: "card", bg: COLORS.maroon, color: "#fff", label: "SYSTEM\nDESIGN", sub: "Scalable Apps", accent: COLORS.yellowGreen },
      { type: "text", content: "REACT" },
    ],
  },
  {
    id: "r3",
    speed: -0.27,
    items: [
      { type: "text", content: "BACKEND" },
      { type: "card", bg: COLORS.brown, color: "#fff", label: "REST\nAPIS", sub: "Node & Express", accent: COLORS.yellowGreen },
      { type: "text", content: "SQL" },
      { type: "card", bg: COLORS.darkTeal, color: COLORS.lavender, label: "AUTH &\nSECURITY", sub: "JWT / OAuth", accent: "#fff" },
      { type: "text", content: "FRONTEND" },
      { type: "card", bg: COLORS.lavender, color: "#080808", label: "CLOUD &\nDEVOPS", sub: "Deployment", accent: "#080808" },
      { type: "text", content: "CODED" },
      { type: "card", bg: COLORS.yellowGreen, color: "#080808", label: "END TO\nEND DEV", sub: "Idea to Prod", accent: "#080808" },
    ],
  },
];

/* ─── hook: tracks viewport width ─── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

/* ─── single marquee row ─── */
function MarqueeRow({ items, speed, scrollY }) {
  const x = useMotionValue(0);
  const xSmooth = useSpring(x, { damping: 60, stiffness: 300, mass: 1 });
  const lastScrollRef = useRef(0);
  const baseX = useRef(0);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const isMobile = useIsMobile();

  /* card width + gap — matches Item sizing */
  const ITEM_W = isMobile ? 148 : 210; // card width + 10px gap

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  useEffect(() => {
    let prev = performance.now();
    const loop = (now) => {
      const dt = now - prev;
      prev = now;
      if (!pausedRef.current) baseX.current += speed * dt * 0.04;
      const sy = scrollY.get();
      const delta = (sy - lastScrollRef.current) * speed * 1.8;
      lastScrollRef.current = sy;
      baseX.current += delta;
      const half = (items.length * ITEM_W) / 2;
      if (baseX.current < -half) baseX.current += half;
      if (baseX.current > 0) baseX.current -= half;
      x.set(baseX.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isMobile]);

  return (
    <div
      className="overflow-hidden w-full cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={() => setTimeout(resume, 500)}
    >
      <motion.div style={{ x: xSmooth }} className="flex gap-[10px]">
        {[...items, ...items].map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

/* ─── individual item (text or card) ─── */
function Item({ item }) {
  const [hov, setHov] = useState(false);
  const isMobile = useIsMobile();

  if (item.type === "text") {
    return (
      <div
        className="flex-shrink-0 flex items-center"
        style={{ padding: isMobile ? "0 10px" : "0 20px", height: isMobile ? 100 : 140 }}
      >
        <span
          style={{
            fontFamily: "'Black Han Sans', 'Arial Black', sans-serif",
            fontSize: isMobile ? "clamp(28px, 7vw, 46px)" : "clamp(52px, 7vw, 88px)",
            fontWeight: 900,
            color: COLORS.offWhite, // body/text-item color
            letterSpacing: "-0.04em",
            lineHeight: 1,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            WebkitTextStroke: "1px rgba(240,237,230,0.25)",
          }}
        >
          {item.content}
        </span>
        <span
          style={{
            color: COLORS.yellowGreen, // slash accent — change per taste
            fontSize: isMobile ? 28 : 56,
            marginLeft: isMobile ? 4 : 8,
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          /
        </span>
      </div>
    );
  }

  const lines = item.label.split("\n");
  const cardW = isMobile ? 138 : 200;
  const cardH = isMobile ? 100 : 140;
  const labelSize = isMobile
    ? lines.length > 1 ? 18 : 22
    : lines.length > 1 ? 28 : 32;
  const isDarkCard = item.bg !== COLORS.yellowGreen && item.bg !== COLORS.lavender; // yellow-green & lavender are light bgs, rest are dark

  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      animate={{ scale: hov ? 1.04 : 1, rotate: hov ? -1 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        flexShrink: 0,
        width: cardW,
        height: cardH,
        background: item.bg,
        border: isDarkCard ? `1px solid ${item.accent}26` : "none", // 26 = ~15% opacity, matches each card's accent
        borderRadius: 4,
        padding: isMobile ? "10px 12px" : "14px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hov
          ? isDarkCard
            ? `0 8px 30px ${item.accent}1F` // glow color matches each card's accent
            : "0 8px 30px rgba(232,255,58,0.25)"
          : "none",
      }}
    >
      {/* grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      {/* label */}
      <div>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Black Han Sans', 'Arial Black', sans-serif",
              fontSize: labelSize,
              fontWeight: 900,
              color: item.color,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* footer */}
      <div className="flex justify-between items-end">
        <span
          style={{
            fontSize: isMobile ? 7 : 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: item.accent,
            opacity: 0.7,
            fontFamily: "monospace",
          }}
        >
          {item.sub}
        </span>
        <motion.div
          animate={{ x: hov ? 3 : 0, y: hov ? -3 : 0 }}
          style={{
            width: isMobile ? 18 : 22,
            height: isMobile ? 18 : 22,
            borderRadius: "50%",
            border: `1.5px solid ${item.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          <span style={{ color: item.accent, fontSize: isMobile ? 8 : 10, lineHeight: 1 }}>↗</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── main export ─── */
export default function ScrollMarqueeHero() {
  const { scrollY } = useScroll();

  return (
    <div
      className="h-auto"
      style={{ background: COLORS.bg, fontFamily: "'Helvetica Neue', sans-serif" }}
    >
      {/* ── sticky viewport ── */}
      <div className="sticky top-0 h-[260px] sm:h-[300px] overflow-hidden flex flex-col justify-center">
        {/* radial glow backdrop — swap rgba below to a different COLORS value for a different mood */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,255,58,0.06), transparent 70%)",
          }}
        />

        {/* scanlines */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
          }}
        />

        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: "inset 0 0 150px 40px rgba(0,0,0,0.7)",
          }}
        />

        {/* rows */}
        <div className="absolute inset-0 flex flex-col justify-center gap-[10px] sm:gap-[12px]">
          {ROWS.map((row) => (
            <MarqueeRow
              key={row.id}
              items={row.items}
              speed={row.speed}
              scrollY={scrollY}
            />
          ))}
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>
    </div>
  );
}