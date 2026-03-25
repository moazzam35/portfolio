import React, { useEffect } from "react";
import Bg from "./components/BG-main/bg";
import Header from "./components/Header/header";
import Hero from "./components/Hero/hero-section";
import About from "./components/About/About";
import "./App.css";
import AOS from "aos";
import Projects from "./components/Projects/projects";
import { AnimatedBeamMultipleOutputDemo } from "./components/AnimatedBeam/animated-beam";
import InfiniteScroll from "./components/Icon-animation/iconscrool";

import Footer from "./components/Contact/contact";

import Skills from "./components/Circle-progress/Skills";
import UseReviews from "./components/Reviews/userreviews";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    AOS.refresh();
  }, []);
  return (
    <>
      <Bg />
      <Header />
      <Hero />
      <About />
      <Projects />
      <AnimatedBeamMultipleOutputDemo />
      <InfiniteScroll />
      <Skills />
      <UseReviews />
      <Footer />
    </>
  );
}

export default App;
