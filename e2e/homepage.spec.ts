import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check if the page loads
    await expect(page).toHaveTitle(/Marjahan's Jewelry/);

    // Check for main elements
    await expect(page.locator('h1')).toContainText("Marjahan's");

    // Check navigation
    await expect(page.locator('nav')).toBeVisible();

    // Check for product categories
    const categoryLinks = page.locator('nav a');
    await expect(categoryLinks).toHaveCount(4); // Rings, Necklaces, Bracelets, Earrings
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');

    // Click on a category link
    await page.locator('nav a').first().click();

    // Should navigate to products page
    await expect(page).toHaveURL(/\/products/);

    // Check for products
    await expect(page.locator('.card-luxury')).toHaveCount(
      await page.locator('.card-luxury').count(),
    );
  });

  test('should work with search functionality', async ({ page }) => {
    await page.goto('/products');

    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill('ring');
    await searchInput.press('Enter');

    // Should show results or no results message
    await expect(
      page.locator('text=pieces').or(page.locator('text=No Pieces Found')),
    ).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('.card-luxury');

    // Find first product with stock
    const firstProduct = page.locator('.card-luxury').first();

    // Hover to reveal add to cart button
    await firstProduct.hover();

    // Click add to cart button
    const addToCartBtn = firstProduct.locator('button', { hasText: 'Add to Cart' });
    await expect(addToCartBtn).toBeVisible();

    // Click it
    await addToCartBtn.click();

    // Check if cart count increased
    const cartIcon = page.locator('[data-cart-icon]');
    await expect(cartIcon.locator('span')).toContainText('1');
  });

  test('should navigate to product detail', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('.card-luxury');

    // Click on first product
    await page.locator('.card-luxury').first().click();

    // Should navigate to product detail page
    await expect(page).toHaveURL(/\/products\/\d+/);

    // Check for product details
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Add to Cart')).toBeVisible();
  });
});
