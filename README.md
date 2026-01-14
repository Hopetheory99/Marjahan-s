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
=======
<<<<<<< HEAD

>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
### Admin Dashboard

- **Product Management** - Add, edit, and delete products
- **Order Management** - View and update order statuses
- **Inventory Tracking** - Monitor stock levels
- **Social Sync** - Import products from Facebook

### Technical Excellence

- **Code Splitting** - Lazy loading for optimal performance
- **SEO Optimized** - Meta tags, Open Graph, JSON-LD structured data
- **Type Safety** - Full TypeScript implementation
- **State Management** - React Context with useReducer pattern
- **Authentication** - Supabase Magic Link login
- **Payment Processing** - Stripe + bKash + Nagad integration

---

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (optional for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hopetheory99/Marjahan-s.git
cd Marjahan-s

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure your environment variables in .env.local
# See .env.example for required keys
```

### Environment Setup

Edit `.env.local` with your credentials:

```env
# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (Optional - for payment processing)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Email (Optional - for order confirmations)
VITE_RESEND_API_KEY=your_resend_key
```

⚠️ **Security Note**: Never commit real secrets. Use your hosting platform's secret store in production.

### Database Setup

1. Create a Supabase project
2. Run the schema SQL: `supabase_schema.sql`
3. Enable Row Level Security policies (included in schema)

### Start Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🛠️ Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |

---

## 🏗️ Project Structure

```
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Cart.tsx
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── ...
├── context/             # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── ...
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API/service layer
│   ├── productService.ts
│   ├── orderService.ts
│   └── ...
├── supabase/
│   └── functions/       # Supabase Edge Functions
├── public/              # Static assets
└── types.ts             # TypeScript definitions
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
| **State**      | React Context + React Query |
| **Payments**   | Stripe, bKash, Nagad       |

---

## 📈 Performance Optimizations

- ✅ Lazy-loaded route components (code splitting)
- ✅ Optimized images with lazy loading
- ✅ Local Tailwind CSS build (no CDN)
- ✅ Preconnect hints for external resources
- ✅ Memoized context values to prevent re-renders
- ✅ React Query for efficient data caching

---

## 🔐 Security

- Row Level Security (RLS) on all Supabase tables
- Admin routes protected by authentication
- Environment variables for sensitive data
- Server-side payment validation via Edge Functions
- No client-side secret exposure

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests (requires Playwright)
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

---

## 🚀 Deployment

### Supabase Edge Functions

```bash
# Deploy Edge Functions
npx supabase functions deploy create-payment-intent
npx supabase functions deploy stripe-webhook
npx supabase functions deploy send-order-email

# Configure secrets
npx supabase secrets set STRIPE_SECRET_KEY=your_key
npx supabase secrets set RESEND_API_KEY=your_key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
```

### Frontend Deployment

The frontend can be deployed to any static hosting platform (Vercel, Netlify, Cloudflare Pages, etc.).

---

## 📄 License

This project is private and proprietary.

---

<div align="center">
  <p>Built with ❤️ for luxury jewelry lovers</p>
</div>
<<<<<<< HEAD
=======
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
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
