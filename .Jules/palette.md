
## 2024-05-24 - Dynamic ARIA labels in repeating lists
**Learning:** Icon-only external links inside mapped components (like project cards) need dynamic context in their `aria-label`s (e.g. `aria-label="View ${project.title} on GitHub"`). Static labels like "View on GitHub" become indistinguishable for screen reader users when traversing a list of multiple projects.
**Action:** Always interpolate unique identifiers (like titles or IDs) into `aria-label`s when rendering interactive elements inside loops or `.map()` calls.
