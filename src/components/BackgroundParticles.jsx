import React from 'react';

const BackgroundParticles = ({ particles }) => {
  return (
    <>
      {particles.map((particle) => (
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
    </>
  );
};

export default BackgroundParticles;
