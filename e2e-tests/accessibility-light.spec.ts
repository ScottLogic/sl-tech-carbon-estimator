import { test, expect } from '@playwright/test';
import { expectNoA11yViolations } from './helper-methods';

test('Lightmode Accessibility test', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ colorScheme: 'light' });

  // Initial accessibility check
  await expectNoA11yViolations(page);

  // Run check on default page load
  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
  await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await page.getByText('Laptops 50%').click();
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toHaveValue('10');
  await expect(page.getByLabel('Where are they primarily')).toHaveValue('WORLD');
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(page.getByText('On-premise 50%')).toBeVisible();
  await expect(page.getByLabel('Where are your cloud servers')).toHaveValue('WORLD');
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await expect(page.getByLabel('Where are your end-users')).toHaveValue('WORLD');
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await expect(page.getByLabel('How many monthly active users')).toHaveValue('100');
  await expect(page.getByText('Mobile 50%')).toBeVisible();
  await expect(page.getByText('Computer 50%')).toBeVisible();
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await expect(page.getByLabel("What's the primary purpose of your")).toHaveValue('average');

  // After filling form, check accessibility again
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expectNoA11yViolations(page);

  // Table view accessibility check
  await page.getByRole('tab', { name: 'Table' }).click();
  await expectNoA11yViolations(page);
});
