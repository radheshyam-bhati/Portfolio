## 2026-04-20 - [Hardcoded Emails]
**Vulnerability:** Hardcoded email address in `src/data/portfolioData.js`.
**Learning:** Hardcoded emails can be easily scraped by spam bots, leading to spam and phishing attacks. It also violates the repository's security conventions against hardcoded sensitive contact info.
**Prevention:** Use environment variables (e.g., `import.meta.env.VITE_PORTFOLIO_EMAIL`) or Base64 obfuscation (`atob()`) as a fallback to prevent easy scraping of email addresses from the source code. Document required environment variables in a `.env.example` file.
