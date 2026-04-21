
const HOVERABLE_SELECTOR = 'a, button, [role="button"], .clickable';

// Mock Element
class MockElement {
  constructor(tagName, attributes = {}, parent = null) {
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes;
    this.parentElement = parent;
    this.classList = new Set(attributes.class ? attributes.class.split(' ') : []);
  }

  matches(selector) {
    const selectors = selector.split(',').map(s => s.trim());
    return selectors.some(s => {
      if (s === 'a' && this.tagName === 'A') return true;
      if (s === 'button' && this.tagName === 'BUTTON') return true;
      if (s.startsWith('[role="') && this.attributes.role === s.match(/"([^"]+)"/)[1]) return true;
      if (s.startsWith('.') && this.classList.has(s.slice(1))) return true;
      return false;
    });
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (current.matches(selector)) return current;
      current = current.parentElement;
    }
    return null;
  }
}

// Create a deep DOM tree
const root = new MockElement('div');
let current = root;
for (let i = 0; i < 50; i++) {
  current = new MockElement('div', {}, current);
}
const leaf = new MockElement('span', { class: 'text' }, current);
const hoverableLeaf = new MockElement('button', {}, current);

const iterations = 1000000;

function benchmarkCurrent() {
  console.log(`Running benchmark for CURRENT implementation (${iterations} iterations)...`);

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    // Simulated event target
    const target = i % 2 === 0 ? leaf : hoverableLeaf;

    // Current logic:
    // cursorX.set(event.clientX);
    // cursorY.set(event.clientY);
    // if (!(event.target instanceof Element)) { ... }
    // updateHoverState(Boolean(event.target.closest(HOVERABLE_SELECTOR)));

    const isHovered = Boolean(target.closest(HOVERABLE_SELECTOR));
  }
  const end = performance.now();
  const duration = end - start;
  console.log(`Duration: ${duration.toFixed(2)}ms`);
  console.log(`Avg time per call: ${(duration * 1000 / iterations).toFixed(4)}μs`);
  return duration;
}

function benchmarkOptimized() {
    console.log(`Running benchmark for OPTIMIZED logic (simulating pointerover vs pointermove)...`);
    // In optimized version, pointermove DOES NOT call closest().
    // pointerover calls closest().
    // On average, pointerover fires MUCH less frequently than pointermove.

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      // pointermove only updates coordinates (simulated here by doing nothing/minimal)
      const x = i;
      const y = i;
    }
    // Simulate pointerover firing once in a while (e.g. 1% of pointermove frequency)
    for (let i = 0; i < iterations / 100; i++) {
        const target = i % 2 === 0 ? leaf : hoverableLeaf;
        const isHovered = Boolean(target.closest(HOVERABLE_SELECTOR));
    }

    const end = performance.now();
    const duration = end - start;
    console.log(`Duration: ${duration.toFixed(2)}ms`);
    console.log(`Avg time per "event loop" iteration: ${(duration * 1000 / iterations).toFixed(4)}μs`);
    return duration;
}

const currentDuration = benchmarkCurrent();
const optimizedDuration = benchmarkOptimized();

const improvement = ((currentDuration - optimizedDuration) / currentDuration) * 100;
console.log(`\nImprovement: ${improvement.toFixed(2)}%`);
