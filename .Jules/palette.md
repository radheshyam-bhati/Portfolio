## 2024-05-20 - Dynamic ARIA Labels in Lists
**Learning:** When rendering icon-only interactive elements inside mapped arrays (like project links), static `aria-label`s fail to distinguish the links for screen reader users.
**Action:** Always interpolate unique identifiers (such as item titles) into `aria-label` attributes inside loops to maintain distinguishable and accessible navigation paths.
