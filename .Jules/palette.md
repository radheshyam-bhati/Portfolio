## 2026-04-28 - Mapped Icon-Only Links Require Unique ARIA Labels
**Learning:** When rendering icon-only links (e.g., GitHub or external link icons) inside a mapped array or list (like a projects grid), static `aria-label`s like "GitHub" become confusing for screen reader users because they encounter multiple identical labels without context.
**Action:** Always interpolate unique identifiers (such as the item title) into the `aria-label` when mapping over data to generate interactive elements (e.g., `aria-label={\`GitHub repository for \${project.title}\`}`).
