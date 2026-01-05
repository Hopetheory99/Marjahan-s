# NEXT STEPS (7–14 day plan)

This file captures the prioritized, actionable work to move the prototype toward production readiness over the next 2 weeks. Each item includes rationale, concrete changes (files/locations), estimated effort, dependencies, and success criteria.

Priority 1 — Security & Persistence (3–5 days)
- Task: Replace JSON file persistence with Postgres and add migrations.
  - Why: File-based JSON is not production-grade; need ACID persistence.
  - Files/places: `server/index.js`, `server/data/*`, add `server/db/` (new), `server/migrations/` (new), update `services/*` adapters.
  - Work: add `knex` or `prisma` schema, create migration to import existing `server/data/*.json`, update `orderService` and `productService` to use DB queries when `VITE_API_BASE_URL` present.
  - Estimate: 2–3 days
  - Success: backend runs with DB, data persisted across restarts, tests adjusted to use test DB (SQLite in-memory or docker-compose Postgres).

Priority 2 — Real Auth & Session Management (2–4 days)
- Task: Implement server-backed authentication (JWT) and replace demo `AuthContext`.
  - Why: Current client-only admin password is unsafe for prod.
  - Files/places: `server/index.js` (auth routes), `server/controllers/auth.js` (new), `context/AuthContext.tsx`, `ProtectedRoute.tsx`.
  - Work: add `/api/auth/login` to issue signed JWTs, refresh tokens optional, secure cookie or Authorization header flow; update front-end to call login endpoint and store token in httpOnly cookie (or short-lived memory + refresh token).
  - Estimate: 2 days
  - Success: login endpoint issues JWT, protected routes validate token server-side, admin flows require server authentication.

Priority 3 — Stripe Server Integration (1–2 days)
- Task: Migrate the mock Stripe endpoint to real server-side integration with environment variables.
  - Why: Current client uses mock session; real payments require secure server-side calls.
  - Files/places: `server/index.js` (add `/api/stripe/*`), `services/stripeService.ts`, `.env` / Vercel secrets.
  - Work: add endpoint to create Checkout Session, webhook handler for `checkout.session.completed`, secure keys in env.
  - Estimate: 1–2 days
  - Success: test purchases create real Stripe sessions in test mode; webhooks update order status in DB.

Priority 4 — Input Validation & API Hardening (1–2 days)
- Task: Add Zod validation on server endpoints and client request shapes.
  - Files/places: `server/index.js` controllers, `services/*` request builders, `pages/CheckoutPage.tsx` and forms.
  - Work: validate payloads, return typed errors, add rate limiting middleware for sensitive endpoints.
  - Estimate: 1 day
  - Success: invalid inputs return 4xx with structured error objects; unit tests cover validation.

Priority 5 — Tests, Coverage & CI (2–4 days)
- Task: Raise unit coverage to >=80%, add integration tests and Playwright E2E on CI.
  - Why: Production readiness requires strong automated tests.
  - Files/places: `components/__tests__/*`, `pages/__tests__/*`, `services/__tests__/*`, update `.github/workflows/ci.yml` to run Playwright in headless CI, add coverage reporter (c8/nyc or Vitest built-in).
  - Work: add tests for `useOrders`, `CheckoutPage`, `server` endpoints (supertest), Playwright tests for main purchase flow; add coverage thresholds to CI.
  - Estimate: 2–4 days
  - Success: CI enforces coverage gate; tests pass on PRs and main.

Priority 6 — Observability & Production Ops (2–3 days)
- Task: Add Sentry (error tracking), structured logs, and basic Prometheus metrics or host metrics.
  - Files/places: `server/index.js` and `App.tsx` integration points, CI and deployment docs.
  - Work: integrate Sentry DSN via env, add error boundaries, ensure sensitive data redaction.
  - Estimate: 1–2 days
  - Success: Exceptions surface in Sentry; release tagging and source maps configured for production.

Priority 7 — Deploy & Secrets (1 day)
- Task: Configure production deployment with secrets (Vercel/GCP/AWS). Add a deployment checklist.
  - Files/places: `vercel.json`, `README.md` deploy section, `.github/workflows/deploy.yml` (optional).
  - Work: provide environment variables for DB, JWT secret, Stripe keys, Sentry DSN; run smoke tests post-deploy.
  - Estimate: 1 day
  - Success: App deploys to staging with real DB and Stripe in test mode; smoke tests pass.

Lower priority / future (optional beyond 2 weeks)
- Email notifications (SendGrid); Background jobs (BullMQ); Rate limiting & WAF; Accessibility fixes; Performance budget; Gemini AI server proxy integration.

Immediate next steps (today)
- Add this `NEXT_STEPS.md` to repo (done).
- Create two small follow-up PRs:
  1) Add DB/ORM skeleton and migration to import JSON (small, 1–2 files).
  2) Add server auth skeleton and update `AuthContext` usage.

Notes & links
- Use `VITE_API_BASE_URL` in dev/staging to switch between local Express and production API.
- Key files to edit while implementing:
  - Frontend: `context/AuthContext.tsx`, `hooks/useProducts.ts`, `hooks/useOrders.ts`, `pages/CheckoutPage.tsx`, `services/*.ts`, `App.tsx`
  - Backend: `server/index.js`, `server/controllers/*.js`, `server/db/*`

If you want I can start implementing Priority 1 (DB + migrations) now — shall I proceed?
