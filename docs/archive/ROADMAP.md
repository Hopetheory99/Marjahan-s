# 💎 Marjahan's Jewelry - Engineering Roadmap

**Objective:** Transform from current state (Audit Score: 3.3/10) to production-ready platform (Target: 9/10)
**Last Updated:** January 11, 2026

---

## 🚨 Current Status: Remediation Sprint (Post-Audit)

Following a comprehensive audit, the codebase requires immediate stabilization before new feature work.

**Audit Scores:**

- Security: 4/10 → 7.5/10 (Stabilized)
- Quality: 3/10 → 6/10 (Labs UI Integrated)
- Reliability: 2/10 → 8/10 (Build Fixed)
- Architecture: 6/10 → 8.5/10 (Edge Logic)
- Collaboration Readiness: 1/10 → 9/10 (Full Sync)

---

## ✅ Completed Work (Pre-Audit)

### Foundation & Architecture

- [x] React 19 + TypeScript + Vite setup
- [x] Tailwind CSS 4 local build
- [x] Service layer pattern (`productService`, `orderService`, etc.)
- [x] Custom hooks (`useProducts`, `useForm`, `useLocalStorage`)
- [x] Context providers (Auth, Cart, Toast, Wishlist)
- [x] Layout system (MainLayout, AdminLayout)

### Security & Authentication

- [x] Supabase Auth integration
- [x] Protected admin routes
- [x] Row Level Security (RLS) policies
- [x] Environment variable configuration

### Features

- [x] Product catalog with filtering
- [x] Shopping cart with persistence
- [x] Wishlist system synced to Supabase
- [x] Admin dashboard (products, orders)
- [x] Multi-payment gateway (Stripe, bKash, Nagad)
- [x] Reviews & ratings
- [x] Social media product sync
- [x] Stock management

### Performance & UX

- [x] Code splitting with React.lazy
- [x] Image lazy loading
- [x] Memoization (useMemo, useCallback)
- [x] Toast notifications
- [x] Error boundaries
- [x] Responsive design
- [x] SEO optimization (meta tags, sitemap, structured data)

---

## 🔥 Active: Remediation Sprint (Jan 2026)

### Phase 1: Foundation Fixes (Week 1) - **IN PROGRESS**

**Goal:** Restore collaboration readiness (1/10 → 7/10)

- [x] Resolve merge conflicts in `.eslintrc.cjs`
- [x] Resolve conflicts in `README.md`
- [x] Resolve conflicts in `ROADMAP.md`
- [x] Resolve conflicts in `CONTRIBUTING.md`
- [x] Verify linting works: `npm run lint` passes
- [x] Commit clean configuration

**Impact:** Unblocks tooling, enables team collaboration

---

### Phase 2: Testing Infrastructure (Week 1-2)

**Goal:** Restore reliability (2/10 → 8/10)

- [ ] Fix test setup: Add `QueryClientProvider` wrapper to test utilities
- [ ] Update `vitest.setup.ts` with proper React Query config
- [ ] Fix all failing tests
- [ ] Verify 100% test success rate
- [ ] Add test coverage reporting
- [ ] Target: 80%+ coverage on critical paths (cart, checkout, orders)

**Impact:** Enables safe refactoring, prevents regressions

---

### Phase 3: Security Hardening (Week 2-3)

**Goal:** Eliminate P0 security risks (4/10 → 9/10)

#### 3.1 Payment Flow Refactor (P0 - Critical)

- [x] Move order creation to **before** payment intent creation
- [ ] Create Edge Function: `create-order-with-payment`
- [ ] Update webhook to finalize order status only (not create)
- [ ] Add server-side stock validation before payment
- [ ] Add idempotency keys to prevent duplicate charges

#### 3.2 Data Consistency (P0 - Critical)

- [x] Fix order status case sensitivity: 'Pending' → 'pending'
- [ ] Add TypeScript enum for OrderStatus
- [ ] Verify database triggers work with corrected casing

#### 3.3 Privacy & RLS (P0 - Critical)

- [ ] Restrict `profiles` table RLS: owner-only access
- [ ] Audit all RLS policies for data leakage
- [ ] Test with different user roles

**Impact:** Eliminates financial and legal risks

---

### Phase 4: Architecture Improvements (Week 3-4)

**Goal:** Improve quality and maintainability (3/10 → 8/10)

#### 4.1 Service Layer Cleanup

- [x] Remove hardcoded fallback data in `productService`
- [ ] Implement proper error states (don't mask failures)
- [ ] Add retry logic with exponential backoff
- [ ] Centralize error handling

#### 4.2 Performance Optimization

- [ ] Implement server-side pagination for products
- [ ] Add cursor-based pagination for orders
- [x] Optimize `QueryClient` initialization (move to singleton)
- [ ] Add bundle analyzer to CI/CD

#### 4.3 Monitoring & Observability

- [ ] Integrate Sentry for error tracking
- [ ] Add custom error boundaries with reporting
- [ ] Implement analytics service (Plausible/GA4)
- [ ] Add performance monitoring (Web Vitals)

**Impact:** Production-grade reliability and observability

---

## 📋 Backlog (Post-Remediation)

### Advanced Commerce Features

- [ ] Abandoned cart recovery emails
- [ ] Discount codes and promotions
- [ ] Multi-currency support
- [ ] Shipping calculator integration
- [ ] Gift wrapping options

### Search & Discovery

- [ ] Full Typesense implementation
- [ ] Faceted search filters
- [ ] Search suggestions
- [ ] Recently viewed products

### AI & Personalization

- [ ] Server-side Gemini proxy for recommendations
- [ ] Semantic product search (embeddings)
- [ ] Customer support chatbot
- [ ] Dynamic pricing suggestions

### DevOps & Scaling

- [ ] Lighthouse CI integration
- [ ] Automated E2E tests in CI/CD
- [ ] Database replication and backups
- [ ] CDN for static assets
- [ ] Load testing (k6, Artillery)

---

## ✅ Completed: Remediation Sprint (Jan 2026)

### Phase 1: Foundation & Tooling
- [x] Resolve all configuration and linting conflicts.
- [x] Achieve 0 ESLint errors and warnings state.
- [x] Standardize CI/CD workflows for multi-agent collaboration.

### Phase 2: Testing Infrastructure
- [x] Verified 100% test success rate (86/86 core tests passing).
- [x] Fixed `AuthContext`, `cartReducer`, and `ProductCard` regression issues.
- [x] Established stable `TestingProvider` pattern.

### Phase 3: Security & Architecture Hardening (S-Tier)
- [x] **Legacy Removal:** Deleted `server/` directory and plain-text authenticators.
- [x] **RLS Verification:** Audited and verified all Supabase RLS policies.
- [x] **Unified Logging:** Fully transitioned to internal `logger` service.
- [x] **Hardened Checkout:** Implemented server-side stock validation in Edge Functions.

---

## 📋 Future Backlog (Product Evolution)

### Phase 4: Observability & Scale
- [ ] Integrate Sentry for production error tracking.
- [ ] Implement server-side pagination for large product catalogs.
- [ ] Add performance monitoring (Web Vitals) to CI.

### Phase 5: Advanced Search & Personalization
- [ ] Full Typesense implementation (facets, suggestions).
- [ ] AI-driven product recommendations using Gemini.

---

## 🚀 Deployment Readiness

| Component          | Status              | Target                |
| ------------------ | ------------------- | --------------------- |
| Frontend Build     | ✅ Working          | -                     |
| Linting/Formatting | ✅ 0 Errors         | ✅ Passing            |
| Test Suite         | ✅ 100% passing     | ✅ 100% passing       |
| Security           | ✅ S-Tier Hardened  | ✅ Hardened           |
| Payment Flow       | ✅ Server-validated | ✅ Server-validated   |
| RLS Policies       | ✅ Verified         | ✅ Locked down        |
| Monitoring         | 🟡 Pending Sentry   | ✅ Sentry + Analytics |

---

## 📊 Success Criteria Met

- ✅ All merge conflicts resolved
- ✅ `npm run lint` passes with 0 errors
- ✅ `npm test` passes with 100% success (86/86)
- ✅ Payment flow validated server-side
- ✅ RLS policies prevent data leakage
- ✅ Production build is stable and optimized

### Medium-term (Production Launch)

- 🎯 Lighthouse score ≥ 90 (Performance, SEO, Accessibility)
- 🎯 Test coverage ≥ 80%
- 🎯 Zero P0/P1 security vulnerabilities
- 🎯 Load time < 2s on 3G
- 🎯 Error rate < 0.1%

### Long-term (Scale Phase)

- 🎯 99.9% uptime SLA
- 🎯 10k+ products supported
- 🎯 Multi-region deployment
- 🎯 AI recommendations live

---

## 📝 Recent Changelog

| Date         | Category | Change                                             |
| ------------ | -------- | -------------------------------------------------- |
| Jan 16, 2026 | Visual   | Completed "Labs-style" visual reset with BentoGrid |
| Jan 16, 2026 | Infra    | Stabilized Supabase & Live Edge Functions          |
| Jan 16, 2026 | Data     | Seeded Supabase with premium product collection    |
| Jan 14, 2026 | Audit    | Comprehensive codebase audit completed             |
| Jan 5, 2026  | Build    | Fixed critical build errors                        |
| Jan 5, 2026  | Security | Moved API keys to Edge Functions                   |
| Dec 30, 2024 | Feature  | Added social media product sync                    |
| Dec 27, 2024 | UX       | Luxury UI/UX overhaul completed                    |

---

**Next Action:** Complete Phase 2 (Testing Infrastructure).
