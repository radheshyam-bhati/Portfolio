## 2026-05-01 - Dynamic ARIA labels for mapped lists
**Learning:** When rendering icon-only interactive elements (like links or buttons) inside a mapped array or list, static ARIA labels are insufficient. Screen reader users need to distinguish between multiple identical icons. Interpolating unique identifiers (such as the item's title) into the `aria-label` (e.g., `aria-label={\`View GitHub repository for ${project.title}\`}`) is necessary for accessibility.
**Action:** Always verify that `aria-label` attributes on elements inside loops or maps contain unique, descriptive text.
