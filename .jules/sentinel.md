## 2024-05-24 - [Tabnabbing Vulnerability via target="_blank" without noopener]
**Vulnerability:** Several links in `src/components/` use `target="_blank"` with `rel="noreferrer"` but missing `noopener`. This leaves the site open to reverse tabnabbing vulnerabilities, where the newly opened page can access `window.opener` and potentially redirect the original site to a malicious page.
**Learning:** React elements with `target="_blank"` should always use `rel="noopener noreferrer"` to prevent the opened tab from having access to `window.opener`. This is a classic security gap often missed during refactoring or component creation.
**Prevention:** Always pair `target="_blank"` with `rel="noopener noreferrer"`. Ensure linting tools or automated checks are in place to catch this pattern.
