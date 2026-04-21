## 2024-04-21 - Accessible Mapped Icon Links
**Learning:** When rendering icon-only interactive elements (like anchor tags) inside a loop (`.map()`), using generic aria-labels like "View Source" makes them indistinguishable for screen reader users (e.g., hearing "View Source" repeatedly).
**Action:** Always interpolate a unique identifier, such as the item title (`aria-label={\`View GitHub repository for \${project.title}\`}`), into the aria-label to provide clear, actionable context.
