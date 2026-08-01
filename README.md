# Portfolio
> A motion-rich React/Vite portfolio for showcasing projects, education, certifications, and contact details.

![Badges: build-passing, license-private, version-0.0.0](https://img.shields.io/badge/build-passing-22c55e) ![Version](https://img.shields.io/badge/version-0.0.0-2563eb) ![License](https://img.shields.io/badge/license-private-64748b)

## Table of Contents
- [Features](#features)
- [Manage Content Without Code](#manage-content-without-code)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage / Quick Start](#usage--quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Features
- Animated hero, skills, projects, education, certifications, and contact sections.
- Deterministic floating particle effects for stable rendering across re-renders.
- Reduced-motion friendly preloader and scroll progress behavior.
- Contact form integration through FormSubmit with client-side validation and request cleanup.
- Responsive navigation and custom cursor interactions for fine-pointer devices.
- GitHub auto-sync: **every public repo appears in the Projects section automatically** (no topic tag needed). Tag a repo with the `featured` or `portfolio` topic to *pin* it to the top of the section.
- Projects section shows the **first 6 projects** by default with a **"See all projects"** toggle to expand/collapse the full list — keeps the page fast and focused.
- Per-project detail views show a top-5 language breakdown (lazy-fetched, cached) and a live-demo link + description when a deployment is declared via the repo `homepage` or `portfolio.json` `demo`.
- Manual refresh control on the Projects section to bypass the 30-minute cache.
- Technical Skills auto-populates from repo languages/topics and always includes a curated baseline list (edit `curatedSkills` in `src/data/portfolioData.js`).
- Security-hardened by default: strict Content Security Policy, Referrer-Policy, an error boundary (the site never white-screens), global error handlers, and an anti-spam contact form (honeypot + rate limiting + input sanitization).

## Manage Content Without Code

Every project card is sourced from a GitHub repo, so you can add, remove, and
customize projects — and their languages — without touching this codebase.

### Add / remove a project
| Action | How |
| --- | --- |
| **Add a project** | Every public repo appears automatically. To *pin* it to the top, tag it with the `featured` (or `portfolio`) topic on GitHub. |
| **Remove a project** | Add a `portfolio.json` to the repo with `"hidden": true`, or add the repo name to `projectOverrides` in `src/data/portfolioData.js` with `hidden: true`. |
| **Reorder projects** | Set `"priority"` in the repo's `portfolio.json` (lower = earlier), or tag with `featured`/`portfolio` to pin to the top.

> 💡 A ready-to-copy template with **every** supported field is available at
> [`portfolio.example.json`](./portfolio.example.json) in this repo. Copy it into
> any GitHub repo and **replace the placeholder strings** with your own values.

### Description, live demo & category
Add a `portfolio.json` file to the repo's root:

```json
{
  "description": "AI-powered restaurant discovery platform.",
  "demo": "https://intellidine.vercel.app",
  "category": "AI & Web",
  "priority": 1
}
```

> The repo's own description and homepage (website field) on GitHub are also
> picked up automatically — no `portfolio.json` needed for those.

### Add / remove languages
- **Detected languages** (from GitHub) always show with their real percentage —
  they are never removed.
- **Curated extras** (e.g. `Figma`, `UI/UX`, `MySQL`) are appended via
  `"extraLanguages"` in the repo's `portfolio.json`:

```json
{
  "extraLanguages": ["Python", "CSS", "MySQL", "Figma", "UI/UX", "Java"]
}
```

To remove a curated language, just delete it from that list. Detected
languages can only be removed by changing the actual code in the repo.

> ⚠️ Setting `"featured": true` in `portfolio.json` does **not** add the repo to
> the Projects list — every public repo already appears. The flag only marks
> an already-listed repo as pinned for sorting.

## Tech Stack
- React 19
- Vite 6
- Framer Motion
- Lucide React
- CSS

## Prerequisites
- Node.js 20+ recommended
- npm 10+ recommended

## Installation
```bash
git clone https://github.com/radheshyam-bhati/Portfolio.git
cd Portfolio
npm install
```

## Usage / Quick Start
```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure
```text
.
├── index.html
├── package.json
├── public
│   ├── certificates
│   ├── docs
│   ├── fonts
│   └── images
├── src
│   ├── components
│   ├── data
│   ├── utils
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── legacy
├── vendor
└── vite.config.js
```

## Security

This site is hardened against the common attack surface of a static portfolio:

| Layer | Protection |
| --- | --- |
| **Content Security Policy** | `index.html` ships a strict CSP: `connect-src` only GitHub API / raw / FormSubmit, `object-src 'none'`, `frame-src 'none'`, `frame-ancestors 'none'` (anti-clickjacking), `form-action` locked to FormSubmit, `base-uri 'self'`, and `upgrade-insecure-requests`. |
| **Referrer Policy** | `strict-origin-when-cross-origin` — never leaks full page URLs to third parties (GitHub, LinkedIn, FormSubmit). |
| **Error boundary** | `src/components/ErrorBoundary.jsx` wraps the app in `main.jsx`; a render crash shows a safe reload screen instead of a blank page. Global `error` / `unhandledrejection` listeners log async failures. |
| **Anti-spam form** | Contact form has a hidden **honeypot** field (bots trip it silently), a **30s submit cooldown**, hard **length caps**, and **control-character stripping** in `src/utils/contactForm.js`. |
| **Dependencies** | `npm audit` is kept at **0 vulnerabilities**; CI fails on build/lint/test errors. |

> No secrets or API keys are shipped: GitHub data is fetched with the public API, and FormSubmit is configured via an optional `VITE_FORMSUBMIT_ENDPOINT` env var.

## Environment Variables
| Variable | Required | Description | Default |
| --- | --- | --- | --- |
| `VITE_FORMSUBMIT_ENDPOINT` | No | Full FormSubmit endpoint used by the contact form. | `https://formsubmit.co/ajax/<portfolio email>` |

## API Reference
### `POST` FormSubmit endpoint
- Purpose: sends portfolio contact form submissions to the configured inbox.
- Request body:

```json
{
  "name": "Radheshyam Bhati",
  "email": "radheshyam@example.com",
  "message": "I would like to discuss an internship opportunity.",
  "_subject": "New portfolio contact from Radheshyam"
}
```

- Response: JSON returned by FormSubmit.

## Contributing
1. Create a feature branch.
2. Make focused changes with a passing production build.
3. Open a pull request with screenshots or notes for UI-affecting updates.

## License
Private project. Do not redistribute without permission.
