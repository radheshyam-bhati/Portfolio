## 2025-03-01 - Content Security Policy (CSP) Header
**Vulnerability:** The static application lacked a Content Security Policy (CSP) header in `index.html`. This is a known security enhancement to mitigate Cross-Site Scripting (XSS) risks.
**Learning:** Adding a CSP header provides defense-in-depth by restricting the resources (scripts, styles, images) that the browser is allowed to load. Even for a static site, this is a critical protection mechanism against potential XSS attacks if any third-party script or dependency were ever compromised.
**Prevention:** Include a Content-Security-Policy meta tag in the `<head>` of `index.html` by default in all web applications.
