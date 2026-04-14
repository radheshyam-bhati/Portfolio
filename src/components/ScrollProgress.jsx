import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const progressScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
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
  );
}
