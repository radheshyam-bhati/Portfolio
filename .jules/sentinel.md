## 2025-02-09 - Missing Input Length Limits
**Vulnerability:** The client-side contact form lacked native maximum length restrictions (`maxLength`), allowing an attacker to submit unbounded payloads that could cause Denial of Service (DoS) issues on the backend endpoint or intermediary services.
**Learning:** Even static client-side applications routing data to external endpoints must enforce maximum length constraints on all input fields to protect the destination APIs from memory exhaustion or oversized payloads.
**Prevention:** Implement backend validation checks to discard payloads exceeding safe thresholds, and define client-side `maxLength` attributes natively in the HTML/JSX forms to fail fast directly in the user's browser.
