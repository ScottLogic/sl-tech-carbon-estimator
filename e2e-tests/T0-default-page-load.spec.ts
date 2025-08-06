import { test, expect } from '@playwright/test';
import { cloudVisibility, gotoHome, onPremiseVisibility, organisationVisibility } from './test-helpers';

// This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads

test('Default page screenshot assertion,elements are visible and apex chart displays expected values', async ({
  page,
}) => {
  await gotoHome(page);
  await organisationVisibility(page);
  await onPremiseVisibility(page);
  await cloudVisibility(page);
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await expect(page.getByLabel('Where are your end-users')).toHaveValue('WORLD');
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await expect(page.getByLabel('How many monthly active users')).toHaveValue('100');
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await expect(page.getByLabel("What's the primary purpose of your")).toHaveValue('average');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T0-apex-chart.png');
});
