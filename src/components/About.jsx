import React, { useEffect } from "react";
import img from "../assets/images/about-me.png";
import AOS from "aos";

function About() {
    useEffect(() => {
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
    offset: 120,
  });
}, []);

  return (
    <div>
      <div className="about-2" id="about">
        <div className="main-about-2">
          <div className="about-image">
            <div className="circle-bg"></div>
            <img src={img} alt="Profile" />
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
              <button className="shadow__btn">Hire me</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;
