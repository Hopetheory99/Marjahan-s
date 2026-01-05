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
