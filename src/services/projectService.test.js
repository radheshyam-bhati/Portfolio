import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProjects } from './projectService';
import { fetchRepositories } from './githubService';
import { fetchMetadataForRepos } from './repositoryMetadataService';

// ---------------------------------------------------------------------------
// Mock the two data sources so getProjects is tested in isolation.
// ---------------------------------------------------------------------------

vi.mock('./githubService', () => ({
  fetchRepositories: vi.fn(),
}));

vi.mock('./repositoryMetadataService', () => ({
  fetchMetadataForRepos: vi.fn(),
}));

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

/** Resolves repository metadata (portfolio.json) as empty for every repo. */
function stubNoMetadata() {
  vi.mocked(fetchMetadataForRepos).mockResolvedValue(new Map());
}

// ---------------------------------------------------------------------------
// Ordering: pinned first, then most-recently-updated, then alphabetical
// ---------------------------------------------------------------------------

describe('getProjects ordering (pinned first, then recently updated)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubNoMetadata();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sorts pinned (featured/portfolio topic) repos before untagged repos', async () => {
    vi.mocked(fetchRepositories).mockResolvedValue([
      makeRepo({
        id: 1,
        name: 'alpha-untagged',
        topics: [],
        updated_at: '2026-07-01T00:00:00Z',
      }),
      makeRepo({
        id: 2,
        name: 'beta-featured',
        topics: ['featured'],
        updated_at: '2026-01-01T00:00:00Z',
      }),
      makeRepo({
        id: 3,
        name: 'gamma-portfolio',
        topics: ['portfolio'],
        updated_at: '2026-02-01T00:00:00Z',
      }),
    ]);

    const projects = await getProjects();

    expect(projects.map((p) => p.title)).toEqual([
      'gamma-portfolio',
      'beta-featured',
      'alpha-untagged',
    ]);
    // Pinned repos carry the flag + priority so the UI can show a badge.
    expect(projects[0].featured).toBe(true);
    expect(projects[2].featured).toBe(false);
  });

  it('orders pinned repos by most recent update, then alphabetical tiebreak', async () => {
    vi.mocked(fetchRepositories).mockResolvedValue([
      makeRepo({
        id: 1,
        name: 'older-pin',
        topics: ['featured'],
        updated_at: '2026-01-01T00:00:00Z',
      }),
      makeRepo({
        id: 2,
        name: 'newer-pin',
        topics: ['featured'],
        updated_at: '2026-06-01T00:00:00Z',
      }),
      makeRepo({
        id: 3,
        name: 'same-date-b',
        topics: ['featured'],
        updated_at: '2026-03-01T00:00:00Z',
      }),
      makeRepo({
        id: 4,
        name: 'same-date-a',
        topics: ['featured'],
        updated_at: '2026-03-01T00:00:00Z',
      }),
    ]);

    const projects = await getProjects();

    expect(projects.map((p) => p.title)).toEqual([
      'newer-pin',
      'same-date-a',
      'same-date-b',
      'older-pin',
    ]);
  });

  it('auto-updates when a previously untagged repo becomes pinned on the next fetch', async () => {
    // First fetch: the repo is not pinned yet.
    vi.mocked(fetchRepositories).mockResolvedValueOnce([
      makeRepo({ id: 1, name: 'my-repo', topics: [], updated_at: '2026-01-01T00:00:00Z' }),
    ]);
    const before = await getProjects();
    expect(before.map((p) => p.title)).toEqual(['my-repo']);
    expect(before[0].featured).toBe(false);

    // Second fetch (e.g. after the user tags it `featured` on GitHub):
    // the same repo is now pinned → must jump to the top.
    vi.mocked(fetchRepositories).mockResolvedValueOnce([
      makeRepo({ id: 2, name: 'other-repo', topics: [], updated_at: '2026-07-01T00:00:00Z' }),
      makeRepo({ id: 1, name: 'my-repo', topics: ['featured'], updated_at: '2026-01-01T00:00:00Z' }),
    ]);
    const after = await getProjects();
    expect(after.map((p) => p.title)).toEqual(['my-repo', 'other-repo']);
    expect(after[0].featured).toBe(true);
  });

  it('auto-includes a brand-new repo on the next fetch', async () => {
    vi.mocked(fetchRepositories).mockResolvedValueOnce([
      makeRepo({ id: 1, name: 'existing', topics: [] }),
    ]);
    const before = await getProjects();
    expect(before.map((p) => p.title)).toEqual(['existing']);

    // A new repo is created on GitHub → next fetch shows it too.
    vi.mocked(fetchRepositories).mockResolvedValueOnce([
      makeRepo({ id: 1, name: 'existing', topics: [] }),
      makeRepo({
        id: 2,
        name: 'brand-new',
        topics: [],
        updated_at: '2026-08-01T00:00:00Z',
      }),
    ]);
    const after = await getProjects();
    expect(after.map((p) => p.title)).toEqual(['brand-new', 'existing']);
  });

  it('respects an explicit portfolio.json priority over the topic default', async () => {
    vi.mocked(fetchRepositories).mockResolvedValue([
      makeRepo({
        id: 1,
        name: 'low-priority-pin',
        topics: ['featured'],
        updated_at: '2026-07-01T00:00:00Z',
      }),
      makeRepo({
        id: 2,
        name: 'high-priority-untagged',
        topics: [],
        updated_at: '2026-01-01T00:00:00Z',
      }),
    ]);
    vi.mocked(fetchMetadataForRepos).mockResolvedValue(
      new Map([[2, { priority: 0 }]]),
    );

    const projects = await getProjects();

    expect(projects.map((p) => p.title)).toEqual([
      'high-priority-untagged',
      'low-priority-pin',
    ]);
  });

  it('excludes repos hidden via portfolio.json', async () => {
    vi.mocked(fetchRepositories).mockResolvedValue([
      makeRepo({ id: 1, name: 'visible', topics: [] }),
      makeRepo({ id: 2, name: 'secret', topics: ['featured'] }),
    ]);
    vi.mocked(fetchMetadataForRepos).mockResolvedValue(
      new Map([[2, { hidden: true }]]),
    );

    const projects = await getProjects();

    expect(projects.map((p) => p.title)).toEqual(['visible']);
  });
});
