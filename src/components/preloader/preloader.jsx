import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import "./preloader.css";

const NAME = "MOAZZAM PASHA";
const DECILE_EASE = [0.76, 0, 0.24, 1];

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 }
  },
  exit: {
    transition: { staggerChildren: 0.012 }
  }
};

const charVariants = {
  initial: { y: "110%", opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.215, 0.610, 0.355, 1] }
  },
  exit: {
    y: "110%",
    opacity: 0,
    transition: { duration: 0.4, ease: DECILE_EASE }
  }
};

const blockVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } },
  exit: { opacity: 0, y: 14, transition: { duration: 0.3, ease: "easeIn" } }
};

export default function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);
  const progress = useMotionValue(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.round(v))
    });

    const timer = setTimeout(() => setLoading(false), 2000);
    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {loading && (
        <motion.div
          className="preloader-canvas"
          initial={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.7, ease: DECILE_EASE, delay: 0.35 }}
        >
          <div className="preloader-central-stack">

            <motion.div
              className="stack-eyebrow"
              variants={blockVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <span>PORTFOLIO</span>
              <span>&copy;2026</span>
            </motion.div>

            <div className="stack-hero">
              <motion.h1
                className="display-name"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {[...NAME].map((char, i) => (
                  <span key={i} className="mask-box">
                    <motion.span variants={charVariants} className="glyph">
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>
            </div>

            <div className="stack-footer">
              <div className="progress-row">
                <div className="loading-track" />
                <motion.div
                  className="loading-fill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.1, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <div className="ftr-bottom">
                <motion.div
                  className="ftr-meta"
                  variants={blockVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <span>CREATIVE DEVELOPER</span>
                  <span>PUNJAB, PK</span>
                </motion.div>

                <motion.div
                  className="counter-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <span className="counter-value">{String(count).padStart(3, "0")}</span>
                  <span className="counter-label">%</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
