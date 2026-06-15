## 2024-06-15 - Dynamic Context for Icon-Only Links in Mapped Data
**Learning:** When rendering multiple identical icon-only links inside mapped components (like project cards with GitHub/Live Demo icons), static `aria-label`s create a poor screen reader experience because users cannot distinguish which project the link belongs to when tabbing through them.
**Action:** Always inject dynamic identifiers (e.g., `${item.title}`) into `aria-label` and `title` attributes for repeated icon-only links to ensure distinct, context-rich accessible names and native tooltips.
