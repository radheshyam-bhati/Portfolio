function getDeterministicValue(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function getValueInRange(seed, min, max) {
  return min + getDeterministicValue(seed) * (max - min);
}

export function createFloatingParticles(count = 28) {
  return Array.from({ length: count }, (_, index) => {
    const particleIndex = index + 1;
    const size = getValueInRange(particleIndex, 2, 6);

    return {
      id: particleIndex,
      size,
      left: `${getValueInRange(particleIndex + 10, 0, 100)}%`,
      duration: `${getValueInRange(particleIndex + 20, 4, 10)}s`,
      delay: `${getValueInRange(particleIndex + 30, 0, 7)}s`,
    };
  });
}
