import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./preloader.css";

const NAME = "MOAZZAM PASHA";
const DECILE_EASE = [0.76, 0, 0.24, 1];

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.02, delayChildren: 0.3 }
  },
  exit: {
    transition: { staggerChildren: 0.015, staggerDirection: -1 }
  }
};

const charVariants = {
  initial: { y: "110%" },
  animate: { 
    y: 0, 
    transition: { duration: 0.8, ease: [0.215, 0.610, 0.355, 1] } 
  },
  exit: { 
    y: "110%", 
    transition: { duration: 0.5, ease: DECILE_EASE } 
  }
};

const blockVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.4, ease: "easeIn" } }
};

export default function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {loading && (
        <motion.div 
          className="preloader-canvas"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: DECILE_EASE, delay: 0.5 }}
        >
          {/* Centered Structural Core */}
          <div className="preloader-central-stack">
            
            {/* Top Anchor Label */}
            <motion.div 
              className="stack-eyebrow"
              variants={blockVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <span>PORTFOLIO</span>
              <span>©2026</span>
            </motion.div>

            {/* Main Name Core */}
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

            {/* Tight Progress Rule & Subtitle Block */}
            <div className="stack-footer">
              <motion.div 
                className="loading-track"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
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
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}