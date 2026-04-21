## 2024-04-21 - Reverse Tabnabbing Vulnerability
**Vulnerability:** External links (`target="_blank"`) in `Projects.jsx`, `Certifications.jsx`, `Contact.jsx`, and `Navbar.jsx` only had `rel="noreferrer"`.
**Learning:** Omission of `noopener` on `target="_blank"` links creates a potential reverse tabnabbing vulnerability, where the newly opened page can gain access to the original page's `window` object via `window.opener` and potentially navigate it to a malicious URL.
**Prevention:** Always ensure that any anchor tag (`<a>`) using `target="_blank"` explicitly includes `rel="noopener noreferrer"` to fully isolate the new context and mitigate reverse tabnabbing.
