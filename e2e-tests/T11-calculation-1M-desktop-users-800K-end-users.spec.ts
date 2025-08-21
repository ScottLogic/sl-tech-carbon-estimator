import { test, expect } from './fixtures';
import {
  gotoHome,
  assertAllSectionElementsAreVisible,
  assertTableShowsCorrectCells,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test('T11 verify calculated values are coherent with selected employees, servers and users', async ({ page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);
  // Organisation
  await page.getByLabel('How many employees are in the').fill('1000000');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of those').press('ArrowRight');
  }
  await expect(page.getByText('Desktops 100%')).toBeVisible();
  await expect(page.getByText('Laptops 0%')).toBeVisible();

  // On Prem Servers
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('100');
  await page.getByLabel('Where are they primarily').selectOption('unknown');

  // Cloud
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').click();
  for (let i = 0; i < 7; i++) {
    await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('ArrowLeft');
  }
  await expect(page.getByText('Cloud 15%')).toBeVisible();
  await page.getByLabel('What is your monthly cloud').selectOption('4: Object');

  // Users
  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('Globally');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('800000');
  await page.getByLabel('What percentage of your end-users').click();
  await page.getByLabel('What percentage of your end-users').click();
  for (let i = 0; i < 7; i++) {
    await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  }
  await page.getByLabel("What's the primary purpose of ").selectOption('socialMedia');
  await page.getByText('Mobile 15%').click();

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T11-apex-chart-kilograms.png');
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T11-apex-chart-percentages.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissionPercentages = [
    '59%',
    '55%',
    '<1%',
    '4%',
    '39%',
    '31%',
    '<1%',
    '8%',
    '<1%',
    '<1%',
    '2%',
    '1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 168526971 kg ',
    ' 158333333 kg ',
    ' 36250 kg ',
    ' 10157388 kg ',
    ' 111580461 kg ',
    ' 88782024 kg ',
    ' 261896 kg ',
    ' 22536541 kg ',
    ' 18626 kg ',
    ' 18626 kg ',
    ' 5631418 kg ',
    ' 3342687 kg ',
    ' 2288731 kg ',
    ' 285757476 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
});
