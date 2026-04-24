## 2024-05-15 - Unique ARIA Labels in Mapped Elements
**Learning:** Screen reader users can struggle to distinguish between generic icon-only buttons (like "GitHub" or "Live Demo") when they appear multiple times on a page (e.g., inside mapped project cards).
**Action:** Always interpolate a unique identifier (like the item title) into the `aria-label` for interactive elements inside loops (e.g., `aria-label={"GitHub repository for " + project.title}`).
