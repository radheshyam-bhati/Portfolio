## 2026-04-19 - [A11y: Interpolated ARIA Labels for Mapped Lists]
**Learning:** Icon-only interactive elements (like anchor tags with GitHub/ExternalLink icons) within mapped arrays require unique identification for screen reader users. Hardcoded aria-labels (e.g., 'GitHub') result in multiple identical links on the page, creating poor navigation experience.
**Action:** Always interpolate unique identifiers (such as `${item.title}`) into the `aria-label` for elements rendered within loops/maps to maintain semantic distinguishability.
