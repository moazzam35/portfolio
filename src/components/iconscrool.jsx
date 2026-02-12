import React, { useEffect } from "react";
import AOS from "aos";

// Import your tech stack images
import htmlImg from "../assets/tech/html.png";
import cssImg from "../assets/tech/css.png";
import jsImg from "../assets/tech/js.png";
import tsImg from "../assets/tech/typescript.png";
import reactImg from "../assets/tech/react.png";
import nextImg from "../assets/tech/nextjs.jpg";
import gitImg from "../assets/tech/git.png";
import githubImg from "../assets/tech/github.png";
import postmanImg from "../assets/tech/postman.png";
import supabaseImg from "../assets/tech/supabase.png";
import appwriteImg from "../assets/tech/appwrite.png";
import figmaImg from "../assets/tech/figma.png";
import boostrap from "../assets/tech/boostrap.png";
import  mongodb from "../assets/tech/mongodb.png";
import  Vs from "../assets/tech/Vscode.png";

import "aos/dist/aos.css";


function InfiniteScroll() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const techStack = [
    { name: "HTML", image: htmlImg, color: "#E34F26" },
    { name: "CSS", image: cssImg, color: "#1572B6" },
    { name: "JavaScript", image: jsImg, color: "#F7DF1E" },
    { name: "TypeScript", image: tsImg, color: "#3178C6" },
    { name: "React", image: reactImg, color: "#61DAFB" },
    { name: "Next.js", image: nextImg, color: "#000000" },
    { name: "Git", image: gitImg, color: "#F05032" },
    { name: "GitHub", image: githubImg, color: "#181717" },
    { name: "Postman", image: postmanImg, color: "#FF6C37" },
    { name: "Supabase", image: supabaseImg, color: "#3ECF8E" },
    { name: "Appwrite", image: appwriteImg, color: "#F02E65" },
    { name: "Figma", image: figmaImg, color: "#F24E1E" },
    { name: "Bootstrap", image: boostrap, color: "#7952B3" },
    { name: "MongoDB", image: mongodb, color: "#47A248" },
    { name: "VS Code", image: Vs, color: "#007ACC" },
  ];

  return (
    <div className="tech-stack-section" id="skills">
      <div className="tech-stack-header" data-aos="fade-up">
        <h2>Technologies & Tools</h2>
      </div>


      <div className="scroll-container">
        <div className="scroll-content scroll-right">
          {[...techStack, ...techStack].map((tech, index) => (
            <div key={`right-${tech.name}-${index}`} className="tech-card">
              <div className="tech-icon" style={{ borderColor: tech.color }}>
                <img src={tech.image} alt={tech.name} className="tech-img" />
              </div>
              <p className="tech-name">{tech.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Scrolling Left */}
      <div className="scroll-container">
        <div className="scroll-content scroll-left">
          {[...techStack, ...techStack].map((tech, index) => (
            <div key={`left-${tech.name}-${index}`} className="tech-card">
              <div className="tech-icon" style={{ borderColor: tech.color }}>
                <img src={tech.image} alt={tech.name} className="tech-img" />
              </div>
              <p className="tech-name">{tech.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InfiniteScroll;