import { test, expect } from '@playwright/test';

// This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads

test('Happy Path', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot();

  // await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
  // await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  // await expect(page.getByText('Desktops 50%')).toBeVisible();

  await page.getByText('Laptops 50%').click();
  await expect(page).toHaveScreenshot();

  // await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  // await expect(page.getByLabel('Number of Servers:')).toHaveValue('10');
  // await expect(page.getByLabel('Where are they primarily')).toHaveValue('WORLD');

  // await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  // await expect(page.getByText('Cloud 50%')).toBeVisible();
  // await expect(page.getByText('On-premise 50%')).toBeVisible();
  // await expect(page.getByLabel('Where are your cloud servers')).toHaveValue('WORLD');
  // await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');

  // await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  // await expect(page.getByText('Where are your end-users')).toBeVisible();
  // await expect(page.getByLabel('Where are your end-users')).toHaveValue('WORLD');
  // await expect(page.getByText('How many monthly active users')).toBeVisible();
  // await expect(page.getByLabel('How many monthly active users')).toHaveValue('100');
  // await expect(page.getByText('Mobile 50%')).toBeVisible();
  // await expect(page.getByText('Computer 50%')).toBeVisible();
  // await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  // await expect(page.getByLabel("What's the primary purpose of your")).toHaveValue('average');

  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page).toHaveScreenshot();

  // await expect(page.locator('foreignobject')).toContainText('Upstream Emissions - 33%');
  // await expect(page.locator('foreignobject')).toContainText('Direct Emissions - 65%');
  // await expect(page.locator('foreignobject')).toContainText('Indirect Emissions - 1%');
  // await expect(page.locator('foreignobject')).toContainText('Downstream Emissions - <1%');
});
