## 2025-02-28 - [Tabnabbing vulnerabilities]
**Vulnerability:** External links with `target="_blank"` missing `rel="noopener noreferrer"` across multiple React components, leading to potential tabnabbing attacks.
**Learning:** React elements with `target="_blank"` without proper `rel` attributes can expose users to reverse tabnabbing vulnerabilities. Found these in `src/components/Projects.jsx`, `src/components/Certifications.jsx`, `src/components/Contact.jsx`, and `src/components/Navbar.jsx`.
**Prevention:** Always include `rel="noopener noreferrer"` when using `target="_blank"` for external links to ensure the new tab runs in a separate process without access to the `window.opener` object.
