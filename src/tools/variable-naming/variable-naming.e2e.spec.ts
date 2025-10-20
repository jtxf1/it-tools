import { test, expect } from '@playwright/test';

test.describe('Tool - Variable naming', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/variable-naming');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Variable naming - IT Tools');
  });

  test('', async ({ page }) => {

  });
});