Marjahan's Mock Server
======================

This mock server is provided for local development and demo purposes only. It exposes simple JSON endpoints and persists data in `server/data/*.json`.

Available endpoints:

- `POST /api/auth/login` — dev auth using `DEV_ADMIN_PASSWORD` environment variable (defaults to `admin123`). Returns a dev token for local usage.
- `GET /api/products` — list products (supports simple query params `price`, `metals`, `categories`).
- `GET /api/products/:id` — product detail.
- `GET /api/products/featured` — featured (first 4) items.
- `POST /api/products` — add product (dev only).
- `GET /api/orders` — list orders.
- `POST /api/orders` — create order.
- `POST /api/create-checkout-session` — create a simple checkout session (dev-only): persists order and returns `{ sessionUrl }`.
- `POST /api/stripe/create-checkout-session` — dev-safe Stripe endpoint: returns `{ sessionId, sessionUrl }`. If `STRIPE_SECRET_KEY` is set, returns 501 to indicate real integration is required.
- `POST /api/recommendations` — returns a static recommendations list.

Run locally:

```bash
cd server
npm install
DEV_ADMIN_PASSWORD=admin123 npm start
```

Important:

- This server is not secure. Do not deploy to production.
- Replace the mock endpoints with a proper backend for real auth, payment, and model API integration.
