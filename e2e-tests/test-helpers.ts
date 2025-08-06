import { Page, expect } from '@playwright/test';

export async function gotoHome(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
}

export async function organisationVisibility(page: Page) {
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  await expect(page.getByText('To understand the scale of')).toBeVisible();
  await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await expect(page.getByText('Laptops 50%')).toBeVisible();
  await expect(page.getByText('What percentage of those')).toBeVisible();
}
