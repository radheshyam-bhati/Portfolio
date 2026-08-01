import { describe, it, expect } from 'vitest';
import { aggregateAndGroup } from './skillService';
import { curatedSkills } from '../data/portfolioData';

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
  language: 'JavaScript',
  topics: [],
  ...overrides,
});

const pythonRepo = makeRepo({ id: 1, name: 'python-repo', language: 'Python', topics: ['fastapi'] });
const jsRepo = makeRepo({ id: 2, name: 'js-repo', language: 'JavaScript', topics: ['react'] });

// ---------------------------------------------------------------------------
// Curated baseline merge
// ---------------------------------------------------------------------------

describe('aggregateAndGroup — curated baseline', () => {
  it('always includes the curated skill list even when no repos are fetched', () => {
    const groups = aggregateAndGroup([]);
    const allNames = groups.flatMap((g) => g.items);

    // Every curated skill must be present (never empty even with zero repos).
    for (const skill of curatedSkills) {
      expect(allNames).toContain(skill);
    }
  });

  it('does not duplicate a skill that is both curated and GitHub-derived', () => {
    const groups = aggregateAndGroup([jsRepo]);
    const jsCount = groups
      .flatMap((g) => g.items)
      .filter((name) => name === 'JavaScript').length;
    expect(jsCount).toBe(1);
  });

  it('merges GitHub-derived languages on top of the curated baseline', () => {
    const groups = aggregateAndGroup([pythonRepo]);
    const allNames = groups.flatMap((g) => g.items);

    // Curated skills still present...
    for (const skill of curatedSkills) {
      expect(allNames).toContain(skill);
    }

    // ...and GitHub-detected ones (Python, FastAPI) are merged in.
    expect(allNames).toContain('Python');
    expect(allNames).toContain('FastAPI');
  });

  it('categories curated skills into their expected groups', () => {
    const groups = aggregateAndGroup([]);
    const groupByCategory = new Map(groups.map((g) => [g.category, g.items]));

    expect(groupByCategory.get('Programming Languages')).toEqual(
      expect.arrayContaining(['Python', 'C', 'C++', 'Java', 'JavaScript']),
    );
    expect(groupByCategory.get('Database')).toEqual(
      expect.arrayContaining(['PostgreSQL', 'MySQL', 'IndexedDB', 'LocalStorage']),
    );
    expect(groupByCategory.get('AI & Data')).toEqual(
      expect.arrayContaining(['OpenAI API', 'Power BI', 'Data Analysis', 'Dashboarding']),
    );
    expect(groupByCategory.get('Concepts')).toEqual(
      expect.arrayContaining(['OOP', 'DSA', 'REST APIs', 'Client-Side Architecture', 'Agile Development']),
    );
    expect(groupByCategory.get('Tools')).toEqual(
      expect.arrayContaining(['Git', 'GitHub', 'VS Code', 'GSAP', 'Lenis', 'Linux', 'GitHub Pages']),
    );
  });

  it('sorts GitHub-derived skills by frequency ahead of zero-count curated ones', () => {
    const groups = aggregateAndGroup([
      makeRepo({ id: 1, language: 'JavaScript' }),
      makeRepo({ id: 2, language: 'JavaScript' }),
    ]);
    const programming = groups.find((g) => g.category === 'Programming Languages');
    expect(programming.items[0]).toBe('JavaScript');
  });
});
