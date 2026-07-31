## 2026-07-31 - [High] Fix reverse tabnabbing vulnerabilities
**Vulnerability:** External links (`target="_blank"`) in several components only used `rel="noreferrer"` but missed the `noopener` attribute.
**Learning:** This exposes the application to a "reverse tabnabbing" attack where a maliciously crafted newly opened page can exploit the `window.opener` object to redirect the original application page, thereby launching phishing attacks.
**Prevention:** Always use `rel="noopener noreferrer"` when setting `target="_blank"` on links to ensure new browsing contexts cannot access the original window's context.
