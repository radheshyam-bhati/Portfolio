// ---------------------------------------------------------------------------
// Alias normalisation map
// ---------------------------------------------------------------------------

/**
 * Maps common name variants to a canonical skill name.
 *
 * @type {Record<string, string>}
 */
export const ALIASES = {
  node: 'Node.js',
  nodejs: 'Node.js',
  'node-js': 'Node.js',

  typescript: 'TypeScript',
  ts: 'TypeScript',

  js: 'JavaScript',
  javascript: 'JavaScript',

  mongodb: 'MongoDB',
  mongo: 'MongoDB',

  next: 'Next.js',
  nextjs: 'Next.js',
  'next-js': 'Next.js',

  reactjs: 'React',
  'react-js': 'React',

  express: 'Express.js',
  expressjs: 'Express.js',
  'express-js': 'Express.js',

  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',

  'c++': 'C++',
  cpp: 'C++',

  'c#': 'C#',
  csharp: 'C#',

  py: 'Python',

  sqlite: 'SQLite',
  redis: 'Redis',

  tailwind: 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
  'tailwind-css': 'Tailwind CSS',

  bootstrap: 'Bootstrap',
  docker: 'Docker',

  kubernetes: 'Kubernetes',
  k8s: 'Kubernetes',

  'github-actions': 'GitHub Actions',
  actions: 'GitHub Actions',

  vite: 'Vite',
  webpack: 'Webpack',
  eslint: 'ESLint',
  prettier: 'Prettier',
  pandas: 'Pandas',
  numpy: 'NumPy',
};

// ---------------------------------------------------------------------------
// Non-skill keywords to ignore
// ---------------------------------------------------------------------------

/** @type {Set<string>} */
export const IGNORED_TOPICS = new Set([
  'featured',
  'portfolio',
  'opensource',
  'open-source',
  'responsive',
  'template',
  'demo',
  'example',
  'practice',
  'learning',
  'experimental',
  'personal',
  'hackathon',
  'project',
  'sample',
]);

// ---------------------------------------------------------------------------
// Category grouping
// ---------------------------------------------------------------------------

/** @type {Record<string, string>} */
export const SKILL_CATEGORIES = {
  Python: 'Programming Languages',
  C: 'Programming Languages',
  'C++': 'Programming Languages',
  'C#': 'Programming Languages',
  Java: 'Programming Languages',
  TypeScript: 'Programming Languages',
  JavaScript: 'Programming Languages',
  Go: 'Programming Languages',
  Rust: 'Programming Languages',
  Ruby: 'Programming Languages',
  PHP: 'Programming Languages',
  Swift: 'Programming Languages',
  Kotlin: 'Programming Languages',
  Dart: 'Programming Languages',
  Scala: 'Programming Languages',
  R: 'Programming Languages',

  React: 'Frontend',
  'Next.js': 'Frontend',
  HTML: 'Frontend',
  HTML5: 'Frontend',
  CSS: 'Frontend',
  CSS3: 'Frontend',
  'Tailwind CSS': 'Frontend',
  Bootstrap: 'Frontend',
  Vue: 'Frontend',
  Angular: 'Frontend',
  Svelte: 'Frontend',

  'Node.js': 'Backend',
  'Express.js': 'Backend',
  FastAPI: 'Backend',
  Flask: 'Backend',
  Django: 'Backend',
  Firebase: 'Backend',
  Spring: 'Backend',
  'ASP.NET': 'Backend',
  Laravel: 'Backend',
  GraphQL: 'Backend',

  PostgreSQL: 'Database',
  MySQL: 'Database',
  MongoDB: 'Database',
  SQLite: 'Database',
  Redis: 'Database',
  IndexedDB: 'Database',
  LocalStorage: 'Database',
  MariaDB: 'Database',

  'OpenAI API': 'AI & Data',
  'Gemini API': 'AI & Data',
  'Data Analysis': 'AI & Data',
  Dashboarding: 'AI & Data',
  MachineLearning: 'AI & Data',
  'Machine Learning': 'AI & Data',
  AI: 'AI & Data',
  LLM: 'AI & Data',
  'Power BI': 'AI & Data',

  Docker: 'DevOps',
  Kubernetes: 'DevOps',
  'GitHub Actions': 'DevOps',
  Nginx: 'DevOps',
  Jenkins: 'DevOps',
  Ansible: 'DevOps',
  Terraform: 'DevOps',

  AWS: 'Cloud',
  GCP: 'Cloud',
  Azure: 'Cloud',
  Vercel: 'Cloud',
  Netlify: 'Cloud',
  Cloudflare: 'Cloud',
  Heroku: 'Cloud',

  Git: 'Tools',
  GitHub: 'Tools',
  Webpack: 'Tools',
  Vite: 'Tools',
  ESLint: 'Tools',
  Prettier: 'Tools',
  'VS Code': 'Tools',
  GSAP: 'Tools',
  Lenis: 'Tools',
  Linux: 'Tools',
  'GitHub Pages': 'Tools',
  Figma: 'Tools',
  'UI/UX': 'Tools',
  'Chart.js': 'Data & Visualization',
  'D3.js': 'Data & Visualization',
  Pandas: 'Data & Visualization',
  NumPy: 'Data & Visualization',
  Matplotlib: 'Data & Visualization',
  Shell: 'Tools',

  OOP: 'Concepts',
  DSA: 'Concepts',
  'REST APIs': 'Concepts',
  'REST API': 'Concepts',
  'Client-Side Architecture': 'Concepts',
  'Client-Side': 'Concepts',
  'Agile Development': 'Concepts',
  Agile: 'Concepts',
};

/** @type {Record<string, string>} */
export const CATEGORY_COLORS = {
  'Programming Languages': '#ef4444',
  Frontend: '#b91c1c',
  Backend: '#f43f5e',
  Database: '#3b82f6',
  DevOps: '#8b5cf6',
  Cloud: '#06b6d4',
  Tools: '#f59e0b',
  'Data & Visualization': '#f43f5e',
  'AI & Data': '#a855f7',
  Concepts: '#f472b6',
  Other: '#6b7280',
};

const DEFAULT_CATEGORY_COLOR = '#6b7280';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalises a raw topic/language string to its canonical skill name.
 *
 * @param {string} raw
 * @returns {string}
 */
export function normaliseSkillName(raw) {
  const lower = raw.toLowerCase().trim();
  return ALIASES[lower] ?? raw;
}

/**
 * Returns `true` when the name should be treated as a skill (not an ignored keyword).
 *
 * @param {string} name
 * @returns {boolean}
 */
export function isSkillName(name) {
  return !IGNORED_TOPICS.has(name.toLowerCase());
}

/**
 * Returns the category for a normalised skill name, or `"Other"`.
 *
 * @param {string} name
 * @returns {string}
 */
export function categoryForSkillName(name) {
  return SKILL_CATEGORIES[name] ?? 'Other';
}

/**
 * Returns the colour for a skill category, or a grey fallback.
 *
 * @param {string} category
 * @returns {string}
 */
export function colorForCategory(category) {
  return CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR;
}

/**
 * Stable sort order for skill categories.
 */
export const CATEGORY_ORDER = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'AI & Data',
  'DevOps',
  'Cloud',
  'Tools',
  'Concepts',
  'Data & Visualization',
  'Other',
];
