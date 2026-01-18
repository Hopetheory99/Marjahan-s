import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('Homepage should maintain luxury aesthetic', async ({ page }) => {
    await page.goto('/');
    // Wait for animations and fonts
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('Admin Dashboard should show royal metrics', async ({ page }) => {
    await page.goto('/#/admin');
    // Wait for the "Total Revenue" text which indicates dashboard data is loaded
    await page.waitForSelector('text=Total Revenue', { timeout: 15000 });
    // Hide dynamic elements like charts or randomly generated IDs if any
    await expect(page).toHaveScreenshot('admin-dashboard.png', {
      fullPage: true,
      mask: [page.locator('[data-testid="dynamic-stat"]')],
    });
  });

  test('Checkout Page should look premium', async ({ page }) => {
    await page.goto('/#/checkout');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('checkout.png', { fullPage: true });
  });

  test('Mobile Homepage view', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Only run on mobile devices');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage-mobile.png', { fullPage: true });
  });
});
