# Portfolio

A full-stack portfolio website built with a React frontend and a Node.js/Express backend.
It includes a production-ready contact form with validation, rate limiting, optional CAPTCHA, email delivery via Resend, backend tests, and CI.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Email: Resend
- Bot Protection: Cloudflare Turnstile (optional)
- CI: GitHub Actions

## Project Structure

```text
.
|-- frontend/
|   |-- src/
|   |-- index.html
|   `-- vite.config.ts
|-- backend/
|   |-- src/app.js
|   |-- src/server.js
|   `-- tests/
|-- .github/workflows/ci.yml
|-- package.json
`-- README.md
```

## Prerequisites

- Node.js 18+
- npm 9+

## Local Development

From the repository root:

1. Install dependencies

```bash
npm --prefix frontend install
npm --prefix backend install
```

2. Start backend

```bash
npm run dev:backend
```

3. Start frontend

```bash
npm run dev:frontend
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000` (or your configured `PORT`)

## Environment Variables

Do not commit real secrets. Use `.env` files locally and platform secrets in production.

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_TURNSTILE_SITE_KEY=
```

### Backend (`backend/.env`)

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
TRUST_PROXY=0

RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=your-email@example.com
CONTACT_FROM_EMAIL=Portfolio Contact <noreply@yourdomain.com>

TURNSTILE_SECRET_KEY=
CONTACT_RATE_LIMIT_WINDOW_MS=600000
CONTACT_RATE_LIMIT_MAX=5
CONTACT_MIN_FILL_MS=1500
```

## Scripts

From repo root:

- `npm run dev:frontend` - Start frontend dev server
- `npm run build:frontend` - Build frontend for production
- `npm run dev:backend` - Start backend with watch mode
- `npm run start:backend` - Start backend in normal mode
- `npm run test:backend` - Run backend API tests

## Contact API

- `GET /api/health` - Health status and contact mode info
- `POST /api/contact` - Validates input, applies anti-spam checks, verifies CAPTCHA (if enabled), and sends/stores submission

If email delivery is not configured, the backend can fall back to local storage mode for development.

## CI

GitHub Actions workflow:

- Backend syntax checks and tests
- Frontend production build

File: `.github/workflows/ci.yml`

## Deployment Notes

Recommended setup:

- Frontend on Vercel
- Backend on Render

Set these in production:

- Backend `FRONTEND_ORIGIN` to your Vercel domain
- Backend `TRUST_PROXY=1` (behind platform proxy)
- Frontend `VITE_BACKEND_URL` to your Render backend URL

## Security Notes

- Never commit `.env` with real keys
- Rotate keys immediately if exposed
- Use a verified sending domain in Resend for production deliverability
- Keep CORS restricted to trusted frontend origins
