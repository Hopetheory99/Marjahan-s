<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1MEQS2qLyHN82FIKHZIUcrMOg8QQ02yI8

## Run Locally

Prerequisites: Node.js >= 18, npm

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` (or use your platform env) from `.env.example` and set secrets:

```
cp .env.example .env.local
# then edit .env.local to add keys
```

3. Run the dev server:

```bash
npm run dev
```

Useful scripts:

- `npm run lint` — run ESLint
- `npm run format` — run Prettier
- `npm run test` — run unit tests (Vitest)
- `npm run build` — production build

Notes:
- Do NOT commit real secrets. Use your hosting platform's secret store in production.
- The repository contains demo-only implementations for auth and services; see `services/geminiService.ts` for guidance on wiring a secure server-side proxy.

Local mock server (optional):

1. Install server deps and start the mock API (runs on port 3000 by default):

```bash
cd server
npm install
npm start
```

2. Set `VITE_API_BASE_URL=http://localhost:3000` in `.env.local` to make the frontend call the mock server instead of using in-memory services.

The mock server provides `/api/products`, `/api/orders`, `/api/auth/login`, and `/api/recommendations` endpoints for development and demo purposes.
