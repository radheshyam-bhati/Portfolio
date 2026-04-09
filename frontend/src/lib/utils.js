export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '');
  const safeHex = normalized.length === 3
    ? normalized
        .split('')
        .map((character) => `${character}${character}`)
        .join('')
    : normalized;

  const integer = Number.parseInt(safeHex, 16);
  const red = (integer >> 16) & 255;
  const green = (integer >> 8) & 255;
  const blue = integer & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
