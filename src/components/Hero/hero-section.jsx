import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import TextType from "./Rewrite Text/TextType";

export default function Hero({ className = "" }) {
  const h1Ref = useRef(null);
  const pRef = useRef(null);
  const welcomeRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollInnerRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(h1Ref.current, {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.from(pRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out",
      });
      gsap.to(welcomeRef.current, {
        opacity: [0.6, 1, 0.6],
        duration: 3,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(scrollInnerRef.current, {
        y: 8,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(dotRef.current, {
        attr: { cy: 20 },
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(scrollRef.current, {
        opacity: 1,
        delay: 1.5,
        duration: 1,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        className={`absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 sm:px-6 md:px-8 ${className}`}
        id="home"
      >
        <h1
          ref={h1Ref}
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
        </h1>

        <p
          ref={pRef}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-medium"
        >
          <span
            ref={welcomeRef}
            className="text-gray-300 w-full tracking-wide block"
          >
            Welcome to my portfolio
          </span>
        </p>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0"
      >
        <div
          ref={scrollInnerRef}
          className="flex flex-col items-center gap-1"
          style={{ color: "#d4ff00" }}
        >
          <svg width="24" height="36" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="1" width="16" height="34" rx="8" />
            <circle
              ref={dotRef}
              cx="12"
              cy="10"
              r="2"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
