## 2026-08-02 - Missing noopener on target="_blank" links
**Vulnerability:** External links using `target="_blank"` were missing the `noopener` attribute (they only had `noreferrer`).
**Learning:** Without `noopener`, newly opened tabs can access the `window.opener` object of the original page, which can be exploited for reverse tabnabbing (phishing). This is a recurring issue in React components.
**Prevention:** Always append `noopener` to `target="_blank"` links alongside `noreferrer`.
