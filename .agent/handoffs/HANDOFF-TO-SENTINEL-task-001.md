# HANDOFF to Agent Sentinel

**From:** Agent Architect (Senior Orchestrator)  
**Task ID:** task-sentinel-001  
**Priority:** High  
**Due:** 2026-01-18 EOD  
**Created:** 2026-01-18T05:28:33+06:00

---

## Context

The Marjahan's project has completed core feature development and is now in the **Hardening & Reliability Phase**. Your mission is to ensure 100% test coverage and reliability for all core business logic, implement visual regression testing, and verify accessibility compliance.

**Current State:**

- `productService.test.ts`: ✅ 9/9 tests passing
- `CheckoutPage.test.tsx`: ✅ 5/5 tests passing
- `ProductCard.test.tsx`: ✅ Tests passing
- `ProductsPage.test.tsx`: ⚠️ 1/2 tests failing (loading state assertion)

**Why This Matters:**
We're transitioning to production. Any untested code path is a potential customer-facing bug that could damage the luxury brand reputation.

---

## Inputs / Artifacts

### Files to Review

- [task.md](file:///C:/Users/fhdib/.gemini/antigravity/brain/cf154202-0595-4959-9822-401e49e33e0c/task.md) - Current task status
- [implementation_plan.md](file:///C:/Users/fhdib/.gemini/antigravity/brain/cf154202-0595-4959-9822-401e49e33e0c/implementation_plan.md) - Strategic roadmap
- [vitest.setup.tsx](file:///c:/Users/fhdib/.gemini/antigravity/scratch/Marjahan-s/vitest.setup.tsx) - Test configuration with browser API mocks

### Test Files

- `services/__tests__/productService.test.ts` ✅
- `pages/__tests__/CheckoutPage.test.tsx` ✅
- `pages/__tests__/ProductsPage.test.tsx` ⚠️
- `components/__tests__/ProductCard.test.tsx` ✅

### Services Requiring Coverage

- `services/couponService.ts` - **0% coverage** (CRITICAL)
- `services/orderService.ts` - **Unknown coverage**
- `services/searchService.ts` - **Unknown coverage**

### Environment Setup

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage --run

# Run specific test file
npm test -- services/__tests__/couponService.test.ts --run
```

---

## Next Actions (Ordered)

### 1. Fix ProductsPage Loading State Test ⚡ IMMEDIATE

**File:** `pages/__tests__/ProductsPage.test.tsx`

**Problem:** Test expects `.animate-pulse` skeleton during loading, but TanStack Query may resolve too quickly in test environment.

**Solution Options:**

- Mock `productService.getAll` to delay resolution
- Use `waitFor` with proper timing
- Verify the loading UI actually renders with `shimmer` class

**Acceptance:**

- [ ] Both ProductsPage tests passing (2/2)
- [ ] Loading skeleton properly tested

---

### 2. Implement Unit Tests for `couponService.ts` 🎯 HIGH PRIORITY

**File:** Create `services/__tests__/couponService.test.ts`

**Coverage Requirements:**

```typescript
// Test scenarios to cover:
✓ verifyCoupon() - valid coupon code
✓ verifyCoupon() - expired coupon
✓ verifyCoupon() - invalid/non-existent code
✓ verifyCoupon() - usage limit exceeded
✓ verifyCoupon() - minimum order not met
✓ applyCoupon() - successful application
✓ applyCoupon() - error handling
✓ removeCoupon() - successful removal
```

**Mock Strategy:**

- Mock Supabase RPC call `verify_coupon`
- Test both success and error paths
- Verify proper error messages

**Acceptance:**

- [ ] `couponService.test.ts` created with 8+ test cases
- [ ] All tests passing
- [ ] Coverage ≥ 90% for `couponService.ts`

---

### 3. Implement Unit Tests for `orderService.ts` 🎯 HIGH PRIORITY

**File:** Create `services/__tests__/orderService.test.ts`

**Coverage Requirements:**

```typescript
// Test scenarios:
✓ createOrder() - successful order creation
✓ createOrder() - validation errors
✓ createOrder() - stock validation
✓ getOrderById() - existing order
✓ getOrderById() - non-existent order
✓ updateOrderStatus() - valid transitions
✓ updateOrderStatus() - invalid transitions
```

**Acceptance:**

- [ ] `orderService.test.ts` created with 7+ test cases
- [ ] All tests passing
- [ ] Coverage ≥ 90% for `orderService.ts`

---

### 4. Playwright Visual Regression Baselines 📸 MEDIUM PRIORITY

**Setup:**

```bash
# Install if needed
npm install -D @playwright/test

# Capture baselines
npx playwright test e2e/visual.spec.ts --update-snapshots
```

**Critical Flows to Capture:**

1. **Admin Dashboard** - Full page with metrics and charts
2. **Checkout Flow** - Cart → Shipping → Payment
3. **Product Detail Page** - With image gallery
4. **Products Page** - Grid view with filters
5. **Mobile Responsive** - Key pages at 375px width

**Acceptance:**

- [ ] 5+ visual baseline snapshots captured
- [ ] Playwright config properly set up
- [ ] Visual regression tests passing

---

### 5. Accessibility Audit 🌐 MEDIUM PRIORITY

**Tools:**

- `@axe-core/playwright` for automated testing
- Manual keyboard navigation testing
- Screen reader compatibility check

**Critical Pages:**

- [ ] Checkout flow (WCAG 2.1 AA)
- [ ] Product browsing (keyboard navigation)
- [ ] Admin dashboard (aria-labels)

**Acceptance:**

- [ ] Zero critical/serious accessibility violations
- [ ] All interactive elements keyboard accessible
- [ ] Proper ARIA labels on dynamic content

---

### 6. Generate Coverage Report 📊 FINAL STEP

```bash
npm test -- --coverage --run
```

**Target Metrics:**

- **Statements:** ≥ 90%
- **Branches:** ≥ 85%
- **Functions:** ≥ 90%
- **Lines:** ≥ 90%

**Acceptance:**

- [ ] Coverage report generated
- [ ] All targets met
- [ ] Report saved to `coverage/` directory

---

## Acceptance Criteria

### Must Have (Blocking)

- [ ] All existing tests passing (100% pass rate)
- [ ] `couponService.test.ts` implemented with ≥90% coverage
- [ ] `orderService.test.ts` implemented with ≥90% coverage
- [ ] ProductsPage loading test fixed
- [ ] Overall coverage ≥ 90% for core services

### Should Have (High Priority)

- [ ] Playwright visual baselines captured (5+ flows)
- [ ] Accessibility audit completed (zero critical issues)
- [ ] Test documentation updated

### Nice to Have (Optional)

- [ ] Performance benchmarks for critical paths
- [ ] E2E tests for checkout flow
- [ ] Load testing results

---

## Blockers / Dependencies

### Known Blockers

1. **Memory Constraints:** Previous Playwright runs hit OOM errors
   - **Mitigation:** Run visual tests in isolation, one spec at a time
   - **Alternative:** Use cloud CI/CD with higher memory limits

2. **TanStack Query Timing:** Fast resolution in tests
   - **Solution:** Use `gcTime: 0` and fresh QueryClient per test

### Dependencies

- ✅ `vitest.setup.tsx` configured with browser API mocks
- ✅ `QueryClientProvider` wrapper in test utilities
- ⚠️ May need to increase Node.js heap size for coverage runs

---

## Definition of Done

### Code Quality

- [ ] All tests passing (0 failures, 0 skipped)
- [ ] No console errors or warnings in test output
- [ ] TypeScript strict mode compliance
- [ ] ESLint/Prettier passing

### Documentation

- [ ] Test files have descriptive `describe` blocks
- [ ] Complex test logic has explanatory comments
- [ ] README updated with testing instructions
- [ ] Coverage report committed to repo

### Handoff

- [ ] `STATUS-sentinel-001.md` updated throughout work
- [ ] `DONE-sentinel-001.md` created with proof of work
- [ ] `HANDOFF-TO-ARCHITECT-sentinel-complete.md` created
- [ ] All artifacts committed to version control

---

## Communication Protocol

### Progress Updates

Create/update `STATUS-sentinel-001.md` every 2-3 hours with:

- Tasks completed
- Current blockers
- ETA to completion

### Blocker Escalation

If blocked >30 minutes:

1. Create `BLOCKER-sentinel-001.md`
2. Document the issue and attempted solutions
3. Request Architect intervention

### Completion

When all acceptance criteria met:

1. Create `DONE-sentinel-001.md` with:
   - Summary of work completed
   - Test results and coverage reports
   - Screenshots of passing tests
   - Known issues or technical debt
2. Create handoff file for Architect review

---

## Resources

### Documentation

- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)

### Example Test Patterns

See existing tests in:

- `services/__tests__/productService.test.ts` - Service mocking patterns
- `pages/__tests__/CheckoutPage.test.tsx` - Complex component testing
- `vitest.setup.tsx` - Global test configuration

---

**Agent Architect Signature:** ✅ Approved for deployment  
**Handoff Time:** 2026-01-18T05:28:33+06:00  
**Expected Completion:** 2026-01-18 EOD

---

**Good luck, Agent Sentinel! The quality of our luxury platform depends on your thoroughness. 🧪✨**
