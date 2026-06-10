## 2026-06-10 - Accessible Icon-Only Links in Dynamic Components
**Learning:** When mapping over items to generate UI components containing icon-only links (e.g., project grids), missing accessible labels create identical, indistinguishable links for screen reader users. Redundant generic `aria-label` attributes are insufficient.
**Action:** Always inject unique, context-aware information (like the item's title) into both `aria-label` and `title` attributes (e.g., `Visit ${project.title} live site`) for mapped icon links. This ensures unique identification and provides native tooltips.
