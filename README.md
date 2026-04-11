# Radheshyam Portfolio

Personal portfolio built with a static HTML/CSS/JavaScript frontend and an Express backend. The frontend serves a single-page portfolio experience with local GSAP and Lenis assets, and the backend handles contact form delivery through SMTP.

## Project structure

```text
backend/
  app.js
  server.js
  controllers/
  middleware/
  routes/
  services/
  utils/
frontend/
  index.html
  script.js
  styles.css
  assets/
  vendor/
public/
```

## Requirements

- Node.js 20+
- npm 10+

## Environment variables

Copy `.env.example` to `.env` and provide the Gmail app password for `radheshyambhati7451@gmail.com`.

```env
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=radheshyambhati7451@gmail.com
SMTP_PASS=your-gmail-app-password
CONTACT_TO_EMAIL=radheshyambhati7451@gmail.com
CONTACT_FROM_EMAIL=radheshyambhati7451@gmail.com
CONTACT_RATE_LIMIT_WINDOW_MS=600000
CONTACT_RATE_LIMIT_MAX=5
```

## Scripts

- `npm run dev` starts the Express server in watch mode on port `3000`.
- `npm run lint` runs ESLint across the browser script and backend source files.
- `npm run verify` runs linting.
- `npm run start` serves the production backend and static frontend.

## API

### `GET /api/health`

Returns a basic health payload:

```json
{
  "ok": true,
  "status": "healthy",
  "timestamp": "2026-04-09T12:00:00.000Z"
}
```

### `POST /api/contact`

Accepts:

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "message": "Your message"
}
```

Returns success or validation errors while keeping the response shape consistent with the frontend form.

## Development flow

1. Install dependencies with `npm install`.
2. Create `.env` from `.env.example`, then paste your Gmail app password into `SMTP_PASS`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.
5. Before shipping changes, run `npm run verify`.
