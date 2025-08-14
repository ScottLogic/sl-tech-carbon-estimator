import { test, expect } from '@playwright/test';
import { assertAllSectionElementsAreVisible, assertTableShowsCorrectCells, gotoHome } from './test-helpers';

test('T15 verify calculated values are coherent with selected employees, servers and users', async ({ page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);

  // Organisation
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('6000');
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 6; i++) {
    await page.getByLabel('What percentage of those').press('ArrowRight');
  }
  await expect(page.getByText('Desktops 80%')).toBeVisible();
  await expect(page.getByText('Laptops 20%')).toBeVisible();

  // On Prem Servers
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('479');
  await page.getByLabel('Where are they primarily').selectOption('Globally');

  // Cloud
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').click();
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('ArrowLeft');
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').fill('50');
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').click();
  for (let i = 0; i < 6; i++) {
    await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('ArrowRight');
  }
  await expect(page.getByText('Cloud 80%')).toBeVisible();
  await expect(page.getByText('On-Premise 20%')).toBeVisible();
  await expect(page.getByLabel('Where are your cloud servers')).toHaveValue('WORLD');
  await page.getByLabel('What is your monthly cloud').selectOption('7: Object');

  // Users
  await page.getByLabel('Where are your end-users').selectOption('in Europe');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('650000');
  await page.getByLabel('What percentage of your end-users').click();
  await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  await expect(page.getByText('Mobile 45%')).toBeVisible();
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await page.getByLabel("What's the primary purpose of your").selectOption('eCommerce');

  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T15-apex-chart.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissions1 = ['35%', '28%', '5%', '2%', '58%', '15%', '39%', '5%', '6%', '6%', '<1%', '<1%', '<1%'];
  const emissionCells1 = page.locator('td:nth-child(2)');
  await expect(emissionCells1).toHaveText(expectedEmissions1);
});
