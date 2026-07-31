import { fetchRepositories } from './githubService';
import { fetchMetadataForRepos } from './repositoryMetadataService';
import { accentColourForLanguage, deriveTag, rawRepoFileUrl } from '../utils/githubMapper';

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
    featured: true,
    priority: 99,
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
    deployment: null,
  };

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

  // Deployment info — live link + description (FR-005/FR-006).
  // Derived after metadata overrides so `live` reflects the final URL
  // (metadata `demo` > repo `homepage`).
  if (project.live) {
    project.deployment = {
      url: project.live,
      description: metadata.description || repo.description || null,
    };
  }

  return project;
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

/**
 * Sorts projects by `priority` ascending, then `updatedAt` descending.
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
