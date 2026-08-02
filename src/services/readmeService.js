import { createCache } from '../utils/cache';
import { rawRepoFileUrl } from '../utils/githubMapper';

/**
 * @typedef {object} ReadmeResult
 * @property {string} text   – Raw markdown text
 * @property {string} url    – The raw.githubusercontent.com URL it was fetched from
 */

// ---------------------------------------------------------------------------
// Cache – one entry per repository, keyed by repo name
// ---------------------------------------------------------------------------

const readmeCache = createCache({ ttl: 30 * 60 * 1000 });

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches the raw README.md for a repository.
 *
 * The result is cached for 30 minutes.  Errors never propagate — when the
 * README does not exist or the request fails, `null` is returned.
 *
 * @param {string} repoName       – e.g. "my-project"
 * @param {string} defaultBranch  – e.g. "main"
 * @returns {Promise<ReadmeResult|null>}
 */
export async function fetchReadme(repoName, defaultBranch) {
  const cacheKey = repoName;

  const cached = readmeCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const url = rawRepoFileUrl(repoName, defaultBranch, 'README.md');

  /** @type {Response} */
  let response;
  try {
    response = await fetch(url);
  } catch {
    return null;
  }

  if (!response.ok) return null;

  try {
    const text = await response.text();
    const result = { text, url };
    readmeCache.set(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}

/**
 * Clears the README cache.
 */
export function clearReadmeCache() {
  readmeCache.clear();
}
