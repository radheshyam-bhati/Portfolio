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
import DashboardSection from './components/DashboardSection';
import Contact from './components/Contact';
import Preloader from './components/Preloader';
import AssistantButton from './components/AssistantButton';
import AssistantModal from './components/AssistantModal';
import ProjectModal from './components/ProjectModal';
import { useProjects } from './hooks/useProjects';
import { createFloatingParticles } from './utils/particles';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { projects } = useProjects();
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
        {isLoading && <Preloader key="preloader" onComplete={handlePreloaderComplete} />}
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

      {/* Floating assistant */}
      <AssistantButton
        isOpen={assistantOpen}
        onClick={() => setAssistantOpen((prev) => !prev)}
      />
      <AssistantModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        onOpenProject={(repoName) => {
          const project = projects.find((p) => p.repoName === repoName);
          if (project) {
            setSelectedProject(project);
            setAssistantOpen(false);
          }
        }}
      />

      {/* Project modal opened from search results */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Certifications />
        <DashboardSection />
        <Contact />
      </main>
    </div>
  );
}

export default App;
