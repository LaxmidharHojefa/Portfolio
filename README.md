# Portfolio Website (Frontend + Backend)

This repository contains a personal portfolio website split into two apps:

- `frontend/` - React + Vite portfolio UI
- `backend/` - Node + Express API for contact form email delivery

## Project Structure

```text
.
├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
├── backend/
│   ├── src/app.js
│   ├── src/server.js
│   └── .env.example
├── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+

## Run Locally

1. Start backend (Terminal 1)

```bash
npm run dev:backend
```

2. Start frontend (Terminal 2)

```bash
npm run dev:frontend
```

Frontend runs on Vite default port (`http://localhost:5173`).
Backend runs on `http://localhost:4000`.

## Frontend Configuration

You can override backend URL by creating:

- `frontend/.env`

with:

```bash
VITE_BACKEND_URL=http://localhost:4000
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

## Backend Configuration

Create:

- `backend/.env`

from:

- `backend/.env.example`

and set values:

```bash
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
TRUST_PROXY=0
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=your-email@example.com
CONTACT_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
CONTACT_RATE_LIMIT_WINDOW_MS=600000
CONTACT_RATE_LIMIT_MAX=5
CONTACT_MIN_FILL_MS=1500
```

## Available Root Scripts

- `npm run dev:frontend` - start frontend dev server
- `npm run build:frontend` - create production frontend build
- `npm run dev:backend` - start backend in watch mode
- `npm run start:backend` - start backend without watch
- `npm run test:backend` - run backend API tests

## CI

GitHub Actions workflow at `.github/workflows/ci.yml` runs:

- backend syntax checks + API tests
- frontend production build

## Contact API

- `GET /api/health` - health and contact mode (`email` or `local`)
- `POST /api/contact` - validates, rate-limits, verifies CAPTCHA (if configured), and sends/saves submissions

Delivery check:

- Open `http://localhost:4000/api/health`.
- If `mode` is `local`, contact messages are saved to `backend/data/contact-submissions.json` and no email is sent.
- For real email delivery, set a valid `RESEND_API_KEY` in `backend/.env`, keep `CONTACT_TO_EMAIL` set, then restart backend.

## Notes

- Section routing uses clean URLs (`/about`, `/contact`) without hash fragments.
- If email credentials are missing (or provider fails), submissions are saved locally in `backend/data/contact-submissions.json`.
