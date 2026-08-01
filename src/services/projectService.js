import { fetchRepositories } from './githubService';
import { fetchMetadataForRepos } from './repositoryMetadataService';
import { accentColourForLanguage, deriveTag, rawRepoFileUrl } from '../utils/githubMapper';
import { projectOverrides } from '../data/portfolioData';

/**
 * @typedef {object} Project
 * @property {number|string} id
 * @property {string} title
 * @property {string|null} description
 * @property {string|null} image
 * @property {string|null} category
 * @property {string[]} technologies
 * @property {string} github
 * @property {string|null} live
 * @property {number} stars
 * @property {number} forks
 * @property {string|null} language
 * @property {string} updatedAt
 * @property {boolean} featured
 * @property {number} priority
 * @property {string} tag
 * @property {string} color
 * @property {string|null}  summary       – Short description (from README or portfolio.json)
 * @property {string[]}    features      – Bullet-point features from README
 * @property {string[]}    techStack     – Tech stack items from README
 * @property {string|null} architecture  – Architecture notes from README
 * @property {string|null} readme        – Full raw README text (loaded lazily)
 * @property {string|null} previewImage  – Auto-discovered preview image URL
 * @property {string}      repoName      – Repository name (for lazy README fetch)
 * @property {string}      defaultBranch – Default branch (for lazy README fetch)
 * @property {string[]}    extraLanguages – Curated extra languages/tech appended to
 *                              the GitHub-detected breakdown (never removes existing)
 */

// ---------------------------------------------------------------------------
// Merge helpers
// ---------------------------------------------------------------------------

/**
 * Merges optional `portfolio.json` metadata into a Project object.
 *
 * @param {import('./githubService').GitHubRepo} repo
 * @param {import('./repositoryMetadataService').PortfolioMetadata|null} metadata
 * @returns {Project}
 */
function mergeMetadata(repo, metadata) {
  const topics = repo.topics ?? [];
  // Repos tagged `featured`/`portfolio` are treated as *pinned*: they sort
  // to the top of the Projects section. All other public repos still show
  // (no tag required), ordered by most recent activity.
  const isPinned = topics.includes('featured') || topics.includes('portfolio');

  const project = {
    id: repo.id,
    title: repo.name,
    description: repo.description,
    image: null,
    category: null,
    technologies: [...topics],
    github: repo.html_url,
    live: repo.homepage,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    updatedAt: repo.updated_at,
    featured: isPinned,
    priority: isPinned ? 1 : 99,
    tag: deriveTag(topics, repo.language),
    color: accentColourForLanguage(repo.language),
    // --- New fields ---
    summary: repo.description,
    features: [],
    techStack: [...topics],
    architecture: null,
    readme: null,
    previewImage: null,
    repoName: repo.name,
    defaultBranch: repo.default_branch,
    extraLanguages: [],
  };

  // Local curated defaults — fallbacks used when the repo has no
  // portfolio.json. Anything set via portfolio.json below always wins over
  // these code defaults, so repo owners manage content without changing code.
  const override = projectOverrides[repo.name];
  if (override) {
    if (typeof override.summary === 'string' && !project.summary && !project.description) {
      project.summary = override.summary;
      project.description = override.summary;
    }
    if (Array.isArray(override.extraLanguages)) {
      project.extraLanguages = override.extraLanguages;
    }
  }

  if (!metadata) return project;

  if (typeof metadata.description === 'string') {
    project.description = metadata.description;
    project.summary = metadata.description;
  }

  if (typeof metadata.demo === 'string' && metadata.demo.length > 0) {
    project.live = metadata.demo;
  }

  if (typeof metadata.category === 'string' && metadata.category.length > 0) {
    project.category = metadata.category;
  }

  if (typeof metadata.priority === 'number') {
    project.priority = metadata.priority;
  }

  if (typeof metadata.featured === 'boolean') {
    project.featured = metadata.featured;
  }

  if (typeof metadata.image === 'string' && metadata.image.length > 0) {
    project.image = rawRepoFileUrl(repo.name, repo.default_branch, metadata.image);
    project.previewImage = project.image;
  }

  // No-code curated languages: portfolio.json `extraLanguages` appends to the
  // GitHub-detected breakdown without ever removing detected languages.
  if (Array.isArray(metadata.extraLanguages)) {
    project.extraLanguages = metadata.extraLanguages;
  }

  return project;
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

/**
 * Sorts projects: pinned repos first (`priority` ascending — pinned = 1,
 * everything else = 99), then most recently updated (`updatedAt` descending),
 * then alphabetically as a stable tiebreak.
 *
 * @param {Project[]} projects
 * @returns {Project[]}
 */
function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;

    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    if (dateA !== dateB) return dateB - dateA;

    return a.title.localeCompare(b.title);
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches repositories, enriches with portfolio.json metadata, applies
 * sorting, and filters hidden repos.
 *
 * @returns {Promise<Project[]>}
 * @throws {Error} When the underlying GitHub API request fails.
 */
export async function getProjects() {
  const repos = await fetchRepositories();
  const metadataMap = await fetchMetadataForRepos(repos);

  const merged = [];

  for (const repo of repos) {
    const metadata = metadataMap.get(repo.id) ?? null;
    const project = mergeMetadata(repo, metadata);

    if (metadata?.hidden) continue;

    merged.push(project);
  }

  return sortProjects(merged);
}
