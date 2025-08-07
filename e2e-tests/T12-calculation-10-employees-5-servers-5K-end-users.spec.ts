import { test, expect } from '@playwright/test';
import { gotoHome, defaultPageElementVisibility } from './test-helpers';

test('T12 verify calculated values are coherent with selected employees, servers and users', async ({ page }) => {
  await gotoHome(page);
  await defaultPageElementVisibility(page);
  // Organisation
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('10');
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of those').press('ArrowLeft');
  }

  // On Prem Servers
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('5');
  await page.getByLabel('Where are they primarily').selectOption({ label: 'in the UK' });

  // Cloud
  await page.getByLabel("We don't use cloud services").check();
  await expect(page.getByLabel("We don't use cloud services")).toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).not.toBeVisible();

  // Users
  await page.getByLabel('Where are your end-users').selectOption({ label: 'in the UK' });
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('5000');
  await page.getByLabel('What percentage of your end-users').click();
  await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  for (let i = 0; i < 5; i++) {
    await page.getByLabel('What percentage of your end-users').press('ArrowRight');
  }
  await expect(page.getByText('Mobile 70%')).toBeVisible();
  await page.getByLabel("What's the primary purpose of").selectOption('eCommerce');

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T12-apex-chart.png');
});
