import React, { useEffect } from "react";
import Bg from "./components/bg/bg";
import Header from "./components/header";
import Hero from "./components/hero-section";
import About from "./components/About";
import "./App.css";
import AOS from "aos";
import Projects from "./components/projects";
import InfiniteScroll from "./components/iconscrool";
import SkillProgress from "./components/circlepro";
import UserChatsAndReviews from "./components/userreviews";
import Footer from "./components/contact";


        
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
      <InfiniteScroll />
      <SkillProgress  />
      <UserChatsAndReviews/>
      <Footer />   
      </>
  );
}

export default App;
