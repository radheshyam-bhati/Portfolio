/**
 * GitHub API configuration.
 *
 * Centralises all GitHub-related settings so that services and hooks never
 * hardcode the username or API constants.
 *
 * @module config/github
 */

/** GitHub username used to fetch repositories. */
export const GITHUB_USERNAME = 'radheshyam-bhati';

/** Base URL for the GitHub REST API v3. */
export const GITHUB_API_BASE = 'https://api.github.com';

/** Base URL for raw file content hosted by GitHub. */
export const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

/** Number of milliseconds to cache a successful GitHub response before re-fetching. */
export const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/** Number of milliseconds to cache repository metadata (portfolio.json) before re-fetching. */
export const METADATA_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Dev-only preview mode: when enabled, the Projects section shows ALL public
 * repos instead of only repos tagged `featured` / `portfolio`.
 *
 * Enable locally with `VITE_PREVIEW_ALL_REPOS=true npm run dev` (or a
 * `.env.local` entry). Hard-gated to development builds so a production
 * bundle can never accidentally expose every repo.
 */
export const PREVIEW_ALL_REPOS =
  import.meta.env.DEV && import.meta.env.VITE_PREVIEW_ALL_REPOS === 'true';
