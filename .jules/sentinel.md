## 2026-06-02 - Add input length limits to contact form
**Vulnerability:** The contact form allowed user inputs without any maximum length restrictions. This lack of bounds could lead to excessive resource consumption or potential Denial of Service (DoS) attacks by sending large payloads to the form submission endpoint.
**Learning:** Even client-side static sites must strictly enforce input constraints before making external API requests, as missing validation can be exploited to generate massive requests or negatively impact downstream services (like FormSubmit in this context).
**Prevention:** Always define explicit  constants and apply both lower and upper bounds validation checks to all user-provided input fields in web forms before processing or transmitting the data.
## 2026-06-02 - Add input length limits to contact form
**Vulnerability:** The contact form allowed user inputs without any maximum length restrictions. This lack of bounds could lead to excessive resource consumption or potential Denial of Service (DoS) attacks by sending large payloads to the form submission endpoint.
**Learning:** Even client-side static sites must strictly enforce input constraints before making external API requests, as missing validation can be exploited to generate massive requests or negatively impact downstream services (like FormSubmit in this context).
**Prevention:** Always define explicit maximum length constants and apply both lower and upper bounds validation checks to all user-provided input fields in web forms before processing or transmitting the data.
