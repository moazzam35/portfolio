import React, { useEffect, useState, useRef } from "react";
import img from "../assets/images/about-me.png";
import AOS from "aos";
import { FaFileDownload } from "react-icons/fa";
function About() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 120,
    });
  }, []);

  // Counter animation function
  const animateCounter = (target, setter, duration = 2000) => {
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(current));
      }
    }, 16);

    return timer;
  };

  // Intersection Observer to trigger animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Start counting animations
            animateCounter(50, setProjectsCount, 2000);
            animateCounter(35, setClientsCount, 2200);
            animateCounter(3, setExperienceCount, 1800);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div>
      <div className="about-2" id="about">
        <div className="main-about-2">
          <div className="about-image" ref={imageRef}>
            <div className="circle-bg"></div>
            <img src={img} alt="Profile" />

            {/* Animated Counter Badges */}
            <div className="counter-badge badge-top-left" data-aos="fade-right" data-aos-delay="200">
              <div className="counter-value">{projectsCount}+</div>
              <div className="counter-label">Projects</div>
            </div>

            <div className="counter-badge badge-top-right" data-aos="fade-left" data-aos-delay="400">
              <div className="counter-value">{clientsCount}+</div>
              <div className="counter-label">Clients</div>
            </div>

            <div className="counter-badge badge-bottom" data-aos="fade-up" data-aos-delay="600">
              <div className="counter-value">{experienceCount}+</div>
              <div className="counter-label">Years Exp</div>
            </div>
          </div>

          <div className="about-content">
            <small>Hello my name is</small>
            <h1 data-aos="fade-down-left">MOAZZAM</h1>
            <h2>Front-end Developer</h2>
            <span>
              I'm a front-end developer who loves creating clean, modern, and
              responsive user interfaces. I focus on turning ideas into smooth,
              functional, and visually appealing web experiences. My work blends
              creativity with solid coding practices to deliver reliable
              results. I enjoy building fast, accessible designs that feel
              natural to every user. Every project I take on is crafted with
              attention to detail and purposeful design. My goal is simple:
              create interfaces that look great, work flawlessly, and leave a
              lasting impression.
            </span>
            <div className="hire-me-div" data-aos="flip-left">
              <a href={`${import.meta.env.BASE_URL}Resume.pdf`} download="Moazzam_pasha_Resume.pdf">
                <button className="shadow__btn"> <FaFileDownload /> Download CV</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;