import { useEffect, useLayoutEffect, useMemo, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import worldImg from "../../assets/images/world.png";
import resizerImg from "../../assets/images/resizer.png";
import logoImg from "../../assets/images/logo.png";
import iconImg from "../../assets/images/icon.png";

/* ============================================================
   HeroBackground.jsx
   Simple, premium, developer-themed animated hero background.
   Visible opacity, each element randomly gets its own animation(s).
   ============================================================ */

const BG_COLOR = "#050505";

const BREAKPOINTS = { mobile: 640, tablet: 1024 };

const TOTAL_ELEMENTS = 22;
const TOTAL_CONNECTIONS = 5;

// Mobile: fewer elements, smaller grid
const MOBILE_ELEMENTS = 8;
const MOBILE_CONNECTIONS = 2;
const TABLET_ELEMENTS = 16;
const TABLET_CONNECTIONS = 3;

// Safe zone kept readable for hero text.
const CENTER_ZONE = { xMin: 30, xMax: 70, yMin: 34, yMax: 66 };

// Grid used to guarantee even coverage across the full canvas.
const GRID_COLS = 5;
const GRID_ROWS = 4;
const MOBILE_GRID_COLS = 3;
const MOBILE_GRID_ROWS = 3;

const ACCENT_COLORS = ["#7dd3fc", "#c4b5fd", "#6ee7b7", "#d4ff00", "#ffffff"];
const ACCENT_WEIGHTS = [0.2, 0.2, 0.18, 0.22, 0.2];

function pickAccent() {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < ACCENT_COLORS.length; i++) {
    acc += ACCENT_WEIGHTS[i];
    if (r < acc) return ACCENT_COLORS[i];
  }
  return "#ffffff";
}

const ELEMENT_TYPES = [
  { type: "angleBracket", size: [22, 32], weight: 2, connectable: false },
  { type: "curlyBrace", size: [22, 32], weight: 2, connectable: false },
  { type: "terminal", size: [80, 124], weight: 1, connectable: true, dashTrace: true, cursor: true },
  { type: "browser", size: [80, 124], weight: 2, connectable: true, dashTrace: true, scan: true },
  { type: "database", size: [34, 50], weight: 1, connectable: true },
  { type: "server", size: [34, 50], weight: 2, connectable: true, led: true },
  { type: "cloud", size: [34, 50], weight: 2, connectable: true },
  { type: "jsonCard", size: [66, 98], weight: 2, connectable: true, dashTrace: true },
  { type: "apiCard", size: [66, 98], weight: 2, connectable: true, dashTrace: true },
  { type: "reactBox", size: [44, 62], weight: 2, connectable: true },
  { type: "nodeHex", size: [30, 44], weight: 1, connectable: true, led: true },
  { type: "gitBranch", size: [28, 42], weight: 2, connectable: false },
  { type: "codeSnippet", size: [50, 80], weight: 2, connectable: false },
  { type: "terminalCmd", size: [60, 90], weight: 1, connectable: true, dashTrace: true },
  { type: "settingsGear", size: [28, 42], weight: 2, connectable: false },
  { type: "codeFile", size: [50, 70], weight: 2, connectable: false },
  { type: "npmPackage", size: [40, 60], weight: 2, connectable: false },
  { type: "imageIcon", size: [40, 60], weight: 2, connectable: false },
];

const LABEL_WORDS = ["GET /api", "async/await", "npm run dev", "git push", "200 OK", "useEffect", "console.log", "import React", "export default", "const arr ="];

// Full pool — each element randomly draws 1-2 of these for its idle motion.
const IDLE_ANIM_POOL = ["float", "rotateWiggle", "scaleBreath", "opacityBreath", "glowPulse"];

/* ---------------- helpers ---------------- */
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWeightedType() {
  const total = ELEMENT_TYPES.reduce((s, t) => s + t.weight, 0);
  let r = rand(0, total);
  for (const t of ELEMENT_TYPES) {
    if (r < t.weight) return t;
    r -= t.weight;
  }
  return ELEMENT_TYPES[0];
}

function isInsideCenter(x, y) {
  return x > CENTER_ZONE.xMin && x < CENTER_ZONE.xMax && y > CENTER_ZONE.yMin && y < CENTER_ZONE.yMax;
}

function buildGridCells(mobile = false) {
  const cols = mobile ? MOBILE_GRID_COLS : GRID_COLS;
  const rows = mobile ? MOBILE_GRID_ROWS : GRID_ROWS;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push({ col: c, row: r });
  }
  return shuffle(cells);
}

function positionInCell(cell, mobile = false) {
  const cols = mobile ? MOBILE_GRID_COLS : GRID_COLS;
  const rows = mobile ? MOBILE_GRID_ROWS : GRID_ROWS;
  const cellW = 100 / cols;
  const cellH = 100 / rows;
  const x = clamp(cell.col * cellW + rand(cellW * 0.2, cellW * 0.8), 3, 97);
  const y = clamp(cell.row * cellH + rand(cellH * 0.2, cellH * 0.8), 3, 97);
  return { x, y, inCenter: isInsideCenter(x, y) };
}

// Clearly visible ranges — nothing invisible-faint.
function layerProfile(inCenter) {
  if (inCenter) {
    return { opacity: rand(0.22, 0.3), blur: rand(1.5, 3), depth: rand(0.05, 0.14), sizeMul: 0.75, glow: rand(8, 14) };
  }
  const r = Math.random();
  if (r < 0.4) {
    return { opacity: rand(0.32, 0.42), blur: rand(0.5, 1.5), depth: rand(0.08, 0.2), sizeMul: 0.95, glow: rand(12, 18) };
  }
  return { opacity: rand(0.42, 0.58), blur: 0, depth: rand(0.25, 0.5), sizeMul: 1.05, glow: rand(16, 24) };
}

function directionFromPosition(x, y) {
  const dx = x - 50;
  const dy = y - 50;
  if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? "left" : "right";
  return dy < 0 ? "top" : "bottom";
}

function offsetForDirection(direction, magnitude) {
  switch (direction) {
    case "left": return { x: -magnitude, y: rand(-30, 30) };
    case "right": return { x: magnitude, y: rand(-30, 30) };
    case "top": return { x: rand(-30, 30), y: -magnitude };
    default: return { x: rand(-30, 30), y: magnitude };
  }
}

// Each element randomly gets 1 or 2 idle animations — no two elements
// necessarily move the same way.
function rollIdleAnimations() {
  const shuffled = shuffle(IDLE_ANIM_POOL);
  const n = randInt(1, 2);
  return shuffled.slice(0, n);
}

/* ---------------- generation ---------------- */

function generateElements(count, mobile = false) {
  const cells = buildGridCells(mobile);
  const elements = [];

  for (let i = 0; i < count; i++) {
    const cell = cells[i % cells.length];
    const { x, y, inCenter } = positionInCell(cell, mobile);

    const typeDef = pickWeightedType();
    const profile = layerProfile(inCenter);
    // On mobile, keep elements big but fewer
    const sizeMultiplier = mobile ? 0.9 : 1;
    const size = rand(typeDef.size[0], typeDef.size[1]) * profile.sizeMul * sizeMultiplier;
    const direction = directionFromPosition(x, y);
    const magnitude = mobile ? rand(80, 160) : rand(160, 320);
    const finalRotation = rand(-8, 8);

    elements.push({
      id: `el-${i}-${typeDef.type}`,
      type: typeDef.type,
      x, y, size,
      accent: pickAccent(),
      opacity: mobile ? profile.opacity * 1.1 : profile.opacity,
      blur: profile.blur,
      depth: profile.depth,
      glowStrength: profile.glow * (mobile ? 0.7 : 1),
      startOffset: offsetForDirection(direction, magnitude),
      startRotation: finalRotation + rand(-50, 50),
      finalRotation,
      label: typeDef.type === "floatLabel" ? pick(LABEL_WORDS) : null,
      connectable: typeDef.connectable,
      dashTrace: !!typeDef.dashTrace,
      hasScan: !!typeDef.scan,
      hasCursor: !!typeDef.cursor,
      hasLed: !!typeDef.led,
      hasBlink: !!typeDef.blink,
      entranceDelay: rand(0, 1),
      idleAnimations: rollIdleAnimations(),
      floatAmp: mobile ? rand(4, 10) : rand(8, 18),
      floatDur: rand(4, 8),
      rotateAmp: mobile ? rand(2, 5) : rand(3, 8),
      rotateDur: rand(5, 9),
      scaleAmp: rand(0.03, 0.07),
      scaleDur: rand(3.5, 6.5),
      opacityAmp: rand(0.08, 0.16),
      opacityDur: rand(3.5, 6),
      glowDur: rand(2.5, 4.5),
      idleDelay: rand(0, 2),
      traceDur: rand(4, 7),
      scanDur: rand(2.5, 4.5),
      blinkDur: rand(1, 2.2),
      // Mobile: show most elements, hide only high-depth ones
      visMobile: mobile ? (profile.depth < 0.35 || i % 2 === 0) : (profile.depth > 0.2 || i % 2 === 0),
      visTablet: profile.depth > 0.1 || i % 3 !== 2,
    });
  }
  return elements;
}

function generateConnectionPool(elements, count) {
  const pool = elements.filter((el) => el.connectable);
  if (pool.length < 2) return [];
  const connections = [];
  const used = new Set();
  let guard = 0;
  while (connections.length < count && guard < count * 25) {
    guard++;
    const a = pick(pool);
    const b = pick(pool);
    if (a.id === b.id) continue;
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (dist > 55 || dist < 8) continue;
    const key = [a.id, b.id].sort().join("::");
    if (used.has(key)) continue;
    used.add(key);
    connections.push({ id: `conn-${key}`, from: a, to: b, color: a.accent !== "#ffffff" ? a.accent : b.accent });
  }
  return connections;
}

/* ---------------- icons ---------------- */

const iconStroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

function CardShell({ w = 100, h = 68, dashTrace, children }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%">
      <rect
        x="1.5" y="1.5" width={w - 3} height={h - 3} rx="7"
        fill="none" stroke="currentColor" strokeWidth="1.3"
        strokeDasharray={dashTrace ? "7 5" : undefined}
        className={dashTrace ? "hb-border-trace" : undefined}
        opacity="0.95"
      />
      {children}
    </svg>
  );
}

function Icon({ type, label }) {
  switch (type) {
    case "angleBracket":
      return (
        <svg viewBox="0 0 40 40" width="100%" height="100%">
          <path d="M15 8 L5 20 L15 32" {...iconStroke} />
          <path d="M25 8 L35 20 L25 32" {...iconStroke} />
        </svg>
      );
    case "curlyBrace":
      return (
        <svg viewBox="0 0 40 40" width="100%" height="100%">
          <path d="M24 6c-4 0-5 2-5 6v4c0 3-1 4-4 4 3 0 4 1 4 4v4c0 4 1 6 5 6" {...iconStroke} />
        </svg>
      );
    case "terminal":
      return (
        <CardShell w={100} h="70" dashTrace>
          <line x1="1.5" y1="18" x2="98.5" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <circle cx="10" cy="10" r="1.8" fill="currentColor" />
          <circle cx="16" cy="10" r="1.8" fill="currentColor" />
          <circle cx="22" cy="10" r="1.8" fill="currentColor" />
          <path d="M12 30 L24 38 L12 46" {...iconStroke} />
          <line x1="30" y1="46" x2="52" y2="46" {...iconStroke} />
          <rect className="hb-cursor" x="56" y="42" width="6" height="8" fill="currentColor" />
        </CardShell>
      );
    case "browser":
      return (
        <CardShell w={100} h="68" dashTrace>
          <line x1="1.5" y1="16" x2="98.5" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <circle cx="10" cy="9" r="1.8" fill="currentColor" />
          <circle cx="16" cy="9" r="1.8" fill="currentColor" />
          <circle cx="22" cy="9" r="1.8" fill="currentColor" />
          <rect x="14" y="28" width="72" height="6" rx="2" {...iconStroke} opacity="0.8" />
          <rect x="14" y="42" width="46" height="6" rx="2" {...iconStroke} opacity="0.6" />
          <rect className="hb-scanline" x="0" y="20" width="100" height="2" fill="currentColor" opacity="0" />
        </CardShell>
      );
    case "database":
      return (
        <svg viewBox="0 0 44 52" width="100%" height="100%">
          <ellipse cx="22" cy="10" rx="20" ry="8" {...iconStroke} />
          <path d="M2 10v32c0 4.4 9 8 20 8s20-3.6 20-8V10" {...iconStroke} />
          <path d="M2 26c0 4.4 9 8 20 8s20-3.6 20-8" {...iconStroke} opacity="0.7" />
        </svg>
      );
    case "server":
      return (
        <svg viewBox="0 0 46 50" width="100%" height="100%">
          <rect x="3" y="3" width="40" height="14" rx="3" {...iconStroke} />
          <rect x="3" y="19" width="40" height="14" rx="3" {...iconStroke} />
          <rect x="3" y="35" width="40" height="12" rx="3" {...iconStroke} />
          <circle className="hb-led" cx="10" cy="10" r="1.8" fill="currentColor" />
          <circle className="hb-led" cx="10" cy="26" r="1.8" fill="currentColor" style={{ animationDelay: "0.4s" }} />
          <circle className="hb-led" cx="10" cy="41" r="1.8" fill="currentColor" style={{ animationDelay: "0.8s" }} />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 54 34" width="100%" height="100%">
          <path d="M15 28a10 10 0 0 1-1-19.9A12 12 0 0 1 37 8a9 9 0 0 1 2 17.8 4 4 0 0 1-1 .2H15Z" {...iconStroke} />
        </svg>
      );
    case "gitBranch":
      return (
        <svg viewBox="0 0 36 44" width="100%" height="100%">
          <circle cx="9" cy="8" r="3.2" {...iconStroke} />
          <circle cx="9" cy="36" r="3.2" {...iconStroke} />
          <circle cx="27" cy="20" r="3.2" {...iconStroke} />
          <path d="M9 11v22" {...iconStroke} />
          <path d="M9 14c0 8 8 3 18 6" {...iconStroke} />
        </svg>
      );
    case "jsonCard":
      return (
        <CardShell w={92} h="64" dashTrace>
          <text x="10" y="24" fontSize="9" fill="currentColor" opacity="0.9" fontFamily="monospace">{"{"}</text>
          <line x1="18" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
          <line x1="18" y1="40" x2="46" y2="40" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
          <text x="10" y="54" fontSize="9" fill="currentColor" opacity="0.9" fontFamily="monospace">{"}"}</text>
        </CardShell>
      );
    case "apiCard":
      return (
        <CardShell w={92} h="64" dashTrace>
          <text x="12" y="28" fontSize="11" fill="currentColor" opacity="0.95" fontFamily="monospace" letterSpacing="1">API</text>
          <line x1="12" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
          <line x1="12" y1="48" x2="50" y2="48" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        </CardShell>
      );
    case "reactBox":
      return (
        <svg viewBox="0 0 60 52" width="100%" height="100%">
          <ellipse cx="30" cy="26" rx="26" ry="10" {...iconStroke} />
          <ellipse cx="30" cy="26" rx="26" ry="10" {...iconStroke} transform="rotate(60 30 26)" />
          <ellipse cx="30" cy="26" rx="26" ry="10" {...iconStroke} transform="rotate(120 30 26)" />
          <circle cx="30" cy="26" r="3.6" fill="currentColor" />
        </svg>
      );
    case "nodeHex":
      return (
        <svg viewBox="0 0 40 44" width="100%" height="100%">
          <path d="M20 2 36 11.5V32.5L20 42 4 32.5V11.5Z" {...iconStroke} />
          <circle className="hb-led" cx="20" cy="22" r="2.6" fill="currentColor" />
        </svg>
      );
    case "packageBox":
      return (
        <svg viewBox="0 0 40 40" width="100%" height="100%">
          <path d="M20 2 37 11v18L20 38 3 29V11Z" {...iconStroke} />
          <path d="M3 11 20 20 37 11M20 20v18" {...iconStroke} opacity="0.7" />
        </svg>
      );
    case "codeSnippet":
      return (
        <CardShell w={80} h="50" dashTrace={false}>
          <text x="8" y="18" fontSize="7" fill="currentColor" opacity="0.9" fontFamily="monospace">const fn = () =&gt; {"{"}</text>
          <text x="12" y="28" fontSize="7" fill="currentColor" opacity="0.7" fontFamily="monospace">return data;</text>
          <text x="8" y="38" fontSize="7" fill="currentColor" opacity="0.9" fontFamily="monospace">{"}"}</text>
        </CardShell>
      );
    case "terminalCmd":
      return (
        <CardShell w={90} h="60" dashTrace>
          <text x="8" y="20" fontSize="8" fill="currentColor" opacity="0.9" fontFamily="monospace">$ npm install</text>
          <text x="8" y="34" fontSize="7" fill="currentColor" opacity="0.6" fontFamily="monospace">added 1247 packages</text>
          <text x="8" y="46" fontSize="8" fill="#6ee7b7" opacity="0.8" fontFamily="monospace">✓ done</text>
        </CardShell>
      );
    case "settingsGear":
      return (
        <svg viewBox="0 0 40 40" width="100%" height="100%">
          <circle cx="20" cy="20" r="6" {...iconStroke} />
          <path d="M20 2v4M20 34v4M2 20h4M34 20h4M7.5 7.5l2.8 2.8M29.7 29.7l2.8 2.8M32.5 7.5l-2.8 2.8M10.3 29.7l-2.8 2.8" {...iconStroke} />
        </svg>
      );
    case "codeFile":
      return (
        <CardShell w={70} h="50" dashTrace={false}>
          <text x="8" y="16" fontSize="7" fill="currentColor" opacity="0.9" fontFamily="monospace">index.tsx</text>
          <line x1="8" y1="22" x2="50" y2="22" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          <text x="8" y="32" fontSize="6" fill="currentColor" opacity="0.6" fontFamily="monospace">export default</text>
          <text x="8" y="40" fontSize="6" fill="currentColor" opacity="0.5" fontFamily="monospace">function App()</text>
        </CardShell>
      );
    case "npmPackage":
      return (
        <svg viewBox="0 0 50 50" width="100%" height="100%">
          <rect x="2" y="2" width="46" height="46" rx="6" {...iconStroke} />
          <text x="25" y="22" fontSize="8" fill="currentColor" opacity="0.9" fontFamily="monospace" textAnchor="middle">npm</text>
          <text x="25" y="34" fontSize="6" fill="currentColor" opacity="0.6" fontFamily="monospace" textAnchor="middle">v1.0.0</text>
        </svg>
      );
    case "imageIcon": {
      const images = [worldImg, resizerImg, logoImg, iconImg];
      const randomImg = images[Math.floor(Math.random() * images.length)];
      return (
        <div className="flex items-center justify-center opacity-40">
          <img src={randomImg} alt="" className="w-full h-full object-contain" style={{ filter: "brightness(0.7) contrast(1.2)" }} />
        </div>
      );
    }
    case "glowDot":
      return (
        <svg viewBox="0 0 10 10" width="100%" height="100%">
          <circle className="hb-blink" cx="5" cy="5" r="3.4" fill="currentColor" />
        </svg>
      );
    case "floatLabel":
      return (
        <div className="whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10px] tracking-wide backdrop-blur-sm" style={{ borderColor: "currentColor" }}>
          {label}
        </div>
      );
    default:
      return null;
  }
}
const MemoIcon = memo(Icon);

/* ---------------- single decorative element ---------------- */

function BackgroundElement({ el, reduceMotion, parallaxRef }) {
  const animRef = useRef(null);
  const scanRef = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion || !animRef.current) return undefined;
    const node = animRef.current;
    const glowColor = el.accent;

    const ctx = gsap.context(() => {
      gsap.set(node, {
        x: el.startOffset.x,
        y: el.startOffset.y,
        rotation: el.startRotation,
        scale: 0.5,
        opacity: 0,
      });

      const tl = gsap.timeline({ delay: el.entranceDelay });
      tl.to(node, {
        x: 0, y: 0, rotation: el.finalRotation, opacity: el.opacity, scale: 1,
        duration: rand(1.1, 1.5), ease: "power3.out",
      })
        .fromTo(node,
          { filter: `drop-shadow(0 0 0px ${glowColor}00)` },
          { filter: `drop-shadow(0 0 ${el.glowStrength}px ${glowColor}70)`, duration: 0.4, ease: "power2.out" },
          "-=0.3"
        )
        .to(node, { filter: `drop-shadow(0 0 ${el.glowStrength * 0.45}px ${glowColor}40)`, duration: 0.6, ease: "power2.in" })
        .call(() => attachIdle());

      // Random idle motion: each element independently owns whichever
      // 1-2 animations it was assigned, at its own randomized timing.
      function attachIdle() {
        const chosen = el.idleAnimations;

        if (chosen.includes("float")) {
          gsap.to(node, {
            y: `+=${el.floatAmp}`, duration: el.floatDur, ease: "sine.inOut",
            repeat: -1, yoyo: true, delay: el.idleDelay,
          });
        }
        if (chosen.includes("rotateWiggle")) {
          gsap.to(node, {
            rotation: `+=${el.rotateAmp}`, duration: el.rotateDur, ease: "sine.inOut",
            repeat: -1, yoyo: true, delay: el.idleDelay * 0.6,
          });
        }
        if (chosen.includes("scaleBreath")) {
          gsap.to(node, {
            scale: 1 + el.scaleAmp, duration: el.scaleDur, ease: "sine.inOut",
            repeat: -1, yoyo: true, delay: el.idleDelay * 0.3,
          });
        }
        if (chosen.includes("opacityBreath")) {
          gsap.to(node, {
            opacity: clamp(el.opacity + el.opacityAmp, 0.1, 0.75),
            duration: el.opacityDur, ease: "sine.inOut",
            repeat: -1, yoyo: true, delay: el.idleDelay * 0.5,
          });
        }
        if (chosen.includes("glowPulse")) {
          gsap.to(node, {
            filter: `drop-shadow(0 0 ${el.glowStrength}px ${glowColor}90)`,
            duration: el.glowDur, ease: "sine.inOut",
            repeat: -1, yoyo: true, delay: el.idleDelay * 0.8,
          });
        }
      }
    }, node);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // Independent scanning line for terminal/browser types.
  useLayoutEffect(() => {
    if (reduceMotion || !el.hasScan || !scanRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        scanRef.current,
        { y: 0, opacity: 0 },
        {
          y: el.size * 0.5, opacity: 0.5, duration: el.scanDur, ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: el.entranceDelay + 1.2,
        }
      );
    }, scanRef.current);
    return () => ctx.revert();
  }, [reduceMotion, el]);

  const sizeStyle = { width: el.size, height: el.size };
  const isLabel = el.type === "floatLabel";

  return (
    <div
      ref={parallaxRef}
      className="absolute will-change-transform"
      style={{ left: `${el.x}%`, top: `${el.y}%`, transform: "translate(-50%, -50%)" }}
      data-depth={el.depth}
      data-vis-mobile={el.visMobile ? "1" : "0"}
      data-vis-tablet={el.visTablet ? "1" : "0"}
    >
      <div
        ref={reduceMotion ? null : animRef}
        style={{
          ...(isLabel ? {} : sizeStyle),
          opacity: reduceMotion ? el.opacity : undefined,
          filter: reduceMotion
            ? `blur(${el.blur}px) drop-shadow(0 0 ${el.glowStrength * 0.5}px ${el.accent}50)`
            : undefined,
          color: el.accent,
          "--hb-trace-dur": `${el.traceDur}s`,
          "--hb-blink-dur": `${el.blinkDur}s`,
          "--hb-led-dur": `${rand(1.4, 2.6)}s`,
        }}
        className="relative"
      >
        <MemoIcon type={el.type} label={el.label} />
        {el.hasScan && (
          <div
            ref={scanRef}
            className="pointer-events-none absolute left-0 top-0 h-[7%] w-full"
            style={{ background: `linear-gradient(to bottom, transparent, ${el.accent}, transparent)` }}
          />
        )}
      </div>
    </div>
  );
}
const MemoBackgroundElement = memo(BackgroundElement);

/* ---------------- connection lines ---------------- */

function ConnectionPath({ conn }) {
  const pathRef = useRef(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return undefined;
    const length = path.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
      gsap.timeline()
        .to(path, { strokeDashoffset: 0, opacity: 0.5, duration: rand(1.2, 1.8), ease: "power2.out" })
        .to(path, { opacity: 0.2, duration: rand(2.5, 3.5), repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, path);
    return () => ctx.revert();
  }, []);

  return (
    <motion.path
      ref={pathRef}
      d={`M ${conn.from.x} ${conn.from.y} L ${conn.to.x} ${conn.to.y}`}
      stroke={conn.color}
      strokeWidth="0.18"
      fill="none"
      vectorEffect="non-scaling-stroke"
      initial={{ opacity: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    />
  );
}

function ConnectionLines({ pool, count, reduceMotion }) {
  const [active, setActive] = useState(() => pool.slice(0, count));

  useEffect(() => { setActive(pool.slice(0, count)); }, [pool, count]);

  useEffect(() => {
    if (reduceMotion || pool.length <= count) return undefined;
    const interval = setInterval(() => {
      setActive((prev) => {
        const next = [...prev];
        const idx = randInt(0, next.length - 1);
        const candidates = pool.filter((c) => !next.some((p) => p.id === c.id));
        if (candidates.length === 0) return prev;
        next[idx] = pick(candidates);
        return next;
      });
    }, rand(5000, 8000));
    return () => clearInterval(interval);
  }, [pool, count, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <AnimatePresence>
        {active.map((conn) => (
          <ConnectionPath key={conn.id} conn={conn} />
        ))}
      </AnimatePresence>
    </svg>
  );
}

/* ---------------- reduced motion hook ---------------- */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ---------------- mouse parallax (rAF, transform-only) ---------------- */

function useMouseParallax(containerRef, nodesMapRef, reduceMotion) {
  useEffect(() => {
    if (reduceMotion) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const MAX_MOVE = 16;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, rafId = null;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = relX * 2;
      targetY = relY * 2;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      nodesMapRef.current.forEach((node) => {
        if (!node) return;
        const depth = parseFloat(node.dataset.depth || "0.2");
        const moveX = currentX * MAX_MOVE * depth;
        const moveY = currentY * MAX_MOVE * depth;
        node.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
      });
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef, nodesMapRef, reduceMotion]);
}

/* ---------------- main component ---------------- */

export default function HeroBackground() {
  const reduceMotion = usePrefersReducedMotion();

  const containerRef = useRef(null);
  const parallaxNodesRef = useRef(new Map());
  const mouseRef = useRef({ x: 50, y: 50 });
  const spotlightRef = useRef(null);
  const rippleContainerRef = useRef(null);

  // Detect mobile/tablet - use actual device width, not viewport
  const getDeviceWidth = () => {
    if (typeof window === "undefined") return 1024;
    // Use screen.width which reports actual device width regardless of desktop mode
    return Math.min(window.innerWidth, screen.width);
  };

  const [isMobile, setIsMobile] = useState(() => getDeviceWidth() < BREAKPOINTS.mobile);
  const [isTablet, setIsTablet] = useState(() => {
    const w = getDeviceWidth();
    return w >= BREAKPOINTS.mobile && w < BREAKPOINTS.tablet;
  });

  useEffect(() => {
    const handleResize = () => {
      const w = getDeviceWidth();
      setIsMobile(w < BREAKPOINTS.mobile);
      setIsTablet(w >= BREAKPOINTS.mobile && w < BREAKPOINTS.tablet);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate appropriate number of elements based on screen size
  const elementCount = isMobile ? MOBILE_ELEMENTS : isTablet ? TABLET_ELEMENTS : TOTAL_ELEMENTS;
  const connectionCount = isMobile ? MOBILE_CONNECTIONS : isTablet ? TABLET_CONNECTIONS : TOTAL_CONNECTIONS;

  const elements = useMemo(() => generateElements(elementCount, isMobile), [elementCount, isMobile]);
  const connectionPool = useMemo(
    () => generateConnectionPool(elements, connectionCount * 3),
    [elements, connectionCount]
  );

  useMouseParallax(containerRef, parallaxNodesRef, reduceMotion);

  const [bgVisible, setBgVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setBgVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Mouse spotlight effect
  useEffect(() => {
    if (reduceMotion) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(35% 35% at ${mouseRef.current.x}% ${mouseRef.current.y}%, rgba(212,255,0,0.08) 0%, rgba(125,211,252,0.03) 40%, rgba(0,0,0,0) 70%)`;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reduceMotion]);

  // Click ripple effect
  useEffect(() => {
    if (reduceMotion) return undefined;
    const container = containerRef.current;
    const rippleContainer = rippleContainerRef.current;
    if (!container || !rippleContainer) return undefined;

    const createRipple = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("div");
      ripple.className = "hb-click-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      rippleContainer.appendChild(ripple);

      setTimeout(() => ripple.remove(), 1200);
    };

    container.addEventListener("click", createRipple);
    return () => container.removeEventListener("click", createRipple);
  }, [reduceMotion]);

  const setParallaxRef = (id) => (node) => {
    if (node) parallaxNodesRef.current.set(id, node);
    else parallaxNodesRef.current.delete(id);
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[1400ms] ease-out"
      style={{ backgroundColor: BG_COLOR, opacity: bgVisible ? 1 : 0 }}
    >
      <style>{`
        .hb-border-trace {
          animation: hb-dash-move var(--hb-trace-dur, 5s) linear infinite;
        }
        @keyframes hb-dash-move {
          to { stroke-dashoffset: -120; }
        }
        .hb-cursor {
          animation: hb-cursor-blink var(--hb-blink-dur, 1s) steps(1) infinite;
        }
        @keyframes hb-cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .hb-led {
          animation: hb-led-flicker var(--hb-led-dur, 2s) ease-in-out infinite;
        }
        @keyframes hb-led-flicker {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .hb-blink {
          animation: hb-blink-op var(--hb-blink-dur, 1.6s) ease-in-out infinite;
        }
        @keyframes hb-blink-op {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
        .hb-click-ripple {
          position: absolute;
          width: 0;
          height: 0;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: hb-ripple-expand 1.2s ease-out forwards;
        }
        .hb-click-ripple::before,
        .hb-click-ripple::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid;
          animation: hb-ripple-ring 1.2s ease-out forwards;
        }
        .hb-click-ripple::before {
          border-color: rgba(212, 255, 0, 0.5);
          animation-delay: 0s;
        }
        .hb-click-ripple::after {
          border-color: rgba(125, 211, 252, 0.4);
          animation-delay: 0.15s;
        }
        @keyframes hb-ripple-expand {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
            background: radial-gradient(circle, rgba(212,255,0,0.15) 0%, rgba(212,255,0,0) 70%);
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
            background: radial-gradient(circle, rgba(212,255,0,0) 0%, rgba(0,0,0,0) 70%);
          }
        }
        @keyframes hb-ripple-ring {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
        @media (max-width: 640px) {
          [data-vis-mobile="0"] { display: none; }
          .hb-click-ripple::before,
          .hb-click-ripple::after {
            width: 150px !important;
            height: 150px !important;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          [data-vis-tablet="0"] { display: none; }
        }
      `}</style>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: isMobile ? "40px 40px" : "60px 60px",
        }}
      />

      {/* Soft corner lights */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(45% 38% at 22% 24%, rgba(125,211,252,0.06) 0%, rgba(0,0,0,0) 70%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(45% 38% at 78% 76%, rgba(196,181,253,0.05) 0%, rgba(0,0,0,0) 70%)" }}
      />

      {/* Mouse-following spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: "radial-gradient(35% 35% at 50% 50%, rgba(212,255,0,0.08) 0%, rgba(125,211,252,0.03) 40%, rgba(0,0,0,0) 70%)" }}
      />

      {/* Click ripple container */}
      <div ref={rippleContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

      {/* Simple vignette */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 200px 50px rgba(0,0,0,0.8)" }}
      />

      <ConnectionLines pool={connectionPool} count={connectionCount} reduceMotion={reduceMotion} />

      {elements.map((el) => (
        <MemoBackgroundElement
          key={el.id}
          el={el}
          reduceMotion={reduceMotion}
          parallaxRef={setParallaxRef(el.id)}
        />
      ))}
    </div>
  );
}