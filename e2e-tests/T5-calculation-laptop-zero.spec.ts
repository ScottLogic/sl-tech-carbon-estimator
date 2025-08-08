import { test, expect } from '@playwright/test';
import { assertAllSectionElementsAreVisible, gotoHome } from './test-helpers';

test('T5 verify calculated values are coherent when laptop is 0%', async ({ page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);

  // Set laptop percentage to 0% (by moving desktop to 100%)
  await page.getByText('Desktops 50%').click();
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of those').press('ArrowRight');
  }
  await expect(page.getByText('Laptops 0%')).toBeVisible();

  // Configure On-Prem servers
  await page.getByLabel('Where are they primarily located?').press('Enter');
  await page.getByLabel('Where are they primarily located?').selectOption('GBR');
  await page.getByLabel('Where are they primarily located?').selectOption('Globally');

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
  await expect(page.locator('foreignobject')).toHaveScreenshot('T5-apex-chart.png');
});
