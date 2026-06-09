## 2025-06-09 - Add Input Length Limits to Contact Form
**Vulnerability:** Missing explicit maximum input length limits on client-side form fields in `src/utils/contactForm.js` and `src/components/Contact.jsx` (DoS risk against downstream services).
**Learning:** Client-side forms must strictly enforce explicit maximum input length limits on user-provided fields to prevent potential Denial of Service (DoS) payloads against downstream services or endpoints.
**Prevention:** Enforce input length limits (e.g., `MAXIMUM_NAME_LENGTH`, `MAXIMUM_MESSAGE_LENGTH`) at both the DOM level (via `maxLength` attributes) and the JS validation logic level.
