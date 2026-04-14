import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Preloader from './components/Preloader';
import BackgroundParticles from './components/BackgroundParticles';
import { createFloatingParticles } from './utils/particles';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const progressScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const backgroundParticles = useMemo(() => createFloatingParticles(), []);
  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isLoading) {
      document.body.style.overflow = 'hidden';

      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLoading]);

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader
            key="preloader"
            onComplete={handlePreloaderComplete}
            particles={backgroundParticles}
          />
        )}
      </AnimatePresence>

      <CustomCursor />

      <motion.div
        style={{
          scaleX: shouldReduceMotion ? scrollYProgress : progressScale,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: '#ef4444',
          transformOrigin: '0%',
          zIndex: 99999,
        }}
      />

      <div className="fixed-background">
        <BackgroundParticles particles={backgroundParticles} />
      </div>

      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Certifications />
        <Contact />
      </main>
    </div>
  );
}

export default App;
