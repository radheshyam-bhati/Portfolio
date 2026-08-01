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
