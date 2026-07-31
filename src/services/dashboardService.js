import { fetchAllRepositories, fetchUserProfile } from './githubService';
import { getProjects } from './projectService';
import { portfolioData } from '../data/portfolioData';
import { createCache } from '../utils/cache';
import {
  LANGUAGE_COLORS,
} from '../utils/githubMapper';
import {
  normaliseSkillName,
  isSkillName,
  categoryForSkillName,
  colorForCategory,
} from '../utils/topicNormalizer';

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

/**
 * @typedef {object} OverviewStats
 * @property {number} totalProjects
 * @property {number} totalStars
 * @property {number} totalForks
 * @property {number} totalRepos
 * @property {number} yearsCoding
 * @property {number} followers
 * @property {number} languagesUsed
 * @property {number} featuredProjects
 * @property {number} maintainedProjects
 */

/**
 * @typedef {object} LanguageStat
 * @property {string}  name
 * @property {number}  count      – Number of repositories using this language
 * @property {number}  percentage – Percentage of total language-using repos
 * @property {string}  color
 * @property {boolean} isTrending
 * @property {boolean} isRecent
 */

/**
 * @typedef {object} RepositoryMetrics
 * @property {import('./projectService').Project|null} mostStarred
 * @property {import('./projectService').Project|null} mostForked
 * @property {import('./projectService').Project|null} recentlyUpdated
 * @property {import('./projectService').Project|null} oldestProject
 */

/**
 * @typedef {object} TechnologyStat
 * @property {string} name
 * @property {number} count
 * @property {string} category
 * @property {string} color
 */

/**
 * @typedef {object} CategoryStat
 * @property {string} name
 * @property {number} count
 * @property {string} color
 * @property {number} percentage
 */

/**
 * @typedef {object} TimelineEvent
 * @property {string} date     – ISO date string for sorting
 * @property {string} title
 * @property {'project'|'education'|'certification'|'milestone'} type
 * @property {string} description
 * @property {string|null} link
 * @property {string} color
 */

/**
 * @typedef {object} Insights
 * @property {string} mostUsedTech
 * @property {string} longestMaintained
 * @property {string} newestProject
 * @property {string} oldestProject
 * @property {string} mostStarredProject
 * @property {string} largestProject
 * @property {string} mostActiveTech
 * @property {string} mostCommonStack
 */

/**
 * @typedef {object} DashboardModel
 * @property {OverviewStats}    overview
 * @property {LanguageStat[]}   languages
 * @property {RepositoryMetrics} repositoryMetrics
 * @property {TechnologyStat[]} technologies
 * @property {CategoryStat[]}   categories
 * @property {import('./projectService').Project[]} maintainedProjects
 * @property {TimelineEvent[]}  timeline
 * @property {Insights}         insights
 */

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

const dashboardCache = createCache({ ttl: 30 * 60 * 1000 });
const DASHBOARD_CACHE_KEY = 'dashboard';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Gets a deterministic colour for a language, falling back to a hash-based
 * colour for languages not in the known palette.
 *
 * @param {string} language
 * @returns {string}
 */
function colourForLanguage(language) {
  if (LANGUAGE_COLORS[language]) return LANGUAGE_COLORS[language];

  // Deterministic hash-based colour for unknown languages
  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

/**
 * Computes the engineering timeline from all available data sources.
 *
 * @param {import('./projectService').Project[]} projects
 * @param {import('./githubService').GitHubRepo[]} rawRepos
 * @returns {TimelineEvent[]}
 */
function buildTimeline(projects, rawRepos) {
  /** @type {TimelineEvent[]} */
  const events = [];

  // 1. Project creation events (from raw repo created_at)
  const repoCreatedMap = new Map();
  for (const repo of rawRepos) {
    repoCreatedMap.set(repo.name, repo.created_at);
  }

  for (const project of projects) {
    const createdDate = repoCreatedMap.get(project.repoName);
    if (createdDate) {
      events.push({
        date: createdDate,
        title: `Started ${project.title}`,
        type: 'project',
        description: project.summary || project.description || '',
        link: project.github,
        color: project.color,
      });
    }
  }

  // 2. Education events
  if (portfolioData?.education) {
    for (const edu of portfolioData.education) {
      // Parse the period to get a start date
      const startMatch = edu.period?.match(/(\d{4})/);
      const startYear = startMatch ? parseInt(startMatch[1], 10) : null;
      if (startYear) {
        events.push({
          date: `${startYear}-01-01`,
          title: edu.title,
          type: 'education',
          description: `${edu.institution} — ${edu.period}`,
          link: null,
          color: '#3b82f6',
        });
      }
    }
  }

  // 3. Certification events
  if (portfolioData?.certifications) {
    for (const cert of portfolioData.certifications) {
      // Parse the date string to ISO
      let isoDate = null;
      const dateMatch = cert.date?.match(/(\w+) (\d{4})/);
      if (dateMatch) {
        const months = {
          Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
          Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
        };
        const month = months[dateMatch[1]] || '01';
        isoDate = `${dateMatch[2]}-${month}-01`;
      }

      if (isoDate) {
        events.push({
          date: isoDate,
          title: cert.title,
          type: 'certification',
          description: `${cert.issuer}`,
          link: cert.link || null,
          color: cert.color || '#ef4444',
        });
      }
    }
  }

  // 4. Account creation milestone
  events.push({
    date: '2023-01-01',
    title: 'Started Coding Journey',
    type: 'milestone',
    description: 'Began exploring programming and software development.',
    link: null,
    color: '#f59e0b',
  });

  // Sort chronological (oldest first)
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return events;
}

/**
 * Computes auto-generated insights from the data.
 *
 * @param {import('./projectService').Project[]} projects
 * @param {TechnologyStat[]} technologies
 * @param {import('./githubService').GitHubRepo[]} rawRepos
 * @returns {Insights}
 */
function computeInsights(projects, technologies, rawRepos) {
  // Most used technology
  const mostUsedTech = technologies.length > 0
    ? technologies.reduce((a, b) => (a.count > b.count ? a : b)).name
    : '—';

  // Most active tech (appears in most repos)
  const mostActiveTech = technologies.length > 0
    ? technologies.reduce((a, b) => (a.count > b.count ? a : b)).name
    : '—';

  // Most common stack (category with most technologies)
  const categoryMap = new Map();
  for (const tech of technologies) {
    categoryMap.set(tech.category, (categoryMap.get(tech.category) || 0) + tech.count);
  }
  let mostCommonStack = '—';
  let maxCatCount = 0;
  for (const [cat, count] of categoryMap) {
    if (count > maxCatCount) {
      maxCatCount = count;
      mostCommonStack = cat;
    }
  }

  // Longest maintained project (largest time span from creation to now or last update)
  const repoCreatedMap = new Map();
  for (const repo of rawRepos) {
    repoCreatedMap.set(repo.name, repo.created_at);
  }

  let longestMaintained = '—';
  let longestSpan = 0;

  for (const project of projects) {
    const created = repoCreatedMap.get(project.repoName);
    if (created) {
      const createdMs = new Date(created).getTime();
      const updatedMs = new Date(project.updatedAt).getTime();
      const span = updatedMs - createdMs;
      if (span > longestSpan) {
        longestSpan = span;
        longestMaintained = project.title;
      }
    }
  }

  // Newest / oldest project
  let newest = '—';
  let oldest = '—';
  let newestDate = 0;
  let oldestDate = Infinity;

  for (const project of projects) {
    const created = repoCreatedMap.get(project.repoName);
    if (created) {
      const ms = new Date(created).getTime();
      if (ms > newestDate) {
        newestDate = ms;
        newest = project.title;
      }
      if (ms < oldestDate) {
        oldestDate = ms;
        oldest = project.title;
      }
    }
  }

  // Most starred project
  let mostStarred = '—';
  let maxStars = -1;
  for (const project of projects) {
    if (project.stars > maxStars) {
      maxStars = project.stars;
      mostStarred = project.title;
    }
  }

  // Largest project (most technologies/topics)
  let largestProject = '—';
  let maxTechs = -1;
  for (const project of projects) {
    const techCount = (project.technologies || []).length;
    if (techCount > maxTechs) {
      maxTechs = techCount;
      largestProject = project.title;
    }
  }

  return {
    mostUsedTech,
    longestMaintained,
    newestProject: newest,
    oldestProject: oldest,
    mostStarredProject: mostStarred,
    largestProject,
    mostActiveTech,
    mostCommonStack,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Builds the complete Engineering Dashboard by aggregating data from every
 * source in the portfolio.
 *
 * All analytics are computed once and cached. Subsequent calls within the TTL
 * return instantly.
 *
 * @returns {Promise<DashboardModel>}
 */
export async function buildDashboard() {
  const cached = dashboardCache.get(DASHBOARD_CACHE_KEY);
  if (cached) return cached;

  // Fetch all data sources in parallel
  const [projects, profile, rawRepos] = await Promise.all([
    getProjects(),
    fetchUserProfile().catch(() => null),
    fetchAllRepositories(),
  ]);

  // -----------------------------------------------------------------------
  // 1. Overview Stats
  // -----------------------------------------------------------------------

  // Years coding — from GitHub account creation or first repo
  let accountCreationYear = 2023; // Fallback
  if (profile?.created_at) {
    accountCreationYear = new Date(profile.created_at).getFullYear();
  } else if (rawRepos.length > 0) {
    const oldestRepo = rawRepos.reduce((a, b) =>
      new Date(a.created_at).getTime() < new Date(b.created_at).getTime() ? a : b,
    );
    accountCreationYear = new Date(oldestRepo.created_at).getFullYear();
  }
  const currentYear = new Date().getFullYear();
  const yearsCoding = Math.max(1, currentYear - accountCreationYear);

  // Maintained projects — updated within the last 3 months
  const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const maintainedProjects = projects.filter(
    (p) => new Date(p.updatedAt) > threeMonthsAgo,
  );

  // Count unique languages across all projects
  const languageSet = new Set(
    projects.map((p) => p.language).filter(Boolean),
  );

  const overview = {
    totalProjects: projects.length,
    totalStars: projects.reduce((sum, p) => sum + p.stars, 0),
    totalForks: projects.reduce((sum, p) => sum + p.forks, 0),
    totalRepos: rawRepos.length,
    yearsCoding,
    followers: profile?.followers ?? 0,
    languagesUsed: languageSet.size,
    featuredProjects: projects.filter((p) => p.featured).length,
    maintainedProjects: maintainedProjects.length,
  };

  // -----------------------------------------------------------------------
  // 2. Language Analytics
  // -----------------------------------------------------------------------

  /** @type {Map<string, number>} */
  const languageCount = new Map();
  for (const project of projects) {
    if (project.language) {
      languageCount.set(project.language, (languageCount.get(project.language) || 0) + 1);
    }
  }

  const totalLanguageRepos = [...languageCount.values()].reduce((a, b) => a + b, 0) || 1;

  // Determine trending language (most frequent among recently-updated repos)
  const recentThreshold = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const recentLangCount = new Map();
  for (const project of projects) {
    if (!project.language || new Date(project.updatedAt) <= recentThreshold) continue;
    recentLangCount.set(project.language, (recentLangCount.get(project.language) || 0) + 1);
  }
  const trendingLang = [...recentLangCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Determine recently used language (language of the most recently updated repo)
  const recentProject = projects.length > 0
    ? projects.reduce((a, b) =>
        new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime() ? a : b,
      )
    : null;
  const recentLang = recentProject?.language || null;

  /** @type {LanguageStat[]} */
  const languages = [...languageCount.entries()]
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalLanguageRepos) * 100),
      color: colourForLanguage(name),
      isTrending: name === trendingLang,
      isRecent: name === recentLang,
    }))
    .sort((a, b) => b.count - a.count);

  // -----------------------------------------------------------------------
  // 3. Repository Metrics
  // -----------------------------------------------------------------------

  /** @type {RepositoryMetrics} */
  const repositoryMetrics = {
    mostStarred: projects.length > 0
      ? projects.reduce((a, b) => (a.stars > b.stars ? a : b))
      : null,
    mostForked: projects.length > 0
      ? projects.reduce((a, b) => (a.forks > b.forks ? a : b))
      : null,
    recentlyUpdated: projects.length > 0
      ? projects.reduce((a, b) =>
          new Date(a.updatedAt).getTime() > new Date(b.updatedAt).getTime() ? a : b,
        )
      : null,
    oldestProject: projects.length > 0
      ? (() => {
          // Pre-build the createdAt map to avoid O(n²) lookups inside the sort
          const createdMap = new Map();
          for (const repo of rawRepos) {
            createdMap.set(repo.name, repo.created_at);
          }
          return [...projects]
            .filter((p) => createdMap.has(p.repoName))
            .sort(
              (a, b) =>
                new Date(createdMap.get(a.repoName) || 0).getTime() -
                new Date(createdMap.get(b.repoName) || 0).getTime(),
            )[0] || null;
        })()
      : null,
  };

  // -----------------------------------------------------------------------
  // 4. Technology Analytics (individual skills with counts)
  // -----------------------------------------------------------------------

  /** @type {Map<string, { count: number, category: string }>} */
  const techMap = new Map();

  for (const project of projects) {
    const techs = new Set([
      project.language,
      ...(project.technologies || []),
    ]);
    for (const tech of techs) {
      if (!tech) continue;
      const normalised = normaliseSkillName(tech);
      if (!isSkillName(normalised)) continue;
      const existing = techMap.get(normalised);
      if (existing) {
        existing.count += 1;
      } else {
        techMap.set(normalised, { count: 1, category: categoryForSkillName(normalised) });
      }
    }
  }

  /** @type {TechnologyStat[]} */
  const technologies = [...techMap.entries()]
    .map(([name, data]) => ({
      name,
      count: data.count,
      category: data.category,
      color: colorForCategory(data.category),
    }))
    .sort((a, b) => b.count - a.count);

  // -----------------------------------------------------------------------
  // 5. Category Analytics (grouped)
  // -----------------------------------------------------------------------

  /** @type {Map<string, { count: number, color: string }>} */
  const categoryMap = new Map();
  for (const tech of technologies) {
    const existing = categoryMap.get(tech.category);
    if (existing) {
      existing.count += tech.count;
    } else {
      categoryMap.set(tech.category, { count: tech.count, color: tech.color });
    }
  }

  const totalCategoryCount = [...categoryMap.values()].reduce((a, b) => a + b.count, 0) || 1;

  /** @type {CategoryStat[]} */
  const categories = [...categoryMap.entries()]
    .map(([name, data]) => ({
      name,
      count: data.count,
      color: data.color,
      percentage: Math.round((data.count / totalCategoryCount) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // -----------------------------------------------------------------------
  // 6. Timeline
  // -----------------------------------------------------------------------

  const timeline = buildTimeline(projects, rawRepos);

  // -----------------------------------------------------------------------
  // 7. Insights
  // -----------------------------------------------------------------------

  const insights = computeInsights(projects, technologies, rawRepos);

  // -----------------------------------------------------------------------
  // Assemble and cache
  // -----------------------------------------------------------------------

  /** @type {DashboardModel} */
  const dashboard = {
    overview,
    languages,
    repositoryMetrics,
    technologies,
    categories,
    maintainedProjects,
    timeline,
    insights,
  };

  dashboardCache.set(DASHBOARD_CACHE_KEY, dashboard);
  return dashboard;
}

/**
 * Clears the dashboard cache.
 */
export function clearDashboardCache() {
  dashboardCache.clear();
}
