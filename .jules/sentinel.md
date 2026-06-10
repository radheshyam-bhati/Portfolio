## 2025-02-12 - [DoS Prevention via Input Length Limits]
**Vulnerability:** Missing maximum input length limits on user-provided fields in the contact form, creating a potential Denial of Service (DoS) risk for downstream services or endpoints.
**Learning:** Client-side forms must strictly enforce explicit maximum input length limits on user-provided fields to prevent overly large payloads from being processed or transmitted.
**Prevention:** Implement explicit maximum length constraints (e.g., MAXIMUM_NAME_LENGTH, MAXIMUM_MESSAGE_LENGTH) during input validation alongside existing minimum length checks.
