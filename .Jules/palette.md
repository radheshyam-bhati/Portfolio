## 2024-04-29 - Interpolated ARIA Labels on Mapped Icons
**Learning:** Icon-only interactive elements (like anchor tags containing just Lucide React icons) placed inside mapped array loops create indistinguishable controls for screen reader users if standard `aria-label`s are used.
**Action:** When mapping over objects (like projects or certifications), always interpolate the object's title or ID into the `aria-label` (e.g., `aria-label={\`View \${project.title} on GitHub\`}`) so each link can be uniquely identified.
