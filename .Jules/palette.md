## 2025-05-18 - Dynamic ARIA Labels for Icon-Only Collection Links
**Learning:** Generic labels on icon-only links within mapped collections (like project cards) create ambiguous announcements for screen reader users when multiple instances exist on the same page.
**Action:** Use context-specific data, such as the `title` property of the iteration item (e.g., `project.title`), to dynamically populate the `aria-label` and `title` attributes on the links.
