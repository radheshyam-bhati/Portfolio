import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const HOVERABLE_SELECTOR = 'a, button, [role="button"], .clickable';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverStateRef = useRef(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 80, damping: 20 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return undefined;
    }

    const updateHoverState = (nextHoverState) => {
      if (hoverStateRef.current === nextHoverState) {
        return;
      }

      hoverStateRef.current = nextHoverState;
      setIsHovered(nextHoverState);
    };

    const handlePointerMove = (event) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);

      if (!(event.target instanceof Element)) {
        updateHoverState(false);
        return;
      }

      updateHoverState(Boolean(event.target.closest(HOVERABLE_SELECTOR)));
    };

    const handlePointerLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
      updateHoverState(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [cursorX, cursorY]);

  const ringSize = isHovered ? 56 : 32;
  const dotSize = 6;

  return (
    <>
      <motion.div
        className="custom-cursor-ring-new"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          pointerEvents: 'none',
          zIndex: 9999,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: isHovered ? 'difference' : 'normal',
          backgroundColor: isHovered ? '#fff' : 'transparent',
          borderWidth: isHovered ? '0px' : '1px',
          transition: 'width 0.2s, height 0.2s, background-color 0.2s'
        }}
      />
      <motion.div
        className="custom-cursor-dot-new"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          pointerEvents: 'none',
          zIndex: 9999,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: isHovered ? 'difference' : 'normal'
        }}
      />
    </>
  );
};

export default CustomCursor;
