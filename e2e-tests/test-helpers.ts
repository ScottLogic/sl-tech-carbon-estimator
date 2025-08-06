import { Page, expect } from '@playwright/test';

export async function gotoHome(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
}
