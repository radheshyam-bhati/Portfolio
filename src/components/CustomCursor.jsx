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
    };

    const handlePointerOver = (event) => {
      if (event.target instanceof Element && event.target.closest(HOVERABLE_SELECTOR)) {
        updateHoverState(true);
      }
    };

    const handlePointerOut = (event) => {
      if (event.target instanceof Element && event.target.closest(HOVERABLE_SELECTOR)) {
        updateHoverState(false);
      }
    };

    const handleFocusIn = (event) => {
      if (event.target instanceof Element && event.target.closest(HOVERABLE_SELECTOR)) {
        updateHoverState(true);
        const rect = event.target.getBoundingClientRect();
        cursorX.set(rect.left + rect.width / 2);
        cursorY.set(rect.top + rect.height / 2);
      }
    };

    const handleFocusOut = (event) => {
      if (event.target instanceof Element && event.target.closest(HOVERABLE_SELECTOR)) {
        updateHoverState(false);
      }
    };

    const handlePointerLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
      updateHoverState(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('focusin', handleFocusIn, { passive: true });
    window.addEventListener('focusout', handleFocusOut, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerout', handlePointerOut);
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
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
