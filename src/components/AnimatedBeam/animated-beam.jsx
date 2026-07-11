import { forwardRef, useRef } from "react"
import { cn } from "../../lib/utils"
import { AnimatedBeam } from "./AnimatedBeam"
import "./animated-beam.css"
import figma from "../../assets/tech/figma.1.png"
import person from "../../assets/tech/person.png"
import js from "../../assets/tech/js.png"
import node from "../../assets/tech/node.png"
import mongodb from "../../assets/tech/mongodb.png"
import next from "../../assets/tech/nextjs.jpg"
import typescript from "../../assets/tech/typescript.png"
import SplitText from "../About/Split Text/SplitText"
import TextType from "../Hero/Rewrite Text/TextType"

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
  const jsRef = useRef(null)
  const nodeRef = useRef(null)
  const mongodbRef = useRef(null)
  const nextRef = useRef(null)
  const typescriptRef = useRef(null)

  return (
    <div className="animated-beam-wrapper">
      <div className="animated-beam-section">
        
        {/* Header */}
        <div className="beam-header" data-aos="fade-up">
         <TextType className="split-text" text={["Where Ideas Become Interfaces", "End-to-End Development" , "Where Vision Meets Code" , "Designed to Feel, Built to Perform" ]} />
          <SplitText
            text="From design to deployment - my complete tech stack"
            tag="p"
          />
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
              <Circle ref={jsRef} className="circle-tech">
                <img src={js} alt="JavaScript" />
              </Circle>
              <Circle ref={nodeRef} className="circle-tech">
                <img src={node} alt="Node.js" />
              </Circle>
              <Circle ref={mongodbRef} className="circle-tech">
                <img src={mongodb} alt="MongoDB" />
              </Circle>
              <Circle ref={nextRef} className="circle-tech">
                <img src={next} alt="Next.js" />
              </Circle>
              <Circle ref={typescriptRef} className="circle-tech">
                <img src={typescript} alt="TypeScript" />
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
            toRef={jsRef}
            duration={2}
            gradientStartColor="#a78bfa"
            gradientStopColor="#ec4899"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={personRef}
            toRef={nodeRef}
            duration={2}
            gradientStartColor="#a78bfa"
            gradientStopColor="#ec4899"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={personRef}
            toRef={mongodbRef}
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
            toRef={typescriptRef}
            duration={2}
            gradientStartColor="#a78bfa"
            gradientStopColor="#ec4899"
          />
        </div>
      </div>
    </div>
  )
}