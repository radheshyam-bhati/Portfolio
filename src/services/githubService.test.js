import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isFeaturedRepo, fetchRepositories, clearCache } from './githubService';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/**
 * Builds a minimal GitHubRepo-shaped object, overriding any field.
 * @param {Partial<import('./githubService').GitHubRepo>} [overrides]
 */
const makeRepo = (overrides = {}) => ({
  id: 1,
  name: 'test-repo',
  description: null,
  html_url: 'https://github.com/radheshyam-bhati/test-repo',
  homepage: null,
  topics: [],
  fork: false,
  archived: false,
  private: false,
  stargazers_count: 0,
  forks_count: 0,
  updated_at: '2026-01-01T00:00:00Z',
  language: 'JavaScript',
  default_branch: 'main',
  owner: { login: 'radheshyam-bhati' },
  ...overrides,
});

const featuredRepo = makeRepo({ id: 1, name: 'featured-repo', topics: ['featured'] });
const portfolioRepo = makeRepo({ id: 2, name: 'portfolio-repo', topics: ['portfolio'] });
const untaggedRepo = makeRepo({ id: 3, name: 'untagged-repo', topics: [] });
const forkedRepo = makeRepo({ id: 4, name: 'forked-repo', topics: ['featured'], fork: true });
const archivedRepo = makeRepo({ id: 5, name: 'archived-repo', topics: ['portfolio'], archived: true });
const privateRepo = makeRepo({ id: 6, name: 'private-repo', topics: ['featured'], private: true });

const ALL_REPOS = [featuredRepo, portfolioRepo, untaggedRepo, forkedRepo, archivedRepo, privateRepo];

// ---------------------------------------------------------------------------
// isFeaturedRepo — PREVIEW_ALL_REPOS OFF (production default)
// ---------------------------------------------------------------------------

describe('isFeaturedRepo with previewAll OFF (production filter)', () => {
  it('includes a public repo tagged `featured`', () => {
    expect(isFeaturedRepo(featuredRepo)).toBe(true);
  });

  it('includes a public repo tagged `portfolio`', () => {
    expect(isFeaturedRepo(portfolioRepo)).toBe(true);
  });

  it('includes a repo tagged with both topics', () => {
    expect(
      isFeaturedRepo(makeRepo({ topics: ['featured', 'portfolio'] })),
    ).toBe(true);
  });

  it('excludes untagged public repos', () => {
    expect(isFeaturedRepo(untaggedRepo)).toBe(false);
  });

  it('excludes public repos with an unrelated topic', () => {
    expect(isFeaturedRepo(makeRepo({ topics: ['hackathon'] }))).toBe(false);
  });

  it('handles a missing topics field as untagged', () => {
    expect(isFeaturedRepo(makeRepo({ topics: undefined }))).toBe(false);
  });

  it('excludes forks even when tagged `featured`', () => {
    expect(isFeaturedRepo(forkedRepo)).toBe(false);
  });

  it('excludes archived repos even when tagged `portfolio`', () => {
    expect(isFeaturedRepo(archivedRepo)).toBe(false);
  });

  it('excludes private repos even when tagged `featured`', () => {
    expect(isFeaturedRepo(privateRepo)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isFeaturedRepo — PREVIEW_ALL_REPOS ON (dev preview)
// ---------------------------------------------------------------------------

describe('isFeaturedRepo with previewAll ON (dev preview)', () => {
  const preview = { previewAll: true };

  it('includes every public repo regardless of topics', () => {
    expect(isFeaturedRepo(featuredRepo, preview)).toBe(true);
    expect(isFeaturedRepo(untaggedRepo, preview)).toBe(true);
    expect(isFeaturedRepo(makeRepo({ topics: ['hackathon'] }), preview)).toBe(true);
  });

  it('includes a public repo with a missing topics field', () => {
    expect(isFeaturedRepo(makeRepo({ topics: undefined }), preview)).toBe(true);
  });

  it('still excludes forks', () => {
    expect(isFeaturedRepo(forkedRepo, preview)).toBe(false);
  });

  it('still excludes archived repos', () => {
    expect(isFeaturedRepo(archivedRepo, preview)).toBe(false);
  });

  it('still excludes private repos', () => {
    expect(isFeaturedRepo(privateRepo, preview)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// fetchRepositories — integration with a mocked GitHub API response
// ---------------------------------------------------------------------------

/** Stubs global fetch to resolve with the given repos. */
function stubReposResponse(repos) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => repos,
    })),
  );
}

describe('fetchRepositories (filter OFF / default)', () => {
  beforeEach(() => {
    clearCache();
    stubReposResponse(ALL_REPOS);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearCache();
  });

  it('returns only tagged, public, non-fork, non-archived repos', async () => {
    const result = await fetchRepositories();
    expect(result.map((repo) => repo.name).sort()).toEqual([
      'featured-repo',
      'portfolio-repo',
    ]);
  });

  it('reuses the cache for repeat calls', async () => {
    await fetchRepositories();
    const calls = vi.mocked(fetch).mock.calls.length;
    await fetchRepositories();
    expect(vi.mocked(fetch).mock.calls.length).toBe(calls);
  });
});

// ---------------------------------------------------------------------------
// fetchRepositories — integration with PREVIEW_ALL_REPOS enabled
// ---------------------------------------------------------------------------

describe('fetchRepositories (preview ON)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
    vi.unstubAllEnvs();
    clearCache();
  });

  it('shows every public repo while still hiding forks and private repos', async () => {
    vi.stubEnv('VITE_PREVIEW_ALL_REPOS', 'true');
    vi.resetModules();
    stubReposResponse(ALL_REPOS);

    const { fetchRepositories: fetchPreview } = await import('./githubService');

    const result = await fetchPreview();
    // Archived repos are excluded in every mode (fork/archived/private
    // are filtered before the previewAll check).
    expect(result.map((repo) => repo.name).sort()).toEqual([
      'featured-repo',
      'portfolio-repo',
      'untagged-repo',
    ]);
  });
});
