## 2025-02-23 - Dynamic ARIA Labels for Mapped Lists
**Learning:** When adding ARIA labels to icon-only links within dynamically mapped components (like `Projects.jsx`), appending the unique item name (e.g., `aria-label={\`View \${project.title} live demo\`}`) is essential to prevent multiple identical screen reader announcements ("View live demo") across different projects.
**Action:** Always include item-specific identifying text inside `aria-label`s for interactive elements rendered inside `.map()` loops.
