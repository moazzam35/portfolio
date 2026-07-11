import { useEffect, useState } from "react";
import Header from "./components/Header/header";
import Hero from "./components/Hero/hero-section";
import HeroBackground from "./components/Herobackground/herobackground";
import About from "./components/About/About";
import "./App.css";
import AOS from "aos";
import Projects from "./components/Projects/projects";
import { AnimatedBeamMultipleOutputDemo } from "./components/AnimatedBeam/animated-beam";
import InfiniteScroll from "./components/Icon-animation/iconscrool";

import Footer from "./components/Contact/contact";

import Skills from "./components/Circle-progress/Skills";
import UseReviews from "./components/Reviews/userreviews";
import Preloader from "./components/preloader/preloader";
import ScrollMarqueeHero from "./components/imagescrool/imagescrool";

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    AOS.refresh();
  }, []);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      {!showPreloader && (
        <>
          <Header />
          <main>
            <div className="relative h-[600px]">
              <HeroBackground />
              <Hero className="relative z-10" />
            </div>
            <About />
            <ScrollMarqueeHero/>
            <Projects />
            <AnimatedBeamMultipleOutputDemo />
            <InfiniteScroll />
            <Skills />
            <UseReviews />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
