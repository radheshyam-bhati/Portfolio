import { GITHUB_RAW_BASE, GITHUB_USERNAME } from '../config/github';

// ---------------------------------------------------------------------------
// Language → colour map
// ---------------------------------------------------------------------------

/**
 * Deterministic colour palette based on programming language.
 *
 * @type {Record<string, string>}
 */
export const LANGUAGE_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00add8',
  Rust: '#dea584',
  Shell: '#89e051',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
};

const DEFAULT_ACCENT = '#ef4444';

/**
 * Returns a deterministic accent colour for a given programming language.
 *
 * @param {string|null} language
 * @returns {string}
 */
export function accentColourForLanguage(language) {
  if (language && LANGUAGE_COLORS[language]) {
    return LANGUAGE_COLORS[language];
  }
  return DEFAULT_ACCENT;
}

// ---------------------------------------------------------------------------
// Raw URL builder
// ---------------------------------------------------------------------------

/**
 * Builds a raw.githubusercontent.com URL for a file inside a repository.
 *
 * @param {string} repoName
 * @param {string} defaultBranch
 * @param {string} filePath  – path relative to repo root, e.g. "portfolio.json"
 * @returns {string}
 */
export function rawRepoFileUrl(repoName, defaultBranch, filePath) {
  return `${GITHUB_RAW_BASE}/${GITHUB_USERNAME}/${repoName}/${defaultBranch}/${filePath}`;
}

// ---------------------------------------------------------------------------
// Language breakdown mapping
// ---------------------------------------------------------------------------

/**
 * @typedef {object} LanguageStat
 * @property {string}  name       – Language name (e.g. "JavaScript")
 * @property {number}  bytes      – Byte count from the GitHub languages API
 * @property {number}  percentage – Share of the repo (0-100)
 * @property {string}  color      – Deterministic accent colour
 */

/**
 * Converts a GitHub languages map (`{ "JavaScript": 123, "CSS": 45 }`) into
 * a sorted `LanguageStat[]`, dropping 0-byte entries.
 *
 * Percentages are computed against the repo-wide byte total, so they sum to
 * ~100 across the full set. When only the top N are displayed, consumers
 * should re-normalize against the top-N byte sum (see `topLanguageStats`).
 *
 * @param {Record<string, number>|null|undefined} languageBytes
 * @returns {LanguageStat[]}
 */
export function languageBytesToStats(languageBytes) {
  if (!languageBytes || typeof languageBytes !== 'object') return [];

  const entries = Object.entries(languageBytes)
    .filter(([, bytes]) => typeof bytes === 'number' && bytes > 0);

  const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (totalBytes <= 0) return [];

  return entries
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 100),
      color: accentColourForLanguage(name),
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

/**
 * Re-normalizes a language breakdown to the top N languages so their
 * percentages sum to ~100 (see research D2 / spec US2).
 *
 * @param {LanguageStat[]} stats – output of `languageBytesToStats`
 * @param {number} [limit=5]
 * @returns {LanguageStat[]}
 */
export function topLanguageStats(stats, limit = 5) {
  if (!Array.isArray(stats) || stats.length === 0) return [];

  const top = stats.slice(0, limit);
  const topBytes = top.reduce((sum, lang) => sum + lang.bytes, 0);
  if (topBytes <= 0) return top;

  return top.map((lang) => ({
    ...lang,
    percentage: Math.round((lang.bytes / topBytes) * 100),
  }));
}

/**
 * Merges curated/extra language names into a GitHub-detected breakdown.
 *
 * Keeps every existing stat untouched and appends any extra names that are
 * not already present (case-insensitive). Extras have no byte count, so their
 * `percentage` is `null` and consumers render them as plain chips — this
 * "add new but never remove old" behaviour is the user-requested behaviour
 * for showcasing tools GitHub cannot detect (Figma, UI/UX, MySQL, …).
 *
 * @param {LanguageStat[]|null|undefined} stats – GitHub-detected stats
 * @param {string[]} [extraNames] – curated extra language/tech names
 * @returns {LanguageStat[]}
 */
export function mergeExtraLanguages(stats, extraNames = []) {
  if (!Array.isArray(stats)) return [];
  if (!Array.isArray(extraNames) || extraNames.length === 0) return stats;

  const seen = new Set(stats.map((stat) => stat.name.toLowerCase()));
  const extras = [];

  for (const rawName of extraNames) {
    // portfolio.json is hand-edited JSON — guard against non-string entries
    // (e.g. a stray number) so a typo never crashes the render.
    if (typeof rawName !== 'string') continue;
    const name = rawName.trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    extras.push({
      name,
      bytes: 0,
      percentage: null,
      color: accentColourForLanguage(name),
    });
  }

  return [...stats, ...extras];
}

// ---------------------------------------------------------------------------
// Tag derivation
// ---------------------------------------------------------------------------

/** Topics to ignore when deriving a human-readable tag. */
const FILTER_TOPICS = new Set(['featured', 'portfolio']);

/**
 * Derives a human-readable tag/badge from repository topics.
 *
 * Falls back to the primary language, or "Open Source".
 *
 * @param {string[]} topics
 * @param {string|null} language
 * @returns {string}
 */
export function deriveTag(topics, language) {
  const meaningful = topics.filter((t) => !FILTER_TOPICS.has(t));

  if (meaningful.length > 0) {
    return meaningful[0];
  }

  if (language) {
    return language;
  }

  return 'Open Source';
}
