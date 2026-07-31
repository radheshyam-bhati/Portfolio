import { GITHUB_API_BASE, GITHUB_USERNAME, CACHE_TTL_MS, PREVIEW_ALL_REPOS } from '../config/github';
import { createCache } from '../utils/cache';

/**
 * @typedef {object} GitHubRepo
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} html_url
 * @property {string|null} homepage
 * @property {string[]} topics
 * @property {boolean} fork
 * @property {boolean} archived
 * @property {boolean} private
 * @property {number} stargazers_count
 * @property {number} forks_count
 * @property {string} updated_at
 * @property {string|null} language
 * @property {string} default_branch
 * @property {{ login: string }} owner
 */

/**
 * @typedef {object} GitHubUser
 * @property {string} login
 * @property {string} name
 * @property {string} avatar_url
 * @property {string|null} bio
 * @property {string|null} company
 * @property {string|null} blog
 * @property {string|null} location
 * @property {number} followers
 * @property {number} following
 * @property {number} public_repos
 * @property {number} public_gists
 * @property {string} created_at
 * @property {string} html_url
 * @property {string|null} twitter_username
 */

// ---------------------------------------------------------------------------
// Cache instances (one per data type)
// ---------------------------------------------------------------------------

const featuredRepoCache = createCache({ ttl: CACHE_TTL_MS });
const allRepoCache = createCache({ ttl: CACHE_TTL_MS });
const profileCache = createCache({ ttl: CACHE_TTL_MS });
const repoLanguagesCache = createCache({ ttl: CACHE_TTL_MS });

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Parses a GitHub API error response into a human-readable message.
 *
 * @param {Response} response – The raw fetch Response object.
 * @returns {Promise<string>}
 */
async function parseErrorResponse(response) {
  if (response.status === 403) {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    if (remaining === '0') {
      const resetEpoch = Number(response.headers.get('X-RateLimit-Reset') || 0);
      const resetDate = new Date(resetEpoch * 1000);
      const minutes = Math.ceil((resetDate.getTime() - Date.now()) / 60_000);
      return `GitHub API rate limit reached. Resets in approximately ${minutes} minute${minutes === 1 ? '' : 's'}.`;
    }
  }

  if (response.status === 404) {
    return `GitHub user "${GITHUB_USERNAME}" not found. Check the GITHUB_USERNAME in src/config/github.js.`;
  }

  try {
    /** @type {{ message?: string }} */
    const body = await response.json();
    return body.message || `GitHub API responded with status ${response.status}.`;
  } catch {
    return `GitHub API responded with status ${response.status}.`;
  }
}

/**
 * Generic fetch wrapper that handles caching, error parsing, and network errors.
 *
 * @param {string} cacheKey
 * @param {string} url
 * @param {ReturnType<typeof createCache>} cache
 * @param {boolean} [useTopicsHeader=false]
 * @returns {Promise<any>}
 */
async function fetchWithCache(cacheKey, url, cache, useTopicsHeader = false) {
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached;

  /** @type {Response} */
  let response;
  try {
    const headers = useTopicsHeader
      ? { Accept: 'application/vnd.github.mercy-preview+json' }
      : undefined;
    response = await fetch(url, headers ? { headers } : undefined);
  } catch (networkError) {
    throw new Error(
      `Unable to reach GitHub API. Please check your internet connection. (${/** @type {Error} */ (networkError).message})`,
    );
  }

  if (!response.ok) {
    const message = await parseErrorResponse(response);
    throw new Error(message);
  }

  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}

// ---------------------------------------------------------------------------
// Featured-repo filter (pure, unit-testable)
// ---------------------------------------------------------------------------

/**
 * Decides whether a repository should appear in the Featured Projects
 * section.
 *
 * Pure function (no I/O) so it can be unit-tested directly in both
 * `previewAll` states. Forks, archived, and private repos are always
 * excluded. Otherwise a repo is shown when it carries the `featured` or
 * `portfolio` topic — or, in dev preview mode, whenever it is simply public.
 *
 * @param {GitHubRepo} repo
 * @param {{ previewAll?: boolean }} [options]
 * @returns {boolean}
 */
export function isFeaturedRepo(repo, { previewAll = false } = {}) {
  if (repo.fork || repo.archived || repo.private) return false;
  // Dev preview: show every public repo without requiring a topic tag.
  // Enabled via VITE_PREVIEW_ALL_REPOS=true (never active in production).
  if (previewAll) return true;
  const topics = repo.topics ?? [];
  return topics.includes('featured') || topics.includes('portfolio');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches featured/public repositories (topic: featured or portfolio).
 *
 * @returns {Promise<GitHubRepo[]>}
 */
export async function fetchRepositories() {
  const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?sort=updated&per_page=100`;

  const allRepos = await fetchWithCache('featured', url, featuredRepoCache, true);

  return allRepos.filter((repo) => isFeaturedRepo(repo, { previewAll: PREVIEW_ALL_REPOS }));
}

/**
 * Fetches ALL public repositories (no topic filter).
 *
 * @returns {Promise<GitHubRepo[]>}
 */
export async function fetchAllRepositories() {
  const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?sort=updated&per_page=100`;

  const allRepos = await fetchWithCache('all', url, allRepoCache, true);

  return allRepos.filter((repo) => !repo.fork && !repo.archived && !repo.private);
}

/**
 * Fetches the byte-count language breakdown for a single repository.
 *
 * Lazy by design (see research D2): called only when a project detail view
 * opens, to stay within the unauthenticated GitHub rate limit. Responses are
 * cached per repository for the configured TTL.
 *
 * @param {string} repoName – repository name, e.g. "my-project"
 * @returns {Promise<Record<string, number>|null>} language → byte count,
 *   or `null` when the request fails (404/403/network) so the UI degrades
 *   gracefully without throwing.
 */
export async function fetchRepoLanguages(repoName) {
  const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(GITHUB_USERNAME)}/${encodeURIComponent(repoName)}/languages`;

  try {
    return await fetchWithCache(`languages:${repoName}`, url, repoLanguagesCache);
  } catch {
    return null;
  }
}

/**
 * Fetches the public GitHub profile for the configured user.
 *
 * @returns {Promise<GitHubUser>}
 */
export async function fetchUserProfile() {
  const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(GITHUB_USERNAME)}`;
  return fetchWithCache('profile', url, profileCache);
}

/**
 * Clears all in-memory caches.
 */
export function clearCache() {
  featuredRepoCache.clear();
  allRepoCache.clear();
  profileCache.clear();
  repoLanguagesCache.clear();
}

/**
 * Invalidates all caches (alias for clear).
 */
export const invalidateCache = clearCache;
