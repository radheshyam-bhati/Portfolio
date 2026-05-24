## 2024-05-24 - Tabnabbing Vulnerability in External Links
**Vulnerability:** Several anchor tags using `target="_blank"` were found missing the `noopener` attribute (they only had `rel="noreferrer"` or neither).
**Learning:** This is a well-known tabnabbing vulnerability where a newly opened tab can gain control of the original window's `window.opener` object, potentially redirecting the user to a phishing site. While modern browsers (Chrome 88+) implicitly set `noopener` for `target="_blank"`, explicitly setting `rel="noopener noreferrer"` ensures protection across all browsers and is required for security compliance.
**Prevention:** Always include `rel="noopener noreferrer"` when using `target="_blank"` on anchor tags.
