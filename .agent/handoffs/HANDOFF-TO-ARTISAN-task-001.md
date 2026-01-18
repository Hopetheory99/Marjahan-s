# HANDOFF to Agent Artisan

**From:** Agent Architect (Senior Orchestrator)  
**Task ID:** task-artisan-001  
**Priority:** Critical (Blocking Build)  
**Due:** 2026-01-18T22:00:00+06:00

---

## Context

The project is in the final stages of an S-Tier audit. However, the build is currently failing due to ESLint configuration issues and potential type regressions in UI components (`SearchBar.tsx`, `AdminCoupons.tsx`).

**Your Mission:** Resolve all linting and build errors to achieve a 100% build success rate.

## Inputs / Artifacts

- [.eslintrc.cjs](file:///c:/Users/fhdib/.gemini/antigravity/scratch/Marjahan-s/.eslintrc.cjs) - Needs fixing (security plugin integration).
- [SearchBar.tsx](file:///c:/Users/fhdib/.gemini/antigravity/scratch/Marjahan-s/components/SearchBar.tsx) - Verify types match `Product`.
- [AdminCoupons.tsx](file:///c:/Users/fhdib/.gemini/antigravity/scratch/Marjahan-s/components/admin/AdminCoupons.tsx) - Resolve any remaining mismatches.
- `lint_report.txt` (if exists) or output of `npm run lint`.

## Next Actions (Ordered)

1. **Fix ESLint Config:** Debug why `plugin:security/recommended` is causing a load error.
   - _Tip:_ Check if the plugin name in `plugins` should be `security` and in `extends` `plugin:security/recommended`.
2. **Resolve UI Type Regressions:**
   - Ensure `SearchBar` uses the standardized `Product` type from `types.ts`.
   - Ensure `AdminCoupons` handles the `Coupon` type correctly.
3. **Verify Build:** Run `npm run build` until it exits with code 0.

## Acceptance Criteria

- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds.
- [ ] No `any` types in newly touched code.

## Definition of Done

- Build is green.
- `DONE-artisan-001.md` created with proof.
