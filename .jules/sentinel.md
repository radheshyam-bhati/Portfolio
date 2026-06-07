## 2025-06-07 - Tabnabbing Vulnerability
**Vulnerability:** Found `target="_blank"` missing `rel="noopener noreferrer"` throughout multiple React components and `legacy/index.html`.
**Learning:** React components containing links opening in new tabs (`target="_blank"`) expose users to reverse tabnabbing, allowing the newly opened page to potentially execute arbitrary scripts within the originating page's context.
**Prevention:** Always append `rel="noopener noreferrer"` to external links using `target="_blank"`.
