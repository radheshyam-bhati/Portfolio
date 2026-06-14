## 2024-06-14 - Initialize Palette Journal\n**Learning:** Started tracking UX/a11y insights for the portfolio.\n**Action:** Will document critical learnings here.

## 2024-06-14 - Icon-Only Link Context
**Learning:** Icon-only links in mapped collections (like project cards) need dynamic context. A generic 'GitHub' aria-label creates ambiguity for screen reader users when there are multiple projects.
**Action:** Always include the item's identifying property (e.g., project.title) in both `aria-label` and `title` for mapped icon-only links to provide clear, distinguishable context for both screen readers and mouse users.
