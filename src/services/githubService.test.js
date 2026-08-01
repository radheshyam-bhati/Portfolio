import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isShownRepo, fetchRepositories, clearCache } from './githubService';

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
// isShownRepo — every public repo is shown (no topic tag required)
// ---------------------------------------------------------------------------

describe('isShownRepo (production filter)', () => {
  it('includes an untagged public repo — no topic required', () => {
    expect(isShownRepo(untaggedRepo)).toBe(true);
  });

  it('includes a public repo tagged `featured` or `portfolio`', () => {
    expect(isShownRepo(featuredRepo)).toBe(true);
    expect(isShownRepo(portfolioRepo)).toBe(true);
  });

  it('includes a public repo with an unrelated topic', () => {
    expect(isShownRepo(makeRepo({ topics: ['hackathon'] }))).toBe(true);
  });

  it('includes a public repo with a missing topics field', () => {
    expect(isShownRepo(makeRepo({ topics: undefined }))).toBe(true);
  });

  it('excludes forks even when tagged `featured`', () => {
    expect(isShownRepo(forkedRepo)).toBe(false);
  });

  it('excludes archived repos even when tagged `portfolio`', () => {
    expect(isShownRepo(archivedRepo)).toBe(false);
  });

  it('excludes private repos even when tagged `featured`', () => {
    expect(isShownRepo(privateRepo)).toBe(false);
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

describe('fetchRepositories (all public repos shown)', () => {
  beforeEach(() => {
    clearCache();
    stubReposResponse(ALL_REPOS);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearCache();
  });

  it('returns every public repo — tagged or not — while hiding forks, archived and private', async () => {
    const result = await fetchRepositories();
    expect(result.map((repo) => repo.name).sort()).toEqual([
      'featured-repo',
      'portfolio-repo',
      'untagged-repo',
    ]);
  });

  it('reuses the cache for repeat calls', async () => {
    await fetchRepositories();
    const calls = vi.mocked(fetch).mock.calls.length;
    await fetchRepositories();
    expect(vi.mocked(fetch).mock.calls.length).toBe(calls);
  });
});
