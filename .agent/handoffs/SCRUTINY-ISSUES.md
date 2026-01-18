# Scrutiny Issues Tracker

**Project:** Marjahan's Jewelry E-Commerce  
**Last Updated:** 2026-01-18T05:49:07+06:00

---

## Critical (Fix Immediately)

**NONE** - No critical issues! ✅

---

## High Priority (Fix Before Production)

- [ ] **H1:** Fix TypeScript `any` types in `searchService.ts` (10 instances)
  - File: `services/searchService.ts`
  - Effort: 2-3 hours
  - Create proper interfaces for TypesenseHit, SearchFilters, SearchResult

- [ ] **H2:** Fix TypeScript `any` in `orderService.ts:109`
  - File: `services/orderService.ts`
  - Effort: 30 minutes
  - Create OrderData interface

- [ ] **H3:** Replace console.logs with logger service (13 instances in source)
  - Files: `services/searchService.ts`, `services/emailService.ts`, `services/paymentService.ts`, `services/orderService.ts`
  - Effort: 1-2 hours
  - Use existing logger service

---

## Medium Priority (Fix in Next Sprint)

- [ ] **M1:** Fix TypeScript `any` in `analyticsService.ts:332-333`
  - File: `services/analyticsService.ts`
  - Effort: 1 hour
  - Create GtagEvent interface

- [ ] **M2:** Fix TypeScript `any` in `logger.ts:20`
  - File: `services/logger.ts`
  - Effort: 15 minutes
  - Use `Error | unknown` instead of `any`

- [ ] **M3:** Add Zod validation to Edge Functions
  - File: `supabase/functions/create-payment-intent/index.ts`
  - Effort: 1-2 hours
  - Implement schema validation for request body

- [ ] **M4:** Move hardcoded ALLOWED_ORIGINS to environment variable
  - File: `supabase/functions/create-payment-intent/index.ts:8-13`
  - Effort: 15 minutes
  - Use `Deno.env.get('ALLOWED_ORIGINS')`

- [ ] **M5:** Add Error Boundaries to critical pages
  - Files: `pages/CheckoutPage.tsx`, `pages/AdminPage.tsx`, `pages/ProductsPage.tsx`
  - Effort: 1 hour
  - Implement React Error Boundary components

- [ ] **M6:** Implement rate limiting on Edge Functions
  - Files: All Edge Functions
  - Effort: 2-3 hours
  - Use Supabase middleware or Upstash Redis

---

## Low Priority (Technical Debt)

- [ ] **L1:** Fix `any` type in test file
  - File: `pages/__tests__/CheckoutPage.test.tsx:21`
  - Effort: 5 minutes
  - Use `{ children: React.ReactNode }`

- [ ] **L2:** Add JSDoc comments to exported functions
  - Files: All service files
  - Effort: 3-4 hours
  - Document parameters, return types, and examples

- [ ] **L3:** Remove unused imports
  - Files: Various
  - Effort: 30 minutes
  - Run `npx eslint . --ext .ts,.tsx --fix`

- [ ] **L4:** Audit and add missing alt text
  - Files: Various components
  - Effort: 1 hour
  - Ensure all images have descriptive alt text

- [ ] **L5:** Optimize bundle size
  - Files: Build configuration
  - Effort: 2-3 hours
  - Implement code splitting and lazy loading

---

## Security Issues

- [ ] **S1:** Fix npm audit vulnerabilities (2 high, 4 moderate)
  - Command: `npm audit fix`
  - Effort: 15 minutes
  - Review and apply fixes

---

## Progress Summary

- **Total Issues:** 14
- **Completed:** 0
- **In Progress:** 0
- **Blocked:** 0

---

## Estimated Total Effort

- **High Priority:** 5-8 hours
- **Medium Priority:** 6-8 hours
- **Low Priority:** 10-15 hours
- **Security:** 15 minutes

**Total:** 21-31 hours

---

**Note:** High-priority issues should be fixed before production deployment. Medium and low-priority issues can be addressed in subsequent sprints.
