import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img from "../../assets/images/about-me.png";
import { FaFileDownload } from "react-icons/fa";
import {
  FiCode,
  FiLayers,
  FiServer,
  FiDatabase,
  FiMapPin,
  FiZap,
  FiBriefcase,
  FiMonitor,
  FiGlobe,
  FiCheckCircle,
} from "react-icons/fi";
import "./about.css";

gsap.registerPlugin(ScrollTrigger);

const INFO_CARDS = [
  { icon: FiBriefcase, label: "Role", value: "Full Stack MERN Developer" },
  { icon: FiCode, label: "Experience", value: "2+ Years Building Web Apps" },
  { icon: FiMonitor, label: "Education", value: "BS Information Technology" },
  { icon: FiZap, label: "Current Focus", value: "Scalable Products & UI/UX" },
  { icon: FiMapPin, label: "Location", value: "Pakistan" },
  { icon: FiGlobe, label: "Availability", value: "Open to Opportunities" },
];

const STATS = [
  { icon: FiLayers, value: 10, suffix: "+", label: "Projects Completed" },
  { icon: FiCode, value: 10, suffix: "+", label: "Technologies" },
  { icon: FiMonitor, value: 100, suffix: "%", label: "Responsive Designs" },
  { icon: FiServer, value: 14, suffix: "+", label: "APIs Integrated" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function CounterStat({ icon: Icon, value, suffix, label, inView }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        current = Math.round(obj.val);
        setCount(current);
      },
    });
    return () => gsap.killTweensOf(obj);
  }, [inView, value]);

  return (
    <motion.div variants={fadeUp} className="ab-stat">
      <div className="ab-stat-icon">
        <Icon size={18} />
      </div>
      <div className="ab-stat-num">
        {count}
        {suffix}
      </div>
      <div className="ab-stat-label">{label}</div>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const imageWrapRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".ab-img-float", {
        y: -12,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="ab-section" id="about" ref={sectionRef}>
      {/* Background glow */}
      <div className="ab-glow ab-glow-1" />
      <div className="ab-glow ab-glow-2" />

      <div className="ab-container">
        {/* ── LEFT COLUMN ── */}
        <motion.div
          className="ab-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div className="ab-img-wrap" ref={imageWrapRef} variants={fadeUp}>
            <div className="ab-img-glow" />
            <div className="ab-img-float">
              <img src={img} alt="Moazzam Pasha" className="ab-img" />
            </div>
            <div className="ab-img-border" />
          </motion.div>

          <motion.a
            href={`${import.meta.env.BASE_URL}Resume.pdf`}
            download="Moazzam_pasha_Resume.pdf"
            className="ab-cv-btn"
            variants={fadeUp}
            custom={1}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaFileDownload size={16} />
            <span>Download CV</span>
          </motion.a>
        </motion.div>

        {/* ── RIGHT COLUMN ── */}
        <div className="ab-right">
          {/* Label */}
          <motion.div
            className="ab-label"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <FiCode size={14} />
            <span>About Me</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="ab-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            Crafting Digital Experiences{" "}
            <span className="ab-heading-accent">That Matter</span>
          </motion.h2>

          {/* Bio */}
          <motion.p
            className="ab-bio"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            I&apos;m a full stack developer who transforms ideas into clean, modern,
            and high-performance web applications. I focus on building fast,
            accessible, and visually engaging interfaces that deliver real value
            and leave a lasting impression.
          </motion.p>

          {/* Keywords */}
          <motion.div
            className="ab-keywords"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
          >
            {["React", "Next.js", "Node.js", "MongoDB", "TypeScript", "REST APIs"].map(
              (kw) => (
                <span key={kw} className="ab-kw">
                  {kw}
                </span>
              )
            )}
          </motion.div>

          {/* Info Cards */}
          <motion.div
            className="ab-cards"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            {INFO_CARDS.map((card, i) => (
              <motion.div key={card.label} className="ab-card" variants={fadeUp} custom={i * 0.5}>
                <div className="ab-card-icon">
                  <card.icon size={16} />
                </div>
                <div>
                  <div className="ab-card-label">{card.label}</div>
                  <div className="ab-card-value">{card.value}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="ab-stats"
            ref={statsRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            {STATS.map((s) => (
              <CounterStat key={s.label} {...s} inView={statsInView} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
