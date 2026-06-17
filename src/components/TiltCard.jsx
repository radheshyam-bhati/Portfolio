import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from 'framer-motion';

const TiltCard = ({ children, color = '#ef4444', style, className }) => {
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(rotateYValue, { stiffness: 300, damping: 30 });
  const opacity = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Percentages 0 to 100
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(xPct);
    mouseY.set(yPct);

    // Rotate max ±15deg.
    // center is at xPct=50, yPct=50
    const rY = ((xPct - 50) / 50) * 15;
    const rX = ((yPct - 50) / 50) * -15;

    rotateYValue.set(rY);
    rotateXValue.set(rX);
  };

  const handleMouseEnter = () => {
    if (!shouldReduceMotion) {
      opacity.set(1);
    }
  };

  const handleMouseLeave = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
    opacity.set(0);
  };

  const gradientFade = useMotionTemplate`radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        backgroundColor: 'rgba(12, 12, 12, 0.9)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
      whileHover={{
        y: -5,
        boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${color}30, 0 0 40px ${color}20`
      }}
    >
      <motion.div
        className="tilt-glow"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          background: gradientFade,
          opacity: opacity,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', transformStyle: 'preserve-3d' }}>
        {children}
      </div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0, height: '1.5px',
          background: `linear-gradient(to right, transparent, ${color}90, transparent)`,
          opacity: opacity,
          transition: 'opacity 0.4s ease'
        }}
      />
    </motion.div>
  );
};

export default TiltCard;
