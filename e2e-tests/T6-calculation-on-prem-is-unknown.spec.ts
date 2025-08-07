import { test, expect } from '@playwright/test';
import { defaultPageElementVisibility, gotoHome } from './test-helpers';

//This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
//User checks On Premise "Don't know" checkbox | Only selection made

test('T6 verify calculated values are coherent when on-prem is unknown', async ({ page }) => {
  await gotoHome(page);
  await defaultPageElementVisibility(page);

  // On Prem
  await page.getByLabel("I don't know").check();
  await expect(page.getByLabel('Number of Servers:')).toBeDisabled();
  await page.getByLabel('Where are they primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('in the UK');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('Globally');

  // Cloud
  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');

  // Users
  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('Globally');
  await expect(page.getByLabel('How many monthly active users')).toHaveValue('100');
  await page.getByLabel("What's the primary purpose of").selectOption('socialMedia');
  await page.getByLabel("What's the primary purpose of").selectOption('average');
  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T6-apex-chart.png');
});
