import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./preloader.css";

export default function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // duration of preloader

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && onComplete) {
      onComplete();
    }
  }, [loading, onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
          >
            Welcome to my portfolio
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}