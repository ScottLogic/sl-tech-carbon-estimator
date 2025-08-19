import { test, expect } from '@playwright/test';
import {
  assertAllSectionElementsAreVisible,
  assertTableShowsCorrectCells,
  gotoHome,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test('T13 verify calculated values are coherent with selected employees, servers and users', async ({ page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);
  // Organisation
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('500');
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 4; i++) {
    await page.getByLabel('What percentage of those').press('ArrowLeft');
  }
  await expect(page.getByText('Desktops 30%')).toBeVisible();

  // On Prem Servers
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('100');

  // Cloud
  await page.getByLabel("We don't use cloud services").check();
  await expect(page.getByLabel("We don't use cloud services")).toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).not.toBeVisible();

  // Users
  await page.getByLabel('Where are your end-users').selectOption('in the UK');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('3333');
  await page.getByLabel('What percentage of your end-users').click();
  await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of your end-users').press('ArrowRight');
  }
  await expect(page.locator('form')).toContainText('Mobile 95%');
  await page.getByLabel("What's the primary purpose of your").selectOption('information');

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T13-apex-chart-kilograms.png');
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T13-apex-chart-percentages.png');
  await page.getByRole('tab', { name: 'Table' }).click();

  const expectedEmissionPercentages = [
    '26%',
    '16%',
    '9%',
    '2%',
    '74%',
    '7%',
    '64%',
    '4%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 106879 kg ',
    ' 64292 kg ',
    ' 36250 kg ',
    ' 6338 kg ',
    ' 305055 kg ',
    ' 27636 kg ',
    ' 261896 kg ',
    ' 15524 kg ',
    ' <1 kg ',
    ' 1 kg ',
    ' <1 kg ',
    ' <1 kg ',
    ' 411936 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
  await page.getByRole('tab', { name: 'Diagram' }).click();

  // Cloud2
  await page.getByLabel("We don't use cloud services").uncheck();
  await expect(page.getByLabel('Where are your cloud servers')).toBeVisible();
  await page.getByLabel('Where are your cloud servers').selectOption('Globally');
  await page.getByLabel('Where are your cloud servers').selectOption("I don't know");

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T13-apex-chart-1.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissionPercentages1 = [
    '26%',
    '16%',
    '9%',
    '2%',
    '74%',
    '7%',
    '63%',
    '4%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms1 = [
    ' 106879 kg ',
    ' 64292 kg ',
    ' 36250 kg ',
    ' 6338 kg ',
    ' 305055 kg ',
    ' 27636 kg ',
    ' 261896 kg ',
    ' 15524 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 1 kg ',
    ' <1 kg ',
    ' <1 kg ',
    ' 412557 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms1);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages1);
});
