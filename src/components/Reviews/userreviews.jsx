import { useState, useEffect, useRef, useMemo } from "react";
import "./usereviews.css";

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
  text = "", tag = "p", splitType = "chars", variant = "fadeUp",
  delay = 40, duration = 700, initialDelay = 0, threshold = 0.15,
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
    <Tag ref={containerRef} className={className} style={{ display: "inline", ...style }} aria-label={text}>
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


/* ─────────────────────────────────────
   DATA
───────────────────────────────────── */
const THREADS = [
  { id:1, name:"Ryan M.",  role:"Recruiter · TechBridge", avatar:"R", preview:"will drop the brief tonight 🤝", time:"2:17 PM",   unread:0, online:true,  active:true  },
  { id:2, name:"Sophie K.",role:"Design Lead · Halo",     avatar:"S", preview:"the animations look perfect",   time:"Yesterday", unread:2, online:false, active:false },
  { id:3, name:"David L.", role:"CTO · Quark Labs",       avatar:"D", preview:"let's schedule a call this week",time:"Mon",       unread:0, online:true,  active:false },
  { id:4, name:"Lena Kr.", role:"PM · Feral Studio",      avatar:"L", preview:"can you share the repo link?",  time:"Sun",       unread:0, online:false, active:false },
];

const MESSAGES = [
  { id:1, from:"them", text:"hey — just went through your portfolio. genuinely impressive work.",                                       time:"2:09 PM", gap:false },
  { id:2, from:"me",   text:"thanks a lot. been putting serious time into it this quarter.",                                            time:"2:10 PM", gap:false },
  { id:3, from:"them", text:"the case studies are unusually detailed. do you handle both design and engineering?",                      time:"2:11 PM", gap:false },
  { id:4, from:"me",   text:"yeah, end-to-end. design systems, frontend architecture, backend when needed.",                           time:"2:13 PM", gap:true  },
  { id:5, from:"them", text:"that's exactly what we need. 3-month contract — react + node, dashboard product.",                        time:"2:14 PM", gap:false },
  { id:6, from:"them", text:"would you be open to a conversation?",                                                                    time:"2:14 PM", gap:false },
  { id:7, from:"me",   text:"absolutely. what does the timeline look like on your end?",                                               time:"2:16 PM", gap:true  },
  { id:8, from:"them", text:"start mid-next month ideally. i'll send the brief over tonight 🤝",                                       time:"2:17 PM", gap:false },
];

const REVIEWS = [
  {
    id:1, name:"Mozzam pasha", role:"Founder · TechBridge", avatar:"M", stars:5,
    text:"Delivered the entire dashboard in two weeks with zero hand-holding. The code was clean, the communication was clear, and the output exceeded our original scope. Genuinely one of the best remote developers I've worked with.",
    date:"Feb 2025", platform:"LinkedIn", featured:true,
  },
  { id:2, name:"Lena Kr.",  role:"Product Manager · Feral Studio", avatar:"L", stars:5, text:"Picked up our design system and translated it into code with remarkable fidelity. The UI matched Figma pixel for pixel — which, in my experience, is genuinely rare.", date:"Dec 2024", platform:"Upwork"   },
  { id:3, name:"Arjun S.",  role:"CTO · Quark Labs",               avatar:"A", stars:5, text:"Responsive, reliable, never disappears mid-sprint. Clean code, smooth reviews, and the final product held up under load. Would hire again without hesitation.",             date:"Nov 2024", platform:"Direct"   },
  { id:4, name:"Sara T.",   role:"Senior Designer · Freelance",    avatar:"S", stars:4, text:"Collaborated on a client project — brought my designs to life exactly how I envisioned. Very detail-oriented, and genuinely easy to work alongside.",                       date:"Oct 2024", platform:"LinkedIn" },
  { id:5, name:"James W.",  role:"Lead Engineer · Orbit",          avatar:"J", stars:5, text:"Brought in mid-project to stabilise a broken codebase. Fixed it fast, added proper error handling, and stayed composed under pressure the whole time.",                     date:"Sep 2024", platform:"GitHub"   },
];

const BAR_DATA = [{ n:"5",pct:83 },{ n:"4",pct:12 },{ n:"3",pct:5 },{ n:"2",pct:0 },{ n:"1",pct:0 }];
const HOT_TAGS = ["fast delivery","clean code","good comms"];
const ALL_TAGS = [...HOT_TAGS,"detail-oriented","design eye"];


/* ─────────────────────────────────────
   CHAT VIEW
───────────────────────────────────── */
function ChatView() {
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    setTyping(false);
    const t1 = setTimeout(() => setTyping(true),  900);
    const t2 = setTimeout(() => setTyping(false), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [typing]);

  return (
    <div className="chat">
      {/* Sidebar */}
      <aside className="chat__sidebar">
        <div className="chat__sb-header">
          <span className="chat__sb-title">Messages</span>
          <div className="chat__sb-compose">+</div>
        </div>
        <div className="chat__sb-search"><input placeholder="Search conversations…" readOnly /></div>
        <div className="chat__sb-label">Recent</div>
        <div className="chat__threads">
          {THREADS.map(t => (
            <div key={t.id} className={`chat__thread${t.active ? " is-active" : ""}`}>
              <div className="chat__thread-av">
                {t.avatar}
                {t.online && <span className="chat__thread-online" />}
              </div>
              <div className="chat__thread-body">
                <div className="chat__thread-name">{t.name}</div>
                <div className="chat__thread-preview">{t.preview}</div>
              </div>
              <div className="chat__thread-meta">
                <span className="chat__thread-time">{t.time}</span>
                {t.unread > 0 && <span className="chat__thread-badge">{t.unread}</span>}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="chat__main">
        <div className="chat__topbar">
          <div className="chat__topbar-av">R<span className="chat__topbar-dot" /></div>
          <div className="chat__topbar-info">
            <div className="chat__topbar-name">Ryan M. · Recruiter</div>
            <div className="chat__topbar-status">Active now</div>
          </div>
          <div className="chat__topbar-btns">
            <div className="chat__topbar-btn">📞</div>
            <div className="chat__topbar-btn">⋯</div>
          </div>
        </div>

        <div className="chat__messages" ref={bodyRef}>
          <div className="chat__date-sep"><span>Today</span></div>
          {MESSAGES.map(m => (
            <div key={m.id} className={["chat__msg", m.from==="me" ? "chat__msg--me" : "chat__msg--them", m.gap ? "chat__msg--gap" : ""].join(" ")}>
              <div className="chat__bubble">{m.text}</div>
              <div className="chat__meta">
                <span>{m.time}</span>
                {m.from === "me" && <span className="chat__tick">✓✓</span>}
              </div>
            </div>
          ))}
          {typing && (
            <div className="chat__msg chat__msg--them chat__msg--gap">
              <div className="chat__typing">
                <span className="chat__typing-dot" />
                <span className="chat__typing-dot" />
                <span className="chat__typing-dot" />
              </div>
            </div>
          )}
        </div>

        <div className="chat__composer">
          <div className="chat__composer-btn">＋</div>
          <input className="chat__input" placeholder="Write a message…" readOnly />
          <div className="chat__send-btn">↑</div>
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────
   REVIEWS VIEW — SplitText on featured
───────────────────────────────────── */
function ReviewsView() {
  const featured = REVIEWS.find(r => r.featured);
  const rest     = REVIEWS.filter(r => !r.featured);

  return (
    <>
      {/* Stats bar */}
      <div className="rv__stats">
        <div className="rv__stat">
          <div className="rv__stat-label">Overall rating</div>
          {/* Big score number — pop, chars */}
          <div className="rv__stat-big">
            <SplitText
              text="4.9"
              tag="span"
              splitType="chars"
              variant="pop"
              delay={80}
              duration={600}
              initialDelay={100}
              threshold={0.1}
            />
            <sub>
              <SplitText
                text="/ 5"
                tag="span"
                splitType="chars"
                variant="fade"
                delay={60}
                duration={500}
                initialDelay={400}
                threshold={0.1}
              />
            </sub>
          </div>
          <div className="rv__stars-row">★★★★★</div>
        </div>

        <div className="rv__stat">
          <div className="rv__stat-label">Rating breakdown</div>
          <div className="rv__bars">
            {BAR_DATA.map(b => (
              <div key={b.n} className="rv__bar">
                <span className="rv__bar-n">{b.n}</span>
                <div className="rv__bar-track">
                  <div className="rv__bar-fill" style={{ width:`${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rv__stat">
          <div className="rv__stat-label">Total reviews</div>
          {/* Count — glitch, chars */}
          <div className="rv__stat-big">
            <SplitText
              text="24"
              tag="span"
              splitType="chars"
              variant="glitch"
              delay={100}
              duration={600}
              initialDelay={200}
              threshold={0.1}
            />
          </div>
          <div className="rv__stat-label" style={{ marginTop:2 }}>across 3 platforms</div>
        </div>

        <div className="rv__stat">
          <div className="rv__stat-label">Top mentions</div>
          <div className="rv__tags">
            {ALL_TAGS.map(t => (
              <span key={t} className={`rv__tag${HOT_TAGS.includes(t) ? " rv__tag--hi" : ""}`}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="rv__grid">

        {/* Featured review — quote uses blur + words */}
        <div className="rv__featured">
          <span className="rv__featured-deco" aria-hidden>"</span>
          <div className="rv__featured-top">
            <div className="rv__featured-chip">Featured review</div>
            <p className="rv__featured-quote">
              "
              <SplitText
                text={featured.text}
                tag="span"
                splitType="words"
                variant="blur"
                delay={28}
                duration={700}
                initialDelay={0}
                threshold={0.1}
              />
              "
            </p>
          </div>
          <div className="rv__featured-footer">
            <div className="rv__av-lg">{featured.avatar}</div>
            <div className="rv__av-info">
              {/* Name — fadeUp chars */}
              <div className="rv__av-name">
                <SplitText
                  text={featured.name}
                  tag="span"
                  splitType="chars"
                  variant="fadeUp"
                  delay={45}
                  duration={550}
                  initialDelay={200}
                  threshold={0.1}
                />
              </div>
              {/* Role — slideRight words */}
              <div className="rv__av-role">
                <SplitText
                  text={featured.role}
                  tag="span"
                  splitType="words"
                  variant="slideRight"
                  delay={50}
                  duration={500}
                  initialDelay={350}
                  threshold={0.1}
                />
              </div>
            </div>
            <div className="rv__av-right">
              <div className="rv__av-stars">{"★".repeat(featured.stars)}</div>
            </div>
          </div>
        </div>

        {/* Small cards — name glitch, body fade */}
        {rest.map((r, i) => (
          <div key={r.id} className="rv__card">
            <span className="rv__card-deco" aria-hidden>"</span>
            <div className="rv__card-top">
              <div className="rv__av-sm">{r.avatar}</div>
              <div className="rv__card-info">
                <div className="rv__card-name">
                  <SplitText
                    text={r.name}
                    tag="span"
                    splitType="chars"
                    variant="glitch"
                    delay={40}
                    duration={500}
                    initialDelay={i * 60}
                    threshold={0.1}
                  />
                </div>
                <div className="rv__card-role">
                  <SplitText
                    text={r.role}
                    tag="span"
                    splitType="words"
                    variant="slideRight"
                    delay={35}
                    duration={450}
                    initialDelay={i * 60 + 120}
                    threshold={0.1}
                  />
                </div>
              </div>
              <div className="rv__card-stars">{"★".repeat(r.stars)}</div>
            </div>

            <p className="rv__card-body">
              "
              <SplitText
                text={r.text}
                tag="span"
                splitType="words"
                variant="fade"
                delay={22}
                duration={600}
                initialDelay={i * 60 + 200}
                threshold={0.1}
              />
              "
            </p>

            <div className="rv__card-foot">
              <span className="rv__card-platform">{r.platform}</span>
              <span className="rv__verified">
                <span className="rv__verified-dot" />
                Verified
              </span>
            </div>
          </div>
        ))}

      </div>
    </>
  );
}


/* ─────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────── */
export default function PortfolioSection() {
  const [tab, setTab] = useState("chat");

  return (
    <div className="ps">

      {/* Hero — eyebrow fadeUp words, title rotateUp chars, italic pop chars, KPI glitch */}
      <header className="ps__hero">
        <div>
          {/* Eyebrow */}
          <p className="ps__hero-eyebrow">
            <SplitText
              text="Social proof"
              tag="span"
              splitType="words"
              variant="fadeUp"
              delay={70}
              duration={600}
              initialDelay={0}
              threshold={0.1}
            />
          </p>

          {/* "People I've" — rotateUp per char */}
          <h1 className="ps__hero-title">
            <SplitText
              text="People I've"
              tag="span"
              splitType="chars"
              variant="rotateUp"
              delay={55}
              duration={750}
              initialDelay={100}
              threshold={0.1}
            />{" "}
            {/* "worked" italic — pop per char, delayed */}
            <em>
              <SplitText
                text="worked"
                tag="span"
                splitType="chars"
                variant="pop"
                delay={50}
                duration={650}
                initialDelay={650}
                threshold={0.1}
              />
            </em>
            <br />
            {/* "with" — slideRight words, last to arrive */}
            <SplitText
              text="with"
              tag="span"
              splitType="chars"
              variant="fadeUp"
              delay={60}
              duration={600}
              initialDelay={900}
              threshold={0.1}
            />
          </h1>
        </div>

        {/* KPI block — glitch on the number, fade on label */}
        <div className="ps__hero-kpi">
          <div className="ps__hero-kpi-num">
            <SplitText
              text="4.9"
              tag="span"
              splitType="chars"
              variant="glitch"
              delay={80}
              duration={650}
              initialDelay={300}
              threshold={0.1}
            />
            <span className="ps__hero-kpi-star">★</span>
          </div>
          <div className="ps__hero-kpi-label">
            <SplitText
              text="average across 24 reviews"
              tag="span"
              splitType="words"
              variant="blur"
              delay={40}
              duration={600}
              initialDelay={600}
              threshold={0.1}
            />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="ps__nav">
        <button className={`ps__tab${tab==="chat"    ? " is-active" : ""}`} onClick={() => setTab("chat")}>
          Messages<span className="ps__tab-badge">8</span>
        </button>
        <button className={`ps__tab${tab==="reviews" ? " is-active" : ""}`} onClick={() => setTab("reviews")}>
          Reviews<span className="ps__tab-badge">24</span>
        </button>
      </nav>

      {/* Content */}
      <main className="ps__body">
        {tab === "chat"    && <ChatView />}
        {tab === "reviews" && <ReviewsView />}
      </main>

    </div>
  );
}