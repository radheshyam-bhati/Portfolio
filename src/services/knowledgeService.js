import { getProjects } from './projectService';
import { getSkills } from './skillService';
import { getProfile } from './profileService';
import { portfolioData } from '../data/portfolioData';
import { createCache } from '../utils/cache';

/**
 * @typedef {object} SearchDocument
 * @property {string}   id
 * @property {'project'|'skill'|'profile'|'education'|'certification'} type
 * @property {string}   title
 * @property {string}   summary     – Short description, ideal for result previews
 * @property {string}   content     – Full text used for keyword matching
 * @property {string[]} tags
 * @property {number}   score       – Computed during search; 0 before ranking
 * @property {object}   metadata    – Type-specific payload for linking/navigation
 * @property {number}  [metadata.projectId]
 * @property {string}  [metadata.category]
 * @property {string}  [metadata.color]
 * @property {string}  [metadata.repoName]
 * @property {string}  [metadata.defaultBranch]
 * @property {string}  [metadata.issuer]
 * @property {string}  [metadata.institution]
 * @property {string}  [metadata.badgeUrl]
 */

// ---------------------------------------------------------------------------
// Cache — the knowledge base is built once and memoized
// ---------------------------------------------------------------------------

const kbCache = createCache({ ttl: 30 * 60 * 1000 });
const KB_CACHE_KEY = 'knowledge_base';

// ---------------------------------------------------------------------------
// Builders for each data source
// ---------------------------------------------------------------------------

/**
 * @param {import('./projectService').Project} project
 * @returns {SearchDocument}
 */
function buildProjectDoc(project) {
  const content = [
    project.title,
    project.description,
    project.summary,
    ...(project.technologies || []),
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: `project:${project.id}`,
    type: 'project',
    title: project.title,
    summary: project.summary || project.description || project.title,
    content,
    tags: [...(project.technologies || []), project.language, project.category].filter(Boolean),
    score: 0,
    metadata: {
      projectId: project.id,
      color: project.color,
      repoName: project.repoName,
      defaultBranch: project.defaultBranch,
      category: project.category,
    },
  };
}

/**
 * @param {import('./skillService').SkillGroup} group
 * @returns {SearchDocument[]}
 */
function buildSkillDocs(group) {
  return group.items.map((skillName) => ({
    id: `skill:${skillName}`,
    type: 'skill',
    title: skillName,
    summary: `${skillName} — ${group.category}`,
    content: `${skillName} ${group.category}`,
    tags: [skillName, group.category, 'skill'],
    score: 0,
    metadata: { category: group.category, color: group.color },
  }));
}

/**
 * @param {import('./profileService').Profile} profile
 * @returns {SearchDocument[]}
 */
function buildProfileDocs(profile) {
  const docs = [];

  // Main profile document
  docs.push({
    id: 'profile:main',
    type: 'profile',
    title: profile.name,
    summary: profile.bio || '',
    content: [
      profile.name,
      profile.bio,
      profile.location,
      profile.company,
      `@${profile.twitter}`,
      `${profile.followers} followers`,
      `${profile.publicRepos} repositories`,
    ]
      .filter(Boolean)
      .join(' '),
    tags: ['profile', 'about', 'bio', profile.location].filter(Boolean),
    score: 0,
    metadata: { avatar: profile.avatar, profileUrl: profile.profileUrl },
  });

  return docs;
}

/**
 * @param {import('../data/portfolioData').Education} edu
 * @returns {SearchDocument}
 */
function buildEducationDoc(edu) {
  const points = (edu.points || []).join(' ');
  return {
    id: `education:${edu.title}`,
    type: 'education',
    title: edu.title,
    summary: `${edu.institution} — ${edu.period}`,
    content: `${edu.title} ${edu.institution} ${edu.period} ${edu.description || ''} ${points}`,
    tags: ['education', edu.institution].filter(Boolean),
    score: 0,
    metadata: { institution: edu.institution, period: edu.period },
  };
}

/**
 * @param {import('../data/portfolioData').Certification} cert
 * @returns {SearchDocument}
 */
function buildCertificationDoc(cert) {
  return {
    id: `cert:${cert.id}`,
    type: 'certification',
    title: cert.title,
    summary: `${cert.issuer} — ${cert.date}`,
    content: `${cert.title} ${cert.issuer} ${cert.date}`,
    tags: ['certification', cert.issuer].filter(Boolean),
    score: 0,
    metadata: { issuer: cert.issuer, date: cert.date, badgeUrl: cert.link },
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Builds the complete knowledge base by gathering data from every source.
 *
 * Results are cached so subsequent calls within the TTL are instant.
 *
 * @returns {Promise<SearchDocument[]>}
 */
export async function buildKnowledgeBase() {
  const cached = kbCache.get(KB_CACHE_KEY);
  if (cached) return cached;

  /** @type {SearchDocument[]} */
  const docs = [];

  // 1. Projects
  try {
    const projects = await getProjects();
    for (const project of projects) {
      docs.push(buildProjectDoc(project));
    }
  } catch {
    // Silently skip projects if they fail
  }

  // 2. Skills
  try {
    const skills = await getSkills();
    for (const group of skills) {
      docs.push(...buildSkillDocs(group));
    }
  } catch {
    // Silently skip
  }

  // 3. Profile (prefer live, fall back to portfolioData)
  try {
    const profile = await getProfile();
    docs.push(...buildProfileDocs(profile));
  } catch {
    // Fallback: build from hardcoded portfolioData
    if (portfolioData?.personalInfo) {
      docs.push({
        id: 'profile:main',
        type: 'profile',
        title: portfolioData.personalInfo.name,
        summary: portfolioData.personalInfo.tagline || '',
        content: `${portfolioData.personalInfo.name} ${portfolioData.personalInfo.tagline || ''} ${portfolioData.personalInfo.location || ''}`,
        tags: ['profile', 'about'].filter(Boolean),
        score: 0,
        metadata: {
          profileUrl: portfolioData.personalInfo.github,
        },
      });
    }
  }

  // 4. Education
  if (portfolioData?.education) {
    for (const edu of portfolioData.education) {
      docs.push(buildEducationDoc(edu));
    }
  }

  // 5. Certifications
  if (portfolioData?.certifications) {
    for (const cert of portfolioData.certifications) {
      docs.push(buildCertificationDoc(cert));
    }
  }

  kbCache.set(KB_CACHE_KEY, docs);
  return docs;
}

/**
 * Clears the knowledge base cache.
 */
export function clearKnowledgeBase() {
  kbCache.clear();
}
