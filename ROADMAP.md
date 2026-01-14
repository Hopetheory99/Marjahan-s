# 💎 Marjahan's Jewelry - Engineering Roadmap

**Objective:** Transform from current state (Audit Score: 3.3/10) to production-ready platform (Target: 9/10)
**Last Updated:** January 11, 2026

---

## 🚨 Current Status: Remediation Sprint (Post-Audit)

Following a comprehensive audit, the codebase requires immediate stabilization before new feature work.

**Audit Scores:**
- Security: 4/10 → Target: 9/10
- Quality: 3/10 → Target: 8/10  
- Reliability: 2/10 → Target: 8/10
- Architecture: 6/10 → Target: 8/10
- Collaboration Readiness: 1/10 → Target: 7/10

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
- [/] Resolve conflicts in `ROADMAP.md`
- [ ] Resolve conflicts in `CONTRIBUTING.md` and `.env.example`
- [ ] Verify linting works: `npm run lint` passes
- [ ] Commit clean configuration

**Impact:** Unblocks tooling, enables team collaboration

---

### Phase 2: Testing Infrastructure (Week 1-2)

**Goal:** Restore reliability (2/10 → 8/10)

- [ ] Fix test setup: Add `QueryClientProvider` wrapper to test utilities
- [ ] Update `vitest.setup.ts` with proper React Query config
- [ ] Fix all 14 failing tests:
  - [ ] Component tests missing providers
  - [ ] Service tests with async errors
- [ ] Verify 100% test success rate
- [ ] Add test coverage reporting
- [ ] Target: 80%+ coverage on critical paths (cart, checkout, orders)

**Impact:** Enables safe refactoring, prevents regressions

---

### Phase 3: Security Hardening (Week 2-3)  

**Goal:** Eliminate P0 security risks (4/10 → 9/10)

#### 3.1 Payment Flow Refactor (P0 - Critical)
- [ ] Move order creation to **before** payment intent creation
- [ ] Create Edge Function: `create-order-with-payment`
- [ ] Update webhook to finalize order status only (not create)
- [ ] Add server-side stock validation before payment
- [ ] Add idempotency keys to prevent duplicate charges

#### 3.2 Data Consistency (P0 - Critical)
- [ ] Fix order status case sensitivity:
  - Update `orderService.ts`: 'Pending' → 'pending'
  - Update all frontend references
  - Align with SQL enum constraints
- [ ] Add TypeScript enum for OrderStatus
- [ ] Verify database triggers work with corrected casing

#### 3.3 Privacy & RLS (P0 - Critical)
- [ ] Restrict `profiles` table RLS: owner-only access
- [ ] Create view `public_profiles` for limited public data (if needed)
- [ ] Audit all RLS policies for data leakage
- [ ] Test with different user roles

**Impact:** Eliminates financial and legal risks

---

### Phase 4: Architecture Improvements (Week 3-4)

**Goal:** Improve quality and maintainability (3/10 → 8/10)

#### 4.1 Service Layer Cleanup
- [ ] Remove hardcoded fallback data in `productService`
- [ ] Implement proper error states (don't mask failures)
- [ ] Add retry logic with exponential backoff
- [ ] Centralize error handling

#### 4.2 Performance Optimization
- [ ] Implement server-side pagination for products
- [ ] Add cursor-based pagination for orders
- [ ] Optimize `QueryClient` initialization (move to singleton)
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

## 🚀 Deployment Readiness

| Component | Current Status | Target |
|-----------|---------------|--------|
| Frontend Build | ✅ Working | - |
| Linting/Formatting | ⚠️ Fixed (pending verification) | ✅ Passing |
| Test Suite | 🔴 27% failing | ✅ 100% passing |
| Security | 🔴 Critical flaws | ✅ Hardened |
| Payment Flow | 🔴 High-risk hybrid | ✅ Server-validated |
| RLS Policies | 🔴 Privacy leak | ✅ Locked down |
| Monitoring | ❌ None | ✅ Sentry + Analytics |

---

## 📊 Success Criteria

### Short-term (End of Remediation Sprint)
- ✅ All merge conflicts resolved
- ✅ `npm run lint` passes with 0 errors
- ✅ `npm test` passes with 0 failures
- ✅ Payment flow validated server-side
- ✅ RLS policies prevent data leakage
- ✅ Sentry deployed and capturing errors

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

| Date | Category | Change |
|------|----------|--------|
| Jan 11, 2026 | Audit | Comprehensive codebase audit completed |
| Jan 11, 2026 | Config | Resolved `.eslintrc.cjs` merge conflict |
| Jan 11, 2026 | Docs | Resolved `README.md` merge conflict |
| Jan 11, 2026 | Docs | Updated roadmap to reflect audit findings |
| Jan 5, 2026 | Build | Fixed critical build errors |
| Jan 5, 2026 | Security | Moved API keys to Edge Functions |
| Dec 30, 2024 | Feature | Added social media product sync |
| Dec 27, 2024 | UX | Luxury UI/UX overhaul completed |

---

**Next Action:** Complete Phase 1 (Foundation Fixes) and move to Phase 2 (Testing Infrastructure).
