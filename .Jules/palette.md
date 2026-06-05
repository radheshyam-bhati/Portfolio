## 2026-06-05 - Add context to icon-only project links
**Learning:** Icon-only links within mapped collections (like project cards) require dynamic, context-specific labels (e.g., "View [Project Title] on GitHub" rather than just "GitHub Link") so screen reader users can distinguish between multiple identical icons on the same page.
**Action:** Always inject unique identifying context (like the item title or ID) into `aria-label` and `title` attributes when rendering repetitive icon-only actions inside lists or grids.
