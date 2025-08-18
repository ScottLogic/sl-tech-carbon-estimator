import { test, expect } from '@playwright/test';
import {
  gotoHome,
  resultsTabVisibilityCheck,
  assertAllSectionElementsAreVisible,
  spinButtonFill,
} from './test-helpers';

test.describe('Assert errors based on input value', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await assertAllSectionElementsAreVisible(page);
    await resultsTabVisibilityCheck(page);
  });
  test('Assert error when number of servers is -1', async ({ page }) => {
    await spinButtonFill(page, 'Number of Servers:', '-1');
    await expect(page.locator('#numberOfServersError').getByText('The number of servers')).toBeVisible();
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of servers must be' })).toBeVisible();
  });

  test('Assert no Error when number of servers is 0', async ({ page }) => {
    await spinButtonFill(page, 'Number of Servers:', '0');
    await expect(page.locator('#numberOfServersError').getByText('The number of servers')).not.toBeVisible();
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of servers must be' })).not.toBeVisible();
  });

  test('Assert error when number of employees is 0 ', async ({ page }) => {
    //initial msg
    await spinButtonFill(page, 'How many employees are in the', '0');
    await expect(page.locator('#headCountError').getByText('The number of employees')).toBeVisible();
    //message after clicking calculate
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of employees must be' })).toBeVisible();
  });

  test('Assert error when number of employees is -1 ', async ({ page }) => {
    //initial msg
    await spinButtonFill(page, 'How many employees are in the', '-1');
    await expect(page.locator('#headCountError').getByText('The number of employees')).toBeVisible();
    //message after clicking calculate
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of employees must be' })).toBeVisible();
  });

  test('Assert no error when number of employees is 1 ', async ({ page }) => {
    //initial msg
    await spinButtonFill(page, 'How many employees are in the', '1');
    await expect(page.locator('#headCountError').getByText('The number of employees')).not.toBeVisible();
    //message after clicking calculate
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of employees must be' })).not.toBeVisible();
  });

  test('Asser error when number of users is 0 ', async ({ page }) => {
    //initial msg
    await spinButtonFill(page, 'How many monthly active users', '0');
    await expect(page.locator('#monthlyActiveUsersError').getByText('The number of monthly active')).toBeVisible();
    //message after clicking calculate
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of monthly active' })).toBeVisible();
  });

  test('Assert error when number of users is -1 ', async ({ page }) => {
    //initial msg
    await spinButtonFill(page, 'How many monthly active users', '-1');
    await expect(page.locator('#monthlyActiveUsersError').getByText('The number of monthly active')).toBeVisible();
    //message after clicking calculate
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of monthly active' })).toBeVisible();
  });

  test('Assert no error when number of users is 1 ', async ({ page }) => {
    //initial msg
    await spinButtonFill(page, 'How many monthly active users', '1');
    await expect(page.locator('#monthlyActiveUsersError').getByText('The number of monthly active')).not.toBeVisible();
    //message after clicking calculate
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('link', { name: 'The number of monthly active' })).not.toBeVisible();
  });
});
