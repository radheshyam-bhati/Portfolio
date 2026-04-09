const iconMap = {
  arrowRight: `
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  `,
  arrowUpRight: `
    <path d="M7 17 17 7"></path>
    <path d="M8 7h9v9"></path>
  `,
  award: `
    <circle cx="12" cy="8" r="5"></circle>
    <path d="m8.2 13.9-1.4 6.1L12 17l5.2 3-1.4-6.1"></path>
  `,
  calendar: `
    <rect x="3" y="5" width="18" height="16" rx="2"></rect>
    <path d="M16 3v4"></path>
    <path d="M8 3v4"></path>
    <path d="M3 11h18"></path>
  `,
  database: `
    <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
    <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"></path>
    <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path>
  `,
  github: `
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3.26-.36 6.68-1.6 6.68-7.2a5.6 5.6 0 0 0-1.5-3.86 5.2 5.2 0 0 0-.09-3.86s-1.18-.36-3.86 1.49a13.38 13.38 0 0 0-7 0C5.5.18 4.32.54 4.32.54a5.2 5.2 0 0 0-.09 3.86 5.6 5.6 0 0 0-1.5 3.86c0 5.57 3.42 6.81 6.68 7.17a4.8 4.8 0 0 0-1 3.23v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  `,
  linkedin: `
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  `,
  mail: `
    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
    <path d="m4 7 8 6 8-6"></path>
  `,
  mapPin: `
    <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z"></path>
    <circle cx="12" cy="11" r="2.5"></circle>
  `,
  phone: `
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.48-1.28a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z"></path>
  `,
  send: `
    <path d="M22 2 11 13"></path>
    <path d="m22 2-7 20-4-9-9-4 20-7Z"></path>
  `,
  shield: `
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path>
  `,
  sparkles: `
    <path d="m12 3 1.9 4.1L18 9l-4.1 1.9L12 15l-1.9-4.1L6 9l4.1-1.9L12 3Z"></path>
    <path d="m19 2 .8 1.2L21 4l-1.2.8L19 6l-.8-1.2L17 4l1.2-.8L19 2Z"></path>
    <path d="m5 16 .8 1.2L7 18l-1.2.8L5 20l-.8-1.2L3 18l1.2-.8L5 16Z"></path>
  `,
};

export function renderIcon(
  name,
  {
    size = 18,
    className = '',
    stroke = 'currentColor',
    strokeWidth = 1.75,
  } = {},
) {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="${stroke}"
      stroke-width="${strokeWidth}"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="${className}"
      aria-hidden="true"
    >
      ${iconMap[name] || ''}
    </svg>
  `;
}
