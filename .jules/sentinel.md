## 2026-06-14 - Add Input Length Validation
**Vulnerability:** Missing input length validation in the contact form, exposing potential Denial of Service (DoS) risks where an attacker can submit massive payloads.
**Learning:** Client-side static forms that forward payloads to downstream services need strict limits because there is no immediate backend server to drop the heavy requests.
**Prevention:** Enforce strict client-side limits such as MAXIMUM_NAME_LENGTH and MAXIMUM_MESSAGE_LENGTH before executing submission logic.
