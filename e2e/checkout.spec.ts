
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('User can add item to cart and complete checkout', async ({ page }) => {
    // 1. Go to Home
    await page.goto('/');
    await expect(page).toHaveTitle(/Home/);

    // 2. Go to Products
    await page.click('text=Shop The Collection');
    await expect(page).toHaveURL(/.*products/);

    // 3. Select a Product
    await page.click('text=Seraphina Diamond Ring');
    await expect(page.locator('h1')).toContainText('Seraphina Diamond Ring');

    // 4. Add to Cart
    await page.selectOption('select#size', '7');
    await page.click('button:has-text("Add to Cart")');
    
    // 5. Verify Toast
    await expect(page.locator('text=Added 1 Seraphina Diamond Ring to bag')).toBeVisible();

    // 6. Open Cart
    await page.click('button[aria-label="Open Shopping Cart"]');
    await expect(page.locator('text=Shopping Bag')).toBeVisible();
    await expect(page.locator('text=Seraphina Diamond Ring')).toBeVisible();

    // 7. Proceed to Checkout
    await page.click('text=Proceed to Checkout');
    await expect(page).toHaveURL(/.*checkout/);

    // 8. Fill Form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="country"]', 'USA');
    await page.fill('input[name="zip"]', '10001');
    
    // 9. Submit Order
    await page.click('button:has-text("Place Order")');

    // 10. Verify Confirmation
    await expect(page).toHaveURL(/.*confirmation/);
    await expect(page.locator('h1')).toContainText('Thank You For Your Order');
  });
});
