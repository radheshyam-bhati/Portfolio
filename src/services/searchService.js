import { buildKnowledgeBase } from './knowledgeService';

// ---------------------------------------------------------------------------
// Synonym map
// ---------------------------------------------------------------------------

/**
 * Canonical terms grouped by meaning.
 *
 * When a query contains any synonym, all terms in the group are also
 * searched. This bridges the gap between how someone asks a question
 * and how the data is worded.
 */
const SYNONYM_GROUPS = [
  new Set(['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural']),
  new Set(['react', 'reactjs', 'react-js']),
  new Set(['next', 'nextjs', 'next-js', 'next.js']),
  new Set(['node', 'nodejs', 'node-js', 'node.js']),
  new Set(['express', 'expressjs', 'express-js', 'express.js']),
  new Set(['js', 'javascript']),
  new Set(['ts', 'typescript']),
  new Set(['docker', 'container', 'containers']),
  new Set(['db', 'database', 'databases', 'sql', 'nosql']),
  new Set(['ui', 'frontend', 'front-end', 'front end']),
  new Set(['api', 'backend', 'back-end', 'back end']),
  new Set(['fullstack', 'full-stack', 'full stack']),
  new Set(['python', 'py']),
  new Set(['css', 'css3', 'styling']),
  new Set(['html', 'html5']),
  new Set(['tailwind', 'tailwindcss', 'tailwind-css', 'tailwind css']),
  new Set(['github', 'git']),
  new Set(['aws', 'amazon web services', 'cloud']),
  new Set(['app', 'application', 'software']),
  new Set(['learn', 'learning', 'lesson', 'lessons', 'what i learned']),
  new Set(['architecture', 'system design', 'design pattern']),
  new Set(['portfolio', 'project', 'projects']),
];

/** @type {Record<string, Set<string>>} */
const SYNONYM_MAP = {};

for (const group of SYNONYM_GROUPS) {
  for (const term of group) {
    if (!SYNONYM_MAP[term]) {
      SYNONYM_MAP[term] = new Set();
    }
    for (const other of group) {
      if (other !== term) SYNONYM_MAP[term].add(other);
    }
  }
}

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

/**
 * Breaks a text string into normalized tokens.
 *
 * Steps: lowercase → split on whitespace / punctuation → remove empty tokens.
 *
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[\s,.;:!?()[\]{}"'/\\|`~@#$%^&*+=<>]+/)
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Scoring weights
// ---------------------------------------------------------------------------

const WEIGHTS = {
  EXACT_TITLE_MATCH: 10,
  TITLE_CONTAINS: 8,
  TAG_MATCH: 6,
  SUMMARY_MATCH: 4,
  CONTENT_MATCH: 2,
  SYNONYM_MATCH: 1,
};

// ---------------------------------------------------------------------------
// Search implementation
// ---------------------------------------------------------------------------

/**
 * @typedef {import('./knowledgeService').SearchDocument} SearchDocument
 */

/**
 * Result returned when search has been performed.
 *
 * @typedef {object} SearchResult
 * @property {SearchDocument[]} items – Documents sorted by relevance (descending)
 * @property {number}           total – Total matching documents (before limit)
 */

/**
 * Searches the portfolio knowledge base for documents matching `query`.
 *
 * Algorithm:
 * 1. Tokenize the query into lowercase words
 * 2. Expand tokens with synonyms
 * 3. Score every document using field-boosted keyword matching
 * 4. Sort by score descending, then title alphabetically
 * 5. Return top N results
 *
 * When `query` is empty or shorter than 2 characters, returns all documents
 * (unsorted, up to limit). This allows the UI to show quick-link suggestions.
 *
 * The scoring function is intentionally simple — no TF-IDF, no embeddings.
 * It runs in under 20ms for typical portfolio sizes (50–200 documents) and
 * can be replaced entirely by an AI-backed search engine without changing
 * the hook or UI.
 *
 * @param {string} query
 * @param {{ limit?: number }} [options]
 * @param {number} [options.limit=20]
 * @returns {Promise<SearchResult>}
 */
export async function search(query, { limit = 20 } = {}) {
  const docs = await buildKnowledgeBase();
  const trimmed = query.trim();

  // Empty or very short query → return all docs up to limit
  if (trimmed.length < 2) {
    return {
      items: docs.slice(0, limit),
      total: docs.length,
    };
  }

  // 1. Tokenize query
  const queryTokens = tokenize(trimmed);

  // 2. Expand with synonyms
  const expandedTokens = new Set(queryTokens);
  for (const token of queryTokens) {
    const synonyms = SYNONYM_MAP[token];
    if (synonyms) {
      for (const syn of synonyms) {
        expandedTokens.add(syn);
      }
    }
  }

  // 3. Score each document
  const scored = [];

  for (const doc of docs) {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const summaryLower = (doc.summary || '').toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const tagSet = new Set(doc.tags.map((t) => t.toLowerCase()));

    for (const token of queryTokens) {
      // Exact title match (strongest signal)
      if (titleLower === token) {
        score += WEIGHTS.EXACT_TITLE_MATCH;
      } else if (titleLower.includes(token)) {
        score += WEIGHTS.TITLE_CONTAINS;
      }

      // Tag match
      if (tagSet.has(token)) {
        score += WEIGHTS.TAG_MATCH;
      }

      // Summary match
      if (summaryLower.includes(token)) {
        score += WEIGHTS.SUMMARY_MATCH;
      }

      // Content match
      if (contentLower.includes(token)) {
        score += WEIGHTS.CONTENT_MATCH;
      }

      // Synonym match (weaker signal — only if no direct match)
      const synonyms = SYNONYM_MAP[token];
      if (synonyms) {
        for (const syn of synonyms) {
          if (titleLower.includes(syn)) {
            score += WEIGHTS.SYNONYM_MATCH;
          } else if (tagSet.has(syn)) {
            score += WEIGHTS.SYNONYM_MATCH;
          } else if (summaryLower.includes(syn)) {
            score += WEIGHTS.SYNONYM_MATCH;
          }
        }
      }
    }

    if (score > 0) {
      scored.push({ ...doc, score });
    }
  }

  // 4. Sort: score descending, then title alphabetically
  scored.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.title.localeCompare(b.title);
  });

  // 5. Apply limit and return
  return {
    items: scored.slice(0, limit),
    total: scored.length,
  };
}
