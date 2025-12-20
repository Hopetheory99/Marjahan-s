
# 💎 Marjahan's Jewelry - Product Roadmap

**Objective:** Evolve from a demo/MVP to a production-ready, scalable e-commerce platform with AI and secure payments.
**Last Updated:** 2025-12-20

---

## ✅ Phase 1: Security & Foundation (Completed)
*Goal: Fix vulnerabilities and establish strict type safety.*

- [x] **Secure Admin Route:** Implement `AuthContext` and `ProtectedRoute` to prevent unauthorized access.
- [x] **Strict TypeScript:** Remove `any` types in `ProductsPage` filtering logic.
- [x] **Input Validation:** Implemented `useForm` hook with validation for Checkout.
- [x] **Environment Variables:** Created `config.ts` to centralize configuration and remove magic strings.
- [x] **Remove Hard-Coded Credentials:** Replaced `admin123` password with VITE_ADMIN_PASSWORD env var and disabled client-side auth in production.
- [x] **Auth Persistence:** Migrated from localStorage to sessionStorage (dev) and server-backed login.

## ✅ Phase 2: Architecture & State (Completed)
*Goal: Decouple data and implement robust state management.*

- [x] **Service Layer:** Created API adapters in `services/productService.ts` and `services/orderService.ts` to call backend when available.
- [x] **Custom Hooks:** Created `useProducts.ts` and `useOrders.ts` using React Query for caching.
- [x] **Cart Persistence:** Implemented `useLocalStorage` to save Cart state on refresh.
- [x] **Reducer Pattern:** Refactored `CartContext` to use `cartReducer` for deterministic state logic.
- [x] **Layout System:** Extracted `MainLayout` and `AdminLayout` from `App.tsx`.
- [x] **React Query Integration:** Added `@tanstack/react-query` for data fetching, caching, and background updates.

## ✅ Phase 3: Performance & Optimization (Partially Completed)
*Goal: Ensure 60fps and low TTI (Time to Interactive).*

- [x] **Image Optimization:** Implement generic `Image` component with `srcset` and lazy loading.
- [x] **Code Splitting:** Use `React.lazy` and `Suspense` for Route components (especially Admin and Checkout).
- [x] **Memoization:** Audit `ProductsPage` and `Cart` for unnecessary re-renders (use `useMemo`, `useCallback`).
- [ ] **Bundle Analysis:** Add vite-plugin-visualizer to monitor bundle size.
- [ ] **Image CDN:** Integrate Cloudinary or Imgix for responsive image optimization.
- [ ] **Server-Side Pagination:** Limit product list queries to 20 items per request.

## ✅ Phase 4: Testing & Reliability (Partially Completed)
*Goal: Establish testing practices and fault tolerance.*

- [x] **Fault Tolerance:** Implemented `ErrorBoundary` and `NotFoundPage`.
- [x] **Unit Tests:** Created `context/__tests__/cartReducer.test.ts` and `components/__tests__/ProductCard.test.tsx`.
- [x] **Test Framework:** Set up Vitest with React Testing Library.
- [x] **CI Pipeline:** Added GitHub Actions workflow for lint, test, and build.
- [ ] **Increase Coverage:** Target 80%+ test coverage across hooks, services, and components.
- [ ] **E2E Tests:** Expand Playwright tests to cover full checkout and cart flows.

## ✅ Phase 5: Backend & API (Partially Completed)
*Goal: Establish production-ready backend architecture.*

- [x] **Mock Server:** Created Express.js backend with `/server` folder and endpoints for products, orders, auth, and recommendations.
- [x] **File-Based Persistence:** Products and orders stored in `server/data/*.json` for local development.
- [x] **Auth Endpoint:** Added `/api/auth/login` for dev/staging auth (not secure for production).
- [x] **API Adapters:** Updated services to call backend endpoints when `VITE_API_BASE_URL` is set.
- [ ] **Real Database:** Replace JSON file storage with PostgreSQL/MongoDB.
- [ ] **Production Auth:** Implement JWT with httpOnly cookies or OAuth2/OIDC.
- [ ] **Input Validation:** Add Zod schema validation at API boundaries.
- [ ] **Rate Limiting:** Protect endpoints with rate limiting (npm `express-rate-limit`).

## ✅ Phase 6: Payments & Checkout (Partially Completed)
*Goal: Enable secure payment processing.*

- [x] **Stripe Mock Endpoint:** Added `/api/stripe/create-checkout-session` that returns dev sessionUrl.
- [x] **Client Integration:** Created `services/stripeService.ts` and wired into `CheckoutPage`.
- [ ] **Real Stripe:** Implement Stripe API integration on server (payment intents, webhooks).
- [ ] **Webhook Handlers:** Handle Stripe events (payment_intent.succeeded, charge.failed).
- [ ] **Order Status:** Update order status based on payment outcome.
- [ ] **Email Confirmation:** Send order confirmation emails via SendGrid/Mailgun.

## 🔄 Phase 7: AI & Personalization (Next)
*Goal: Add Gemini-powered recommendations and search.*

- [x] **Service Stub:** Created `services/geminiService.ts` with safe fallback (mocks when no key).
- [ ] **Server Proxy:** Implement backend endpoint `/api/recommendations` that calls Gemini (never expose key to browser).
- [ ] **User Recommendations:** Generate product suggestions based on browsing history.
- [ ] **Smart Search:** Integrate Gemini embeddings for semantic product search.
- [ ] **Chatbot:** Add customer support chatbot powered by Gemini.
- [ ] **Testing:** Unit tests for recommendation logic.

## ⏳ Phase 8: Analytics & Observability
*Goal: Monitor user behavior and system health.*

- [ ] **Error Tracking:** Integrate Sentry for error monitoring and alerting.
- [ ] **Analytics:** Add Plausible or Google Analytics for user behavior tracking.
- [ ] **Admin Dashboard:** Create dashboard for sales, orders, and user metrics.
- [ ] **Logging:** Centralized logging (CloudWatch, ELK stack).
- [ ] **Performance Monitoring:** Web Vitals tracking (Lighthouse, SpeedCurve).

## 🎯 Phase 9: Scaling & Operations
*Goal: Prepare for production deployment and multi-region support.*

- [ ] **Containerization:** Dockerfile and docker-compose for local and cloud deployment.
- [ ] **CI/CD:** Expanded GitHub Actions with staging/production deployments.
- [ ] **Infrastructure:** Deploy to AWS/GCP/Vercel with auto-scaling.
- [ ] **Database:** Set up replication and automated backups.
- [ ] **CDN:** Cache static assets globally (CloudFlare, Cloudfront).
- [ ] **Security Headers:** Configure HTTPS, CSP, HSTS, X-Frame-Options.
- [ ] **Multi-Tenancy (Optional):** Support multiple seller accounts (Phase 10).

## 📊 Known Issues & Technical Debt

1. **Lock File Sync:** `package-lock.json` is out of sync with `package.json` due to dependency version updates. Run `npm install` in project root and `/server` to regenerate.
2. **Mock Server Limitations:** File-based JSON storage is not suitable for concurrent writes or multi-instance deployment.
3. **No Rate Limiting:** API endpoints lack protection against brute-force/DoS attacks.
4. **Missing Security Headers:** Deploy behind nginx/Cloudflare to add HTTPS, CSP, and HSTS.
5. **Dev Credentials in Code:** Admin auth is hardcoded for dev; production must use real authentication.
6. **Incomplete Stripe Integration:** Only mock endpoint; real payment processing not yet implemented.

## 🚀 Deployment Status

| Component | Status | Priority |
|-----------|--------|----------|
| Frontend (React/Vite) | ✅ Ready for Vercel/Netlify | - |
| Backend (Express Mock) | ✅ Dev only; replace for prod | High |
| Database | ❌ Not integrated | High |
| Authentication | ⚠️ Dev-only; needs production auth | Critical |
| Payments (Stripe) | ⚠️ Mock only; needs real integration | High |
| AI (Gemini) | ⚠️ Stub only; needs backend proxy | Medium |
| Monitoring (Sentry) | ❌ Not integrated | Medium |

## 📈 Success Metrics

- [ ] All critical security issues (OWASP Top 10) resolved.
- [ ] Unit test coverage >80%.
- [ ] E2E checkout flow fully tested.
- [ ] Real Stripe payments live and tested.
- [ ] Gemini recommendations working end-to-end.
- [ ] <3 second page load (Lighthouse >90).
- [ ] 99.9% uptime SLA.
- [ ] <1% error rate in production.

## 🔗 Key Files by Phase

| Phase | Key Files |
|-------|-----------|
| Security | `context/AuthContext.tsx`, `.env.example`, `.github/workflows/ci.yml` |
| Backend | `server/index.js`, `services/productService.ts`, `services/orderService.ts` |
| Payments | `services/stripeService.ts`, `pages/CheckoutPage.tsx` |
| AI | `services/geminiService.ts` |
| Testing | `vitest.config.ts`, `context/__tests__/*`, `components/__tests__/*` |
| Docs | `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` |

## 🚀 Phase 6: Advanced Features (Current Focus)
*Goal: Feature parity with real-world platforms.*

- [x] **Admin Inventory Management:** Allow adding/editing products.
- [x] **Interactive Tables:** Sortable columns and hover effects.
- [x] **Order Management:** View Details, Update Status.
- [ ] **Wishlist:** Enable saving items for later.
- [ ] **Reviews:** Allow users to leave ratings.

---

## 📝 Changelog
- **[Init]** Created Roadmap and defined phases.
- **[Sec]** Implemented Client-side Auth Protection for `/admin`.
- **[Type]** Fixed `any` typing in Product Filters.
- **[Arch]** Decoupled data fetch into `productService` and `useProducts`.
- **[Val]** Added form validation to Checkout.
- **[Conf]** Added `config.ts`.
- **[Persist]** Added `useLocalStorage` for Cart.
- **[State]** Refactored Cart to `useReducer`.
- **[UI]** Added `MainLayout` and `AdminLayout`.
- **[Perf]** Implemented Code Splitting (React.lazy).
- **[Perf]** Implemented Image Optimization (Lazy loading + Skeletons).
- **[Perf]** Optimized Context with memoization.
- **[UI]** Implemented Global Toast Notification System.
- **[UI]** Implemented Mobile Menu & Cart Animations.
- **[A11y]** Added ARIA labels and Keyboard navigation support for Cart.
- **[Rel]** Added Global Error Boundary.
- **[Rel]** Added 404 Not Found Page.
- **[Test]** Added Cart Logic Unit Tests.
- **[SEO]** Added Dynamic Document Titles.
- **[Logic]** Added Stock Limit Checks.
- **[Test]** Added Integration and E2E Test Files.
- **[Feat]** Implemented Admin CRUD (Add/Edit/Delete).
- **[UX]** Added Sortable Tables and Admin UI Polish.
- **[Feat]** Added Order Service and Admin Order Management.
