import { motion } from "framer-motion";
import DecryptedText from "../text-decrypt/DecryptedText";
import TextType from "./Rewrite Text/TextType";

function Hero({ className = "" }) {
  return (
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
            "Hello, My name is Moazzam Pasha",
            "Full Stack Developer & UI Engineer",
            "MongoDB, Neon PostgreSQL & SQL",
            "Next.js, Node.js & Express",
            "Frontend, Backend & Everything Between",
            "Turning ideas into interactive designs",
            "Responsive & performance-focused",
            "Let's build something amazing",
          ]}
          deletingSpeed={40}
          variableSpeedEnabled={false}
          variableSpeedMin={60}
          variableSpeedMax={120}
          cursorBlinkDuration={0.5}
        />
      </motion.h1>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-medium"
      >
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-gray-300 w-full tracking-wide"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          Welcome to my portfolio
        </motion.div>
      </motion.h1>
    </div>
  );
}

export default Hero;