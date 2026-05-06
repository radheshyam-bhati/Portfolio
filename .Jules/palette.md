## 2026-05-06 - Focus indicators for links
**Learning:** The custom cursor component does not currently highlight the focused states of the interactive elements, which is important for keyboard navigation and screen readers.
**Action:** Add focus indicators to elements to improve keyboard accessibility.
## 2026-05-06 - Disambiguating Array Items for Screen Readers
**Learning:** When rendering repetitive icon-only links (e.g., GitHub/External links in a project grid) using `.map()`, a generic `aria-label` like "View GitHub" causes screen readers to announce identical text for every item on the page, removing context.
**Action:** Always interpolate unique identifiers (such as the item's title) into the `aria-label` for mapped interactive elements (e.g., `aria-label={`View ${project.title} on GitHub`}`) to ensure links remain distinguishable and meaningful out of context.
