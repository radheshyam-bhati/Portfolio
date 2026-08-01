import { fetchAllRepositories } from './githubService';
import { curatedSkills } from '../data/portfolioData';
import {
  normaliseSkillName,
  isSkillName,
  categoryForSkillName,
  colorForCategory,
  CATEGORY_ORDER,
} from '../utils/topicNormalizer';

/**
 * @typedef {object} SkillItem
 * @property {string} name
 * @property {number} count
 * @property {string} category
 */

/**
 * @typedef {object} SkillGroup
 * @property {string} category
 * @property {string} color
 * @property {string[]} items
 */

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches ALL public repositories and aggregates their languages and topics
 * into a categorised, deduplicated, frequency-scored skill list.
 *
 * @returns {Promise<SkillGroup[]>}
 * @throws {Error} When the underlying GitHub request fails.
 */
export async function getSkills() {
  const repos = await fetchAllRepositories();
  return aggregateAndGroup(repos);
}

/**
 * Aggregates skills from a list of repositories, then groups + sorts them.
 *
 * Separated from `getSkills` so it can be reused if the repo list comes from
 * a different source in the future.
 *
 * @param {import('./githubService').GitHubRepo[]} repos
 * @returns {SkillGroup[]}
 */
export function aggregateAndGroup(repos) {
  // -----------------------------------------------------------------------
  // 1. Collect raw skill names from languages + topics
  // -----------------------------------------------------------------------
  /** @type {Map<string, Set<number>>} */
  const repoCount = new Map();

  for (const repo of repos) {
    if (repo.language) {
      const normalised = normaliseSkillName(repo.language);
      if (isSkillName(normalised)) {
        if (!repoCount.has(normalised)) {
          repoCount.set(normalised, new Set());
        }
        repoCount.get(normalised).add(repo.id);
      }
    }

    const topics = repo.topics ?? [];
    for (const topic of topics) {
      const normalised = normaliseSkillName(topic);
      if (isSkillName(normalised)) {
        if (!repoCount.has(normalised)) {
          repoCount.set(normalised, new Set());
        }
        repoCount.get(normalised).add(repo.id);
      }
    }
  }

  // -----------------------------------------------------------------------
  // 1b. Seed the curated baseline so the section is never empty and always
  //     shows the owner's guaranteed skill list, merged with whatever GitHub
  //     auto-detects. Curated names get an empty repo-set (count 0) unless a
  //     repo already contributes them, so real usage always ranks higher.
  // -----------------------------------------------------------------------
  for (const rawName of curatedSkills) {
    const normalised = normaliseSkillName(rawName);
    if (isSkillName(normalised) && !repoCount.has(normalised)) {
      repoCount.set(normalised, new Set());
    }
  }

  // -----------------------------------------------------------------------
  // 2. Build SkillItem[] from the map
  // -----------------------------------------------------------------------
  /** @type {SkillItem[]} */
  const skills = [];

  for (const [name, repoIds] of repoCount) {
    skills.push({
      name,
      count: repoIds.size,
      category: categoryForSkillName(name),
    });
  }

  // -----------------------------------------------------------------------
  // 3. Group by category
  // -----------------------------------------------------------------------
  /** @type {Map<string, SkillItem[]>} */
  const grouped = new Map();

  for (const skill of skills) {
    const group = grouped.get(skill.category);
    if (group) {
      group.push(skill);
    } else {
      grouped.set(skill.category, [skill]);
    }
  }

  // -----------------------------------------------------------------------
  // 4. Sort within each category: highest count first, alphabetical tiebreak
  // -----------------------------------------------------------------------
  /** @type {SkillGroup[]} */
  const result = [];

  for (const category of CATEGORY_ORDER) {
    const items = grouped.get(category);
    if (!items || items.length === 0) continue;

    items.sort((a, b) => {
      if (a.count !== b.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });

    result.push({
      category,
      color: colorForCategory(category),
      items: items.map((s) => s.name),
    });
  }

  return result;
}
