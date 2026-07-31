import { METADATA_CACHE_TTL_MS } from '../config/github';
import { createCache } from '../utils/cache';
import { rawRepoFileUrl } from '../utils/githubMapper';

/**
 * @typedef {object} PortfolioMetadata
 * @property {boolean}  [featured]
 * @property {number}   [priority]
 * @property {string}   [category]
 * @property {string}   [image]
 * @property {string}   [demo]
 * @property {string}   [description]
 * @property {boolean}  [hidden]
 * @property {string[]} [extraLanguages] – Curated extra languages/tech appended
 *                              to the GitHub-detected language breakdown
 *                              (never removes detected languages)
 *
 * // --- Case study fields ---
 * @property {string}   [summary]
 * @property {string}   [problem]
 * @property {string}   [solution]
 * @property {string}   [architecture]
 * @property {string[]} [challenges]
 * @property {string[]} [lessons]
 * @property {string[]} [futureImprovements]
 * @property {string[]} [screenshots]
 * @property {string}   [demoGif]
 * @property {string}   [architectureDiagram]
 *
 * // --- Interactive architecture graph ---
 * @property {import('./architectureService').SystemArchitecture} [systemArchitecture]
 */

// ---------------------------------------------------------------------------
// Cache — one entry per repository, keyed by repo name
// ---------------------------------------------------------------------------

const metadataCache = createCache({ ttl: METADATA_CACHE_TTL_MS });

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Attempts to parse a JSON string into a PortfolioMetadata object.
 *
 * Returns `null` when the string is not valid JSON or is not a plain object.
 *
 * @param {string} text
 * @returns {PortfolioMetadata|null}
 */
function tryParseJson(text) {
  try {
    const parsed = JSON.parse(text);

    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    return /** @type {PortfolioMetadata} */ (parsed);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches a single repository's `portfolio.json` file.
 *
 * Cached per repository name. Errors never propagate — returns `null`
 * when the file does not exist or cannot be parsed.
 *
 * @param {string} repoName       – e.g. "my-project"
 * @param {string} defaultBranch  – e.g. "main"
 * @returns {Promise<PortfolioMetadata|null>}
 */
export async function fetchSingleMetadata(repoName, defaultBranch) {
  const cached = metadataCache.get(repoName);
  if (cached !== undefined) return cached;

  const url = rawRepoFileUrl(repoName, defaultBranch, 'portfolio.json');

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
    const data = tryParseJson(text);
    metadataCache.set(repoName, data);
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetches `portfolio.json` metadata for each of the supplied repositories.
 *
 * Results are cached per repository name. Errors never propagate.
 *
 * @param {import('./githubService').GitHubRepo[]} repos
 * @returns {Promise<Map<number, PortfolioMetadata|null>>}
 */
export async function fetchMetadataForRepos(repos) {
  /** @type {Map<number, PortfolioMetadata|null>} */
  const results = new Map();

  const fetches = repos.map(async (repo) => {
    const data = await fetchSingleMetadata(repo.name, repo.default_branch);
    results.set(repo.id, data);
  });

  await Promise.all(fetches);
  return results;
}

/**
 * Clears the metadata cache.
 */
export function clearMetadataCache() {
  metadataCache.clear();
}
