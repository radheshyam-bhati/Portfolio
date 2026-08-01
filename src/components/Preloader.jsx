import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { createFloatingParticles } from '../utils/particles';

const PRELOADER_NAME = 'Radheshyam';
const PRELOADER_EXIT_DELAY_MS = 5500;
const REDUCED_MOTION_EXIT_DELAY_MS = 150;

const Preloader = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [typedName, setTypedName] = useState('');
  const particles = useMemo(() => createFloatingParticles(), []);

  useEffect(() => {
    if (shouldReduceMotion) {
      setTypedName(PRELOADER_NAME);

      const reducedMotionTimeoutId = window.setTimeout(onComplete, REDUCED_MOTION_EXIT_DELAY_MS);
      return () => window.clearTimeout(reducedMotionTimeoutId);
    }

    let currentIndex = 0;
    let typingIntervalId = 0;

    const typingDelayTimeoutId = window.setTimeout(() => {
      typingIntervalId = window.setInterval(() => {
        currentIndex += 1;
        setTypedName(PRELOADER_NAME.slice(0, currentIndex));

        if (currentIndex >= PRELOADER_NAME.length) {
          window.clearInterval(typingIntervalId);
        }
      }, 150);
    }, 1200);

    const completionTimeoutId = window.setTimeout(onComplete, PRELOADER_EXIT_DELAY_MS);

    return () => {
      window.clearTimeout(typingDelayTimeoutId);
      window.clearInterval(typingIntervalId);
      window.clearTimeout(completionTimeoutId);
    };
  }, [onComplete, shouldReduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -50, transition: { duration: 0.6, ease: "easeInOut" } }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#080808',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <style>
        {`
          .preloader-screen {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            padding: 2rem;
          }
          .preloader-dot {
            position: absolute;
            border-radius: 50%;
            background: rgba(220, 20, 20, 0.6);
            animation: floatUpGlobal linear infinite;
          }
          .preloader-glow-ring {
            position: absolute;
            border-radius: 50%;
            border: 1px solid rgba(200,0,0,0.18);
            animation: preloaderPulse 3.5s ease-in-out infinite;
            pointer-events: none;
          }
          @keyframes preloaderPulse {
            0%,100% { transform: scale(1); opacity: 0.4; }
            50%      { transform: scale(1.05); opacity: 1; }
          }
          .preloader-scanline {
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 3px,
              rgba(0,0,0,0.08) 3px,
              rgba(0,0,0,0.08) 4px
            );
            pointer-events: none;
            z-index: 1;
            border-radius: 12px;
          }
          .preloader-center { text-align: center; z-index: 2; font-family: 'Segoe UI', sans-serif; }
          .preloader-welcome {
            font-size: 13px;
            letter-spacing: 7px;
            text-transform: uppercase;
            color: #cc0000;
            opacity: 0;
            animation: preloaderRiseUp 1s ease 0.5s forwards;
          }
          .preloader-name-line {
            font-size: clamp(30px, 6vw, 40px);
            font-weight: 800;
            color: #ffffff;
            margin: 10px 0 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 52px;
          }
          .preloader-name-char {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            animation: preloaderCharIn 0.25s ease forwards;
          }
          @keyframes preloaderCharIn {
            to { opacity: 1; transform: translateY(0); }
          }
          .preloader-cursor {
            display: inline-block;
            width: 3px;
            height: clamp(30px, 6vw, 42px);
            background: #cc0000;
            margin-left: 3px;
            vertical-align: middle;
            animation: preloaderBlink 0.8s step-end infinite;
            box-shadow: 0 0 8px #cc0000;
          }
          @keyframes preloaderBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .preloader-portfolio-text {
            font-size: 13px;
            letter-spacing: 8px;
            text-transform: uppercase;
            color: #888;
            opacity: 0;
            animation: preloaderRiseUp 1s ease 2.6s forwards;
          }
          .preloader-divider {
            width: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #cc0000, transparent);
            margin: 14px auto;
            animation: preloaderExpand 1s ease 2.2s forwards;
            opacity: 0;
          }
          @keyframes preloaderExpand {
            to { width: 160px; opacity: 1; }
          }
          .preloader-tags {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            opacity: 0;
            animation: preloaderRiseUp 1s ease 3.2s forwards;
            justify-content: center;
            flex-wrap: wrap;
          }
          .preloader-tag {
            font-size: 11px;
            letter-spacing: 1.5px;
            color: #cc0000;
            border: 0.5px solid rgba(200,0,0,0.4);
            padding: 4px 14px;
            border-radius: 20px;
            text-transform: uppercase;
          }
          @keyframes preloaderRiseUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className="preloader-screen">
        {particles.map(p => (
          <div
            key={p.id}
            className="preloader-dot"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: p.duration,
              animationDelay: p.delay,
              boxShadow: `0 0 ${p.size * 2}px rgba(200,0,0,0.5)`
            }}
          />
        ))}

        <div className="preloader-glow-ring" style={{ width: '260px', height: '260px', animationDelay: '0s' }}></div>
        <div className="preloader-glow-ring" style={{ width: '420px', height: '420px', animationDelay: '0.6s' }}></div>
        <div className="preloader-glow-ring" style={{ width: '580px', height: '580px', animationDelay: '1.2s' }}></div>

        <div className="preloader-scanline"></div>

        <div className="preloader-center">
          <div className="preloader-welcome">Welcome to</div>

          <div className="preloader-name-line">
            {typedName.split("").map((char, index) => (
              <span
                key={index}
                className="preloader-name-char"
                style={{ color: index % 3 === 0 ? "#cc0000" : "#ffffff" }}
              >
                {char}
              </span>
            ))}
            <span className="preloader-cursor"></span>
          </div>

          <div className="preloader-divider"></div>
          <div className="preloader-portfolio-text">Portfolio</div>

          <div className="preloader-tags">
            <span className="preloader-tag">Full Stack Developer</span>
            <span className="preloader-tag">Problem Solver</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
