import { test, expect } from '@playwright/test';
import {
  gotoHome,
  resultsTabVisibilityCheck,
  assertAllSectionElementsAreVisible,
  spinButtonFill,
} from './test-helpers';

test.describe('Default page load and error handling', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await assertAllSectionElementsAreVisible(page);
    await resultsTabVisibilityCheck(page);
  });
  test('Number of servers must be >= 0', async ({ page }) => {
    await spinButtonFill(page, 'Number of Servers:', '-1');
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of servers must be' })).toBeVisible();

    await spinButtonFill(page, 'Number of Servers:', '0');
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of servers must be' })).not.toBeVisible();

    // await expect(page.locator('foreignobject')).toHaveScreenshot('T0-apex-chart.png');
  });
  test('Number of employees must be > 0 ', async ({ page }) => {
    await spinButtonFill(page, 'How many employees are in the', '0');
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of employees must be' })).toBeVisible();

    // await expect(page.locator('foreignobject')).toHaveScreenshot('T0-apex-chart.png');
  });
});
