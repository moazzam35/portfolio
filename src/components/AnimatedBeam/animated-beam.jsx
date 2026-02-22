import React, { forwardRef, useRef } from "react"
import { cn } from "../../lib/utils"
import { AnimatedBeam } from "./AnimatedBeam"
import "./animated-beam.css"
import figma from "../../assets/tech/figma.1.png"
import person from "../../assets/tech/person.png"
import react from "../../assets/tech/react-1.png"
import bootstrap from "../../assets/tech/boostrap.png"
import next from "../../assets/tech/nextjs.png"
import github from "../../assets/tech/github.1.png"
import js from "../../assets/tech/js.png"

const Circle = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = "Circle"

export function AnimatedBeamMultipleOutputDemo({ className }) {
  const containerRef = useRef(null)
  const figmaRef = useRef(null)
  const personRef = useRef(null)
  const reactRef = useRef(null)
  const bootstrapRef = useRef(null)
  const nextRef = useRef(null)
  const githubRef = useRef(null)
  const jsRef = useRef(null)

  return (
    <div className="animated-beam-wrapper">
      <div className="animated-beam-section">
        
        {/* Header */}
        <div className="beam-header" data-aos="fade-up">
          <h2>
            Development <span className="gradient-text">Workflow</span>
          </h2>
          <p>From design to deployment - my complete tech stack</p>
        </div>

        {/* Beam Container */}
        <div className={cn("beam-container", className)} ref={containerRef}>
          <div className="beam-grid">
            
            {/* Input: Figma */}
            <div className="beam-column">
              <Circle ref={figmaRef} className="circle-figma">
                <img src={figma} alt="Figma" />
              </Circle>
            </div>

            {/* Center: Developer */}
            <div className="beam-column beam-column-center">
              <Circle ref={personRef} className="circle-person">
                <img src={person} alt="Developer" />
              </Circle>
            </div>

            {/* Output: Technologies */}
            <div className="beam-column beam-column-tech">
              <Circle ref={reactRef} className="circle-tech">
                <img src={react} alt="React" />
              </Circle>
              <Circle ref={bootstrapRef} className="circle-tech">
                <img src={bootstrap} alt="Bootstrap" />
              </Circle>
              <Circle ref={nextRef} className="circle-tech">
                <img src={next} alt="Next.js" />
              </Circle>
              <Circle ref={githubRef} className="circle-tech">
                <img src={github} alt="GitHub" />
              </Circle>
              <Circle ref={jsRef} className="circle-tech">
                <img src={js} alt="JavaScript" />
              </Circle>
            </div>
          </div>

          {/* Animated Beams */}
          
          {/* Input beam: Figma → Person */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={figmaRef}
            toRef={personRef}
            duration={2}
            gradientStartColor="#a78bfa"
            gradientStopColor="#ec4899"
          />

          {/* Output beams: Person → Technologies */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={personRef}
            toRef={reactRef}
            duration={2}
            gradientStartColor="#a78bfa"
            gradientStopColor="#ec4899"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={personRef}
            toRef={bootstrapRef}
            duration={2}
            gradientStartColor="#a78bfa"
            gradientStopColor="#ec4899"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={personRef}
            toRef={nextRef}
            duration={2}
            gradientStartColor="#a78bfa"
            gradientStopColor="#ec4899"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={personRef}
            toRef={githubRef}
            duration={2}
            gradientStartColor="#a78bfa"
            gradientStopColor="#ec4899"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={personRef}
            toRef={jsRef}
            duration={2}
            gradientStartColor="#a78bfa"
            gradientStopColor="#ec4899"
          />
        </div>
      </div>
    </div>
  )
}