import React, { useEffect, useState, useRef } from "react";
import img from "../../assets/images/about-me.png";
import AOS from "aos";
import "./about.css";
import { FaFileDownload } from "react-icons/fa";
import SplitText from "./Split Text/SplitText";
import TextType from "../Hero/Rewrite Text/TextType";

function About() {
  const [projectsCount, setProjectsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const imageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(null);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 120,
    });
  }, []);

  const animateCounter = (target, setter, duration = 2000) => {
    const step = target / (duration / 16);
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
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // run only once
        }
      },
      { threshold: 0.3 },
    );

    if (textRef.current) observer.observe(textRef.current);

    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounter(50, setProjectsCount, 2000);
            animateCounter(35, setClientsCount, 2200);
            animateCounter(3, setExperienceCount, 1800);
          }
        });
      },
      { threshold: 0.3 },
    );
    if (imageRef.current) observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div>
      <div className="about-2" id="about">
        <div className="main-about-2">
          <div className="about-image" ref={imageRef}>
            <div className="circle-bg"></div>
            <img src={img} alt="Profile" />

            <div
              className="counter-badge badge-top-left"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="counter-value">{projectsCount}+</div>
              <div className="counter-label">Projects</div>
            </div>

            <div
              className="counter-badge badge-top-right"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <div className="counter-value">{clientsCount}+</div>
              <div className="counter-label">Clients</div>
            </div>

            <div
              className="counter-badge badge-bottom"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="counter-value">{experienceCount}+</div>
              <div className="counter-label">Years Exp</div>
            </div>
          </div>

          <div className="about-content">
            <h3>
              <SplitText
                text="Hello my name is"
                splitType="chars"
                variant="slideRight"
                delay={50}
                duration={1250}
                initialDelay={200}
                threshold={0.1}
                className="split-text"
                rootMargin="0px"
              />{" "}
            </h3>
            <h1>
              <SplitText
                text="Moazzam Pasha"
                className="split-text"
                splitType="chars"
                variant="fadeUp"
                delay={90}
                duration={1250}
                initialDelay={200}
                threshold={0.1}
                rootMargin="0px"
              />
            </h1>
            <h2>Front-end Developer</h2>
            <div ref={textRef}>
              {isVisible && (
                <TextType
                  typingSpeed={20}
                  pauseDuration={10000}
                  loop={false}
                  showCursor
                  cursorCharacter="_"
                  text="I’m a front-end developer specializing in building modern, responsive, and high-performance web interfaces. I transform ideas into clean, intuitive, and visually engaging digital experiences using efficient code and thoughtful design. My focus is on creating fast, accessible, and reliable products that deliver real value and leave a lasting impression."
                  deletingSpeed={0}
                  variableSpeedEnabled={false}
                  cursorBlinkDuration={0.5}
                  className="split-text about-bio"
                />
              )}
            </div>
            {/* <SplitText
            I’m a front-end developer specializing in building modern, responsive, and high-performance web interfaces. I transform ideas into clean, intuitive, and visually engaging digital experiences using efficient code and thoughtful design. My focus is on creating fast, accessible, and reliable products that deliver real value and leave a lasting impression.
              text="I'm a front-end developer who loves creating clean, modern, and responsive user interfaces. I focus on turning ideas into smooth, functional, and visually appealing web experiences. My work blends creativity with solid coding practices to deliver reliable results. I enjoy building fast, accessible designs that feel natural to every user. Every project I take on is crafted with attention to detail and purposeful design. My goal is simple: create interfaces that look great, work flawlessly, and leave a lasting impression."
              className="split-text about-bio"
            /> */}

            <div className="hire-me-div" data-aos="flip-left">
              <a
                href={`${import.meta.env.BASE_URL}Resume.pdf`}
                download="Moazzam_pasha_Resume.pdf"
              >
                <button className="shadow__btn">
                  <FaFileDownload /> Download CV
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
