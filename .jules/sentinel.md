## 2026-05-31 - Add input length limits to contact form
**Vulnerability:** The contact form lacked maximum length limits for the name, email, and message fields, which could allow a malicious user to submit excessively large payloads, potentially leading to resource exhaustion or denial of service (DoS) conditions on the backend or email service.
**Learning:** Even client-side static forms need basic defense-in-depth protections like payload size limits before sending data to third-party services like FormSubmit.
**Prevention:** Always implement realistic upper bounds for user input (e.g., 100 for name, 254 for email, 5000 for message) alongside standard pattern validation.
