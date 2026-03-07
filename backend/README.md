# Backend Setup

## 1. Configure environment

Create `backend/.env` from `backend/.env.example` and fill:

- `TRUST_PROXY` (`0` for direct deploy, `1`+ when behind reverse proxy/load balancer)
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL` (must be a verified sender in Resend for production)
- `TURNSTILE_SECRET_KEY` (Cloudflare Turnstile secret; enables CAPTCHA verification)
- `CONTACT_RATE_LIMIT_WINDOW_MS` (optional, default `600000`)
- `CONTACT_RATE_LIMIT_MAX` (optional, default `5`)
- `CONTACT_MIN_FILL_MS` (optional, default `1500`)

## 2. Start backend

From project root:

```bash
npm run dev:backend
```

Backend runs on `http://localhost:4000`.

Health check:

```bash
GET http://localhost:4000/api/health
```

Contact API protections:

- Request body size cap
- Honeypot anti-bot field (`website`)
- CAPTCHA verification (`captchaToken`) when `TURNSTILE_SECRET_KEY` is set
- Minimum form fill time
- Per-IP rate limiting for `/api/contact`

## Tests

Run backend tests:

```bash
npm --prefix backend run test
```

## 3. Start frontend

In another terminal:

```bash
npm run dev:frontend
```

Frontend contact form calls `http://localhost:4000/api/contact` by default.

## Optional: custom backend URL

Set frontend env:

```bash
VITE_BACKEND_URL=http://localhost:4000
```

in `frontend/.env` if you want to override.
