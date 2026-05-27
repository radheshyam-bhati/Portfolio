## 2026-05-27 - Fix Tabnabbing Vulnerability
**Vulnerability:** External links with `target="_blank"` missing the `noopener` attribute (tabnabbing).
**Learning:** Found several external links missing `noopener`. This can be exploited to allow the newly opened tab to access the original window's `window.opener` object, leading to potential phishing attacks.
**Prevention:** Always use `rel="noopener noreferrer"` when using `target="_blank"` for external links.
