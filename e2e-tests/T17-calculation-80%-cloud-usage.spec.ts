import { test, expect } from '@playwright/test';
import { gotoHome, assertAllSectionElementsAreVisible } from './test-helpers';

test('T17 calculations show 80% cloud usage', async ({ page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);
  // Organisation

  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('1000');
  await expect(page.getByText('What percentage of those')).toBeVisible();

  // On Prem
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('10');
  await page.getByLabel('Where are they primarily').selectOption('WORLD');

  // Cloud
  await page.getByText('On-premise 50%').click();
  await page.getByLabel('Where are your cloud servers').selectOption('in the UK');
  await page.getByLabel('What is your monthly cloud').selectOption('10: Object'); // $1m-$2m

  // Users
  await page.getByLabel('Where are your end-users').selectOption('in the UK');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('100');
  await page.getByLabel("What's the primary purpose of your").selectOption('streaming');

  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T17-apex-chart.png');
});
