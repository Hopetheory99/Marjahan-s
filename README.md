<div align="center">
  <h1>💎 Marjahan's Jewelry</h1>
  <p><strong>A State-of-the-Art Luxury Jewelry E-Commerce Platform</strong></p>
  <p>Where Luxury Meets Affordability</p>
  
  ![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
  ![Tailwind](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)
  ![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)
  ![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?logo=supabase)
</div>

---

## 🚀 Features

### Customer Experience

- **Product Catalog** - Browse luxury jewelry with beautiful imagery
- **Smart Filtering** - Filter by category, metal type, and price range
- **Wishlist** - Save favorite items (syncs with Supabase for logged-in users)
- **Shopping Cart** - Persistent cart with local storage backup
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Stock Management** - Real-time stock availability display

<<<<<<< HEAD

### Admin Dashboard

- **Product Management** - Add, edit, and delete products
- **Order Management** - View and update order statuses
- **Inventory Tracking** - Monitor stock levels

### Technical Excellence

- **Code Splitting** - Lazy loading for optimal performance
- **SEO Optimized** - Meta tags, Open Graph, JSON-LD structured data
- **Type Safety** - Full TypeScript implementation
- **State Management** - React Context with useReducer pattern
- **Authentication** - Supabase Magic Link login

---

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Hopetheory99/Marjahan-s.git
cd Marjahan-s

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 🏗️ Project Structure

```
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Cart.tsx
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   ├── WishlistButton.tsx
│   └── ...
├── context/             # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── ToastContext.tsx
│   └── WishlistContext.tsx
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API/service layer
├── public/              # Static assets
│   ├── robots.txt
│   └── sitemap.xml
└── types.ts             # TypeScript type definitions
```

---

## 🔧 Tech Stack

| Category       | Technology                 |
| -------------- | -------------------------- |
| **Frontend**   | React 19, TypeScript       |
| **Styling**    | TailwindCSS 4              |
| **Build Tool** | Vite 6                     |
| **Backend**    | Supabase (Auth + Database) |
| **Routing**    | React Router 7             |
| **State**      | React Context + useReducer |

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests (requires Playwright)
npx playwright test
```

---

## 📈 Performance Optimizations

- ✅ Lazy-loaded route components (code splitting)
- ✅ Optimized images with lazy loading
- ✅ Local Tailwind CSS build (no CDN)
- ✅ Preconnect hints for external resources
- ✅ Memoized context values to prevent re-renders

---

## 🔐 Security

- Row Level Security (RLS) on all Supabase tables
- Admin routes protected by authentication
- Environment variables for sensitive data
- No client-side secret exposure

---

## 📄 License

This project is private and proprietary.

---

<div align="center">
  <p>Built with ❤️ for luxury jewelry lovers</p>
</div>
=======
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

Stripe notes (dev):

- This repo includes a dev-safe Stripe mock endpoint at `/api/stripe/create-checkout-session` (in the mock server). It returns a `sessionUrl` pointing to the confirmation page and persists an order locally under `server/data/orders.json`.
- To wire a real Stripe integration, set `STRIPE_SECRET_KEY` in the server environment and implement the real checkout session creation in the server (`server/index.js`) using the official Stripe SDK. Do not expose `STRIPE_SECRET_KEY` to the browser.
- In the frontend, set `VITE_STRIPE_PUBLISHABLE_KEY` in `.env.local` for client-side Stripe components. The frontend uses `VITE_API_BASE_URL` to call the server endpoints.

Example (local):

```bash
# in server/.env or your shell environment
export DEV_ADMIN_PASSWORD=admin123
export STRIPE_SECRET_KEY=

# in frontend .env.local
VITE_API_BASE_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

> > > > > > > 761b4aa0e334fc8c74177e361cd66e69829c60ff
