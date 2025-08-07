import { test, expect } from '@playwright/test';
import { defaultPageElementVisibility, gotoHome } from './test-helpers';

test('T4 verify calculated values are coherent when desktop is 0%', async ({ page }) => {
  await gotoHome(page);
  await defaultPageElementVisibility(page);

  // Set desktop percentage to 0%
  await page.getByText('Desktops 50%').click();
  await expect(page.getByLabel('What percentage of those')).toHaveValue('50');
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of those').press('ArrowLeft');
  }
  await expect(page.getByText('Desktops 0%')).toBeVisible();

  // Configure On-Prem servers location
  await page.getByLabel('Where are they primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('GBR');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('Globally');

  // Configure Cloud settings
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').click();
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('ArrowLeft');
  await expect(page.getByText('Cloud 45%')).toBeVisible();
  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');

  // Configure Users
  await page.getByLabel("What's the primary purpose of").selectOption('information');
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate and verify
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T4-apex-chart.png');
});
