import { motion } from "framer-motion";
import TextType from "./Rewrite Text/TextType";

function Hero({ className = "" }) {
  return (
    <>
      <div
        className={`absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 sm:px-6 md:px-8 ${className}`}
        id="home"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
          style={{
            color: "#d4ff00",
            textShadow: "0 0 25px rgba(212,255,0,0.4)",
          }}
        >
          <TextType
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="|"
          text={[
  "Hello, I'm Moazzam Pasha",
  "Full Stack Developer & UI Engineer",
  "I Build Modern Web Experiences",
  "Next.js, React, Node.js & Express",
  "From Frontend to Backend",
   "Hello, I'm Moazzam Pasha",
  "Responsive. Scalable. Performance-Driven.",
  "Turning Ideas Into Digital Products",
  "Let's Build Something Amazing",
]}
            deletingSpeed={40}
            variableSpeedEnabled={false}
            variableSpeedMin={60}
            variableSpeedMax={120}
            cursorBlinkDuration={0.5}
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-medium"
        >
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-gray-300 w-full tracking-wide block"
          >
            Welcome to my portfolio
          </motion.span>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1" style={{ color: "#d4ff00" }}
        >
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="1" width="16" height="34" rx="8" />
            <motion.circle
              cx="12"
              cy="10"
              r="2"
              fill="currentColor"
              animate={{ cy: [10, 20, 10] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Hero;
