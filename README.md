# Project Title
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
- GitHub auto-sync: projects tagged with the `featured` or `portfolio` topic automatically appear in the Featured Projects section (no code changes needed to add a project).
- Per-project detail views show a top-5 language breakdown (lazy-fetched, cached) and a live-demo link + description when a deployment is declared via the repo `homepage` or `portfolio.json` `demo`.
- Manual refresh control on the Projects section to bypass the 30-minute cache.
- Dev preview mode: `npm run dev:preview` shows ALL public repos in the Projects section without tagging any repo `featured`/`portfolio` on GitHub (development builds only).

## Manage Content Without Code

Every project card is sourced from a GitHub repo, so you can add, remove, and
customize projects — and their languages — without touching this codebase.

### Add / remove a project
| Action | How |
| --- | --- |
| **Add a project** | Tag the repo with the `featured` (or `portfolio`) topic on GitHub, then hit the ⟳ refresh button on the Projects section. |
| **Remove a project** | Untag the `featured`/`portfolio` topics, **or** add a `portfolio.json` to the repo with `"hidden": true`. |
| **Reorder projects** | Set `"priority"` in the repo's `portfolio.json` (lower = earlier). |

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
> the Projects list — only the `featured`/`portfolio` **topic** does. The flag
> only marks an already-listed repo for sorting.

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

Preview the Projects section with every public repo (no GitHub topic tag needed):

```bash
npm run dev:preview
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

## Environment Variables
| Variable | Required | Description | Default |
| --- | --- | --- | --- |
| `VITE_FORMSUBMIT_ENDPOINT` | No | Full FormSubmit endpoint used by the contact form. | `https://formsubmit.co/ajax/<portfolio email>` |
| `VITE_PREVIEW_ALL_REPOS` | No | When `true` in a development build, the Projects section shows every public repo (ignores the `featured`/`portfolio` topic filter). Hard-gated to dev — never active in production. | `false` |

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
