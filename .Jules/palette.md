## 2025-02-14 - Dynamic ARIA Labels in Mapped Collections
**Learning:** Icon-only links in mapped collections (like project cards) present an accessibility challenge when mapped to identical icons (e.g., GitHub logo). Screen readers cannot differentiate them without context-specific labels.
**Action:** Always inject dynamic identifiers (such as `project.title` or IDs) into `aria-label` and `title` attributes for mapped icon links to ensure unique context for assistive technologies.
