import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiStar, FiCheckCircle } from "react-icons/fi";
import "./reviews.css";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    id: 1,
    name: "Moazzam Pasha",
    role: "Founder · TechBridge",
    avatar: "M",
    stars: 5,
    text: "Delivered the entire dashboard in two weeks with zero hand-holding. The code was clean, the communication was clear, and the output exceeded our original scope. Genuinely one of the best remote developers I've worked with.",
    date: "Feb 2025",
    platform: "LinkedIn",
    verified: true,
  },
  {
    id: 2,
    name: "Lena Krieger",
    role: "Product Manager · Feral Studio",
    avatar: "L",
    stars: 5,
    text: "Picked up our design system and translated it into code with remarkable fidelity. The UI matched Figma pixel for pixel — which, in my experience, is genuinely rare. Would absolutely work together again.",
    date: "Dec 2024",
    platform: "Upwork",
    verified: true,
  },
  {
    id: 3,
    name: "Arjun Sharma",
    role: "CTO · Quark Labs",
    avatar: "A",
    stars: 5,
    text: "Responsive, reliable, never disappears mid-sprint. Clean code, smooth reviews, and the final product held up under load. Would hire again without hesitation.",
    date: "Nov 2024",
    platform: "Direct",
    verified: true,
  },
  {
    id: 4,
    name: "Sara Thompson",
    role: "Senior Designer · Freelance",
    avatar: "S",
    stars: 5,
    text: "Collaborated on a client project — brought my designs to life exactly how I envisioned. Very detail-oriented, and genuinely easy to work alongside. A true craftsperson.",
    date: "Oct 2024",
    platform: "LinkedIn",
    verified: false,
  },
  {
    id: 5,
    name: "James Walker",
    role: "Lead Engineer · Orbit",
    avatar: "J",
    stars: 5,
    text: "Brought in mid-project to stabilise a broken codebase. Fixed it fast, added proper error handling, and stayed composed under pressure the whole time. Exceptional under fire.",
    date: "Sep 2024",
    platform: "GitHub",
    verified: true,
  },
  {
    id: 6,
    name: "David Lee",
    role: "CEO · StartupGrid",
    avatar: "D",
    stars: 5,
    text: "From concept to deployment in under a month. The performance scores were through the roof and the client was thrilled. Moazzam's full-stack capability is the real deal.",
    date: "Aug 2024",
    platform: "Upwork",
    verified: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function Stars({ count }) {
  return (
    <div className="rv-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <FiStar key={i} size={13} className={i < count ? "rv-star-fill" : "rv-star-empty"} />
      ))}
    </div>
  );
}

function TestimonialCard({ t, index }) {
  return (
    <motion.div
      className="rv-card"
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -4, rotate: 0.3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="rv-card-quote">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7.05V4a9.93 9.93 0 00-8 9.5V20h8v-8H5.5A7.94 7.94 0 0111 7.05zm13 0V4a9.93 9.93 0 00-8 9.5V20h8v-8h-5.5A7.94 7.94 0 0124 7.05z"/></svg>
      </div>

      <p className="rv-card-text">{t.text}</p>

      <div className="rv-card-footer">
        <div className="rv-card-author">
          <div className="rv-card-avatar">{t.avatar}</div>
          <div>
            <div className="rv-card-name">
              {t.name}
              {t.verified && (
                <FiCheckCircle size={13} className="rv-verified-icon" />
              )}
            </div>
            <div className="rv-card-role">{t.role}</div>
          </div>
        </div>
        <div className="rv-card-meta">
          <Stars count={t.stars} />
          <span className="rv-card-date">{t.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function UseReviews() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".rv-sec-label", {
        scrollTrigger: { trigger: ".rv-sec-label", start: "top 85%" },
        opacity: 0,
        x: -20,
        duration: 0.6,
      });
      gsap.from(".rv-sec-heading", {
        scrollTrigger: { trigger: ".rv-sec-heading", start: "top 85%" },
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.15,
      });
      gsap.from(".rv-sec-desc", {
        scrollTrigger: { trigger: ".rv-sec-desc", start: "top 85%" },
        opacity: 0,
        y: 16,
        duration: 0.6,
        delay: 0.3,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="rv-section" id="reviews" ref={sectionRef}>
      <div className="rv-glow-1" />
      <div className="rv-glow-2" />

      <div className="rv-inner">
        {/* ── Header ── */}
        <div className="rv-header">
          <div className="rv-sec-label">
            <FiStar size={14} />
            <span>Testimonials</span>
          </div>
          <h2 className="rv-sec-heading">
            What People <span className="rv-accent">Say</span>
          </h2>
          <p className="rv-sec-desc">
            Feedback from clients and collaborators I&apos;ve had the pleasure of
            working with on real-world projects.
          </p>
        </div>

        {/* ── Auto-scrolling carousel ── */}
        <div className="rv-carousel-wrap">
          <div className="rv-fade-left" />
          <div className="rv-fade-right" />

          <div className="rv-carousel" ref={trackRef}>
            <div className="rv-track">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <TestimonialCard key={`${t.id}-${i}`} t={t} index={i % TESTIMONIALS.length} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom stats ── */}
        <motion.div
          className="rv-bottom-stats"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          {[
            { num: "4.9", label: "Average Rating" },
            { num: "24+", label: "Total Reviews" },
            { num: "100%", label: "Satisfaction" },
          ].map((s) => (
            <motion.div key={s.label} className="rv-bottom-stat" variants={fadeUp}>
              <div className="rv-bottom-num">{s.num}</div>
              <div className="rv-bottom-label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
