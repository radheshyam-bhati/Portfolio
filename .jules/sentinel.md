## 2025-06-11 - Unbounded Form Inputs DoS Risk
**Vulnerability:** The contact form inputs (name, email, message) lacked client-side and server-side length limits, exposing the downstream `formsubmit.co` API to potential Denial of Service (DoS) payloads via excessively large submissions.
**Learning:** Even static client-side forms without a direct backend must enforce data length limits to protect third-party integration endpoints from abuse and ensure UI stability.
**Prevention:** Always define and enforce explicit `maxLength` attributes on input/textarea elements and validate maximum lengths in form validation utilities before payload construction.
