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
 * How often the Projects section silently re-fetches from GitHub in the
 * background so new pins / new repos appear without a manual refresh.
 *
 * Kept well above the unauthenticated GitHub API rate limit (60 req/hr per
 * IP) — at 5 minutes this adds ~12 repo-list requests per hour on top of the
 * existing fetches.
 */
export const AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
