import { createCache } from '../utils/cache';
import { rawRepoFileUrl } from '../utils/githubMapper';
import { fetchReadme } from './readmeService';
import { parseReadme } from '../utils/readmeParser';
import { getSystemArchitecture } from './architectureService';

/**
 * @typedef {object} CaseStudy
 * @property {string|null}  problem
 * @property {string|null}  solution
 * @property {string|null}  architecture
 * @property {string[]}     challenges
 * @property {string[]}     lessons
 * @property {string[]}     futureImprovements
 * @property {string[]}     screenshots        – Resolved raw.githubusercontent.com URLs
 * @property {string|null}  demoGif            – Resolved raw.githubusercontent.com URL
 * @property {string|null}  architectureDiagram – Resolved raw.githubusercontent.com URL
 * @property {string|null}  summary
 * @property {string[]}     techStack
 * @property {string[]}     features
 * @property {import('./architectureService').SystemArchitecture|null}  systemArchitecture
 */

// ---------------------------------------------------------------------------
// Cache – one entry per repository, keyed by repo name
// ---------------------------------------------------------------------------

const diagramCache = createCache({ ttl: 30 * 60 * 1000 });
const gifCache = createCache({ ttl: 30 * 60 * 1000 });

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Extracts case study fields from portfolio.json metadata.
 *
 * @param {import('./repositoryMetadataService').PortfolioMetadata|null} metadata
 * @returns {Pick<CaseStudy, 'problem'|'solution'|'architecture'|'challenges'|'lessons'|'futureImprovements'|'summary'>}
 */
function extractMetadataFields(metadata) {
  if (!metadata) {
    return {
      problem: null,
      solution: null,
      architecture: null,
      challenges: [],
      lessons: [],
      futureImprovements: [],
      summary: null,
    };
  }

  return {
    problem: typeof metadata.problem === 'string' ? metadata.problem : null,
    solution: typeof metadata.solution === 'string' ? metadata.solution : null,
    architecture: typeof metadata.architecture === 'string' ? metadata.architecture : null,
    challenges: Array.isArray(metadata.challenges) ? metadata.challenges.filter((c) => typeof c === 'string') : [],
    lessons: Array.isArray(metadata.lessons) ? metadata.lessons.filter((l) => typeof l === 'string') : [],
    futureImprovements: Array.isArray(metadata.futureImprovements)
      ? metadata.futureImprovements.filter((f) => typeof f === 'string')
      : [],
    summary: typeof metadata.summary === 'string' ? metadata.summary : null,
  };
}

/**
 * Resolves screenshot paths from portfolio.json into raw.githubusercontent.com URLs.
 *
 * @param {import('./repositoryMetadataService').PortfolioMetadata|null} metadata
 * @param {string} repoName
 * @param {string} defaultBranch
 * @returns {string[]}
 */
function resolveScreenshots(metadata, repoName, defaultBranch) {
  if (!metadata?.screenshots || !Array.isArray(metadata.screenshots)) {
    return [];
  }

  return metadata.screenshots
    .filter((path) => typeof path === 'string' && path.length > 0)
    .map((path) => rawRepoFileUrl(repoName, defaultBranch, path));
}

/**
 * Discovers whether an architecture diagram exists by trying known filenames.
 *
 * @param {import('./repositoryMetadataService').PortfolioMetadata|null} metadata
 * @param {string} repoName
 * @param {string} defaultBranch
 * @returns {Promise<string|null>}
 */
async function discoverArchitectureDiagram(metadata, repoName, defaultBranch) {
  // portfolio.json explicit path takes priority
  if (metadata?.architectureDiagram && typeof metadata.architectureDiagram === 'string') {
    return rawRepoFileUrl(repoName, defaultBranch, metadata.architectureDiagram);
  }

  // Auto-discover from well-known filenames
  const cacheKey = `diagram:${repoName}`;
  const cached = diagramCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const candidates = ['architecture.png', 'architecture.svg', 'architecture.webp', 'architecture.jpg'];
  const results = await tryHeadRequests(repoName, defaultBranch, candidates);

  // Cache the miss too
  diagramCache.set(cacheKey, results);
  return results;
}

/**
 * Discovers whether a demo GIF exists.
 *
 * @param {import('./repositoryMetadataService').PortfolioMetadata|null} metadata
 * @param {string} repoName
 * @param {string} defaultBranch
 * @returns {Promise<string|null>}
 */
async function discoverDemoGif(metadata, repoName, defaultBranch) {
  // portfolio.json explicit path takes priority
  if (metadata?.demoGif && typeof metadata.demoGif === 'string') {
    return rawRepoFileUrl(repoName, defaultBranch, metadata.demoGif);
  }

  // Auto-discover demo.gif from repo root
  const cacheKey = `gif:${repoName}`;
  const cached = gifCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const candidates = ['demo.gif', 'demo.mp4', 'demo.webm'];
  const results = await tryHeadRequests(repoName, defaultBranch, candidates);

  gifCache.set(cacheKey, results);
  return results;
}

/**
 * Tries HEAD requests against a list of candidate filenames.
 *
 * Returns the first URL that responds 200, or `null`.
 *
 * @param {string} repoName
 * @param {string} defaultBranch
 * @param {string[]} filenames
 * @returns {Promise<string|null>}
 */
async function tryHeadRequests(repoName, defaultBranch, filenames) {
  const candidates = filenames.map((name) => ({
    name,
    url: rawRepoFileUrl(repoName, defaultBranch, name),
  }));

  const results = await Promise.allSettled(
    candidates.map(async ({ url }) => {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) return url;
      throw new Error('not found');
    }),
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      return result.value;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Loads a complete case study for a repository.
 *
 * Orchestrates:
 * 1. Portfolio.json metadata (already fetched by repositoryMetadataService)
 * 2. README.md (cached via readmeService)
 * 3. Architecture diagram discovery
 * 4. Demo GIF discovery
 * 5. Screenshot resolution
 *
 * Every source is optional — missing data produces `null` or `[]` sections.
 * Never throws; returns a complete CaseStudy object on success.
 *
 * @param {string} repoName
 * @param {string} defaultBranch
 * @param {import('./repositoryMetadataService').PortfolioMetadata|null} metadata
 * @returns {Promise<CaseStudy>}
 */
export async function getCaseStudy(repoName, defaultBranch, metadata) {
  // Extract fields already available from portfolio.json
  const metaFields = extractMetadataFields(metadata);

  // Resolve screenshots from portfolio.json paths
  const screenshots = resolveScreenshots(metadata, repoName, defaultBranch);

  // Fetch README (cached)
  const readmeResult = await fetchReadme(repoName, defaultBranch);
  const parsedReadme = readmeResult ? parseReadme(readmeResult.text) : null;

  // Discover architecture diagram + demo GIF in parallel
  const [architectureDiagram, demoGif] = await Promise.all([
    discoverArchitectureDiagram(metadata, repoName, defaultBranch),
    discoverDemoGif(metadata, repoName, defaultBranch),
  ]);

  // Interactive architecture graph (from portfolio.json)
  let systemArchitecture = null;
  if (metadata?.systemArchitecture) {
    try {
      systemArchitecture = getSystemArchitecture(metadata);
    } catch {
      // Silently ignore — the explorer will just be hidden
    }
  }

  // Merge portfolio.json fields → README fields → sensible defaults
  return {
    // portfolio.json wins over README for these text fields
    problem: metaFields.problem,
    solution: metaFields.solution,
    architecture: metaFields.architecture,
    challenges: metaFields.challenges,
    lessons: metaFields.lessons,
    futureImprovements: metaFields.futureImprovements,
    summary: metaFields.summary || parsedReadme?.summary || null,
    features: parsedReadme?.features || [],
    techStack: parsedReadme?.techStack || [],

    // Resolved asset URLs
    screenshots,
    demoGif,
    architectureDiagram,

    // Interactive architecture graph
    systemArchitecture,
  };
}
