/**
 * @typedef {object} ParsedReadme
 * @property {string|null}  title        – First `# Title` line
 * @property {string|null}  summary      – First non-empty paragraph after the title
 * @property {string[]}     features     – Items under `## Features` / `## Key Features`
 * @property {string[]}     techStack    – Items / text under `## Tech Stack` / `## Built With`
 * @property {string|null}  demo         – First URL found under `## Demo` / `## Links`
 * @property {string|null}  installation – Concatenated text under `## Installation`
 * @property {string[]}     architecture – Items / paragraphs under `## Architecture`
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strips markdown formatting from a line.
 *
 * Removes: bold (**), italic (*), inline code (`), images (![]()), links ([]()),
 * badges ([![...](...)]), and HTML tags.
 *
 * @param {string} text
 * @returns {string}
 */
function stripMarkdown(text) {
  return text
    // Remove badge patterns: [![...](...)]
    .replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '')
    // Remove images: ![alt](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links, keep text: [text](url) → text
    .replace(/\[([^\]]*?)\]\(.*?\)/g, '$1')
    // Remove inline code: `code`
    .replace(/`/g, '')
    // Remove bold/italic markers
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Returns `true` when the line is a badge image.
 *
 * @param {string} line
 * @returns {boolean}
 */
function isBadge(line) {
  return /\[!\[/.test(line) || /<img\b/.test(line) || line.includes('shields.io') || line.includes('badge');
}

// ---------------------------------------------------------------------------
// Section parsing
// ---------------------------------------------------------------------------

/**
 * Known section headings (case-insensitive).
 */
const KNOWN_SECTIONS = {
  features: ['features', 'key features', 'key-features', 'what it does'],
  techStack: ['tech stack', 'built with', 'technologies', 'technology stack', 'tools'],
  demo: ['demo', 'links', 'live demo', 'try it'],
  installation: ['installation', 'getting started', 'setup', 'quick start'],
  architecture: ['architecture', 'system design', 'how it works'],
};

/**
 * Identifies the section type from a heading line.
 *
 * @param {string} heading – e.g. "## Features"
 * @returns {string|null} Section type key, or null unknown.
 */
function identifySection(heading) {
  const lower = heading.replace(/^#+\s*/, '').trim().toLowerCase();

  for (const [key, aliases] of Object.entries(KNOWN_SECTIONS)) {
    if (aliases.includes(lower)) return key;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

/**
 * Parses a raw README.md string into structured data.
 *
 * The parser is intentionally simple — it uses line-based heuristics rather
 * than a full Markdown AST.  This keeps the bundle small and avoids
 * dependencies.  Unknown sections are silently ignored; missing sections
 * return `null` or `[]`.
 *
 * @param {string} markdown
 * @returns {ParsedReadme}
 */
export function parseReadme(markdown) {
  // -----------------------------------------------------------------------
  // Result accumulator
  // -----------------------------------------------------------------------
  /** @type {ParsedReadme} */
  const result = {
    title: null,
    summary: null,
    features: [],
    techStack: [],
    demo: null,
    installation: null,
    architecture: [],
  };

  const lines = markdown.split('\n');

  // -----------------------------------------------------------------------
  // Phase 1 — Extract title (first `# Title`)
  // -----------------------------------------------------------------------
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ') && !trimmed.startsWith('##')) {
      result.title = stripMarkdown(trimmed.replace(/^#\s+/, ''));
      break;
    }
  }

  // -----------------------------------------------------------------------
  // Phase 2 — Extract summary (first non-badge paragraph after title)
  // -----------------------------------------------------------------------
  let foundTitle = false;
  for (const line of lines) {
    const trimmed = line.trim();

    if (!foundTitle && trimmed.startsWith('# ')) {
      foundTitle = true;
      continue;
    }

    if (foundTitle && trimmed.length > 0 && !trimmed.startsWith('#') && !isBadge(trimmed)) {
      const cleaned = stripMarkdown(trimmed);
      if (cleaned.length > 20) {
        result.summary = cleaned;
        break;
      }
    }

    if (foundTitle && trimmed.startsWith('#')) break;
  }

  // -----------------------------------------------------------------------
  // Phase 3 — Parse sections
  // -----------------------------------------------------------------------
  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for new section heading
    if (trimmed.startsWith('##')) {
      const sectionKey = identifySection(trimmed);
      currentSection = sectionKey;
      continue;
    }

    if (!currentSection) continue;

    switch (currentSection) {
      case 'features': {
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const cleaned = stripMarkdown(trimmed.replace(/^[-*]\s+/, ''));
          if (cleaned.length > 0) result.features.push(cleaned);
        }
        break;
      }

      case 'techStack': {
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const cleaned = stripMarkdown(trimmed.replace(/^[-*]\s+/, ''));
          if (cleaned.length > 0) result.techStack.push(cleaned);
        } else if (trimmed.length > 0 && !trimmed.startsWith('#')) {
          // Also capture inline comma-separated tech names
          const cleaned = stripMarkdown(trimmed);
          if (cleaned.length > 2) {
            cleaned.split(/[,;]/).forEach((t) => {
              const name = t.trim();
              if (name.length > 0 && !result.techStack.includes(name)) {
                result.techStack.push(name);
              }
            });
          }
        }
        break;
      }

      case 'demo': {
        // Extract first URL from a link: [text](url)
        const linkMatch = trimmed.match(/\[([^\]]*?)\]\((https?:\/\/[^\s)]+)\)/);
        if (linkMatch && !result.demo) {
          result.demo = linkMatch[2];
        } else if (!result.demo) {
          // Fallback: any https? URL on its own line
          const urlMatch = trimmed.match(/(https?:\/\/[^\s)]+)/);
          if (urlMatch) result.demo = urlMatch[1];
        }
        break;
      }

      case 'installation': {
        if (trimmed.length > 0 && !trimmed.startsWith('#')) {
          const cleaned = stripMarkdown(trimmed);
          if (cleaned.length > 0) {
            result.installation = result.installation
              ? `${result.installation}\n${cleaned}`
              : cleaned;
          }
        }
        break;
      }

      case 'architecture': {
        if (trimmed.length > 0 && !trimmed.startsWith('#')) {
          const cleaned = stripMarkdown(trimmed);
          if (cleaned.length > 2) {
            result.architecture.push(cleaned);
          }
        }
        break;
      }

      default:
        break;
    }
  }

  return result;
}
