import test from 'node:test';
import assert from 'node:assert';
import { createFloatingParticles } from './particles.js';

test('createFloatingParticles - default count', () => {
  const particles = createFloatingParticles();
  assert.strictEqual(particles.length, 28);
});

test('createFloatingParticles - custom count', () => {
  const particles = createFloatingParticles(10);
  assert.strictEqual(particles.length, 10);
});

test('createFloatingParticles - count 0', () => {
  const particles = createFloatingParticles(0);
  assert.strictEqual(particles.length, 0);
});

test('createFloatingParticles - particle properties and ranges', () => {
  const count = 50;
  const particles = createFloatingParticles(count);

  particles.forEach((p, index) => {
    assert.strictEqual(p.id, index + 1);

    // Size: 2 to 6
    assert.ok(p.size >= 2 && p.size <= 6, `size ${p.size} out of range for particle ${p.id}`);

    // Left: 0% to 100%
    const leftValue = parseFloat(p.left);
    assert.ok(p.left.endsWith('%'));
    assert.ok(leftValue >= 0 && leftValue <= 100, `left ${leftValue} out of range for particle ${p.id}`);

    // Duration: 4s to 10s
    const durationValue = parseFloat(p.duration);
    assert.ok(p.duration.endsWith('s'));
    assert.ok(durationValue >= 4 && durationValue <= 10, `duration ${durationValue} out of range for particle ${p.id}`);

    // Delay: 0s to 7s
    const delayValue = parseFloat(p.delay);
    assert.ok(p.delay.endsWith('s'));
    assert.ok(delayValue >= 0 && delayValue <= 7, `delay ${delayValue} out of range for particle ${p.id}`);
  });
});

test('createFloatingParticles - deterministic', () => {
  const p1 = createFloatingParticles(5);
  const p2 = createFloatingParticles(5);
  assert.deepStrictEqual(p1, p2);
});
