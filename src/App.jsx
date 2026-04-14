import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import AppPreloader from './components/AppPreloader';
import ScrollProgress from './components/ScrollProgress';
import { createFloatingParticles } from './utils/particles';

function App() {
  const [isLoading, setIsLoading] = useState(true);
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
      <AppPreloader isLoading={isLoading} onComplete={handlePreloaderComplete} />

      <CustomCursor />

      <ScrollProgress />

      <div className="fixed-background">
        {backgroundParticles.map((particle) => (
          <div
            key={particle.id}
            className="bg-dot"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              boxShadow: `0 0 ${particle.size * 2}px rgba(200,0,0,0.5)`,
            }}
          />
        ))}
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
