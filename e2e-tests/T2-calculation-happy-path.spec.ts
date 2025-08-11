import { test, expect } from '@playwright/test';
import { gotoHome, assertAllSectionElementsAreVisible, assertTableShowsCorrectCells } from './test-helpers';

test('T2 verify calculated values are coherent with selected options', async ({ page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);
  // Organisation
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('100');

  // On Prem
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('10');
  await page.getByLabel('Where are they primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('in the UK');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('Globally');

  // Cloud
  await page.getByText('On-premise 50%').click();
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('Tab');
  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');
  await page.getByLabel('What is your monthly cloud').selectOption('0: Object');

  // Users
  await page.getByText("What's the primary purpose of").click();
  await page.getByLabel("What's the primary purpose of").selectOption('average');
  await page.getByLabel('Where are your end-users').selectOption('GBR');
  await page.getByLabel('Where are your end-users').selectOption('Globally');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('100');

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  // await expect(page.locator('foreignobject')).toHaveScreenshot('T2-apex-chart.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);
  const expectedEmissions = ['34%', '25%', '7%', '2%', '65%', '12%', '47%', '6%', '1%', '1%', '<1%', '<1%', '<1%'];
  // Locate all emissions cells (adjust selector based on your DOM structure)
  const emissionCells = page.locator('td:nth-child(2)'); // Assuming emissions is 2nd column
  // Assert all values at once
  await expect(emissionCells).toHaveText(expectedEmissions);
});
