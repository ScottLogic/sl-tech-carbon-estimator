import { test, expect } from './fixtures';
import {
  assertAllSectionElementsAreVisible,
  assertTableShowsCorrectCells,
  gotoHome,
  assertColumnShowsCorrectValues,
} from './test-helpers';
import { assert } from 'console';

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
  await expect(page.locator('foreignobject')).toHaveScreenshot('T5-apex-chart-kilograms.png');
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T5-apex-chart-percentages.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissionPercentages = [
    '35%',
    '26%',
    '6%',
    '2%',
    '64%',
    '15%',
    '44%',
    '5%',
    '1%',
    '1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 20758 kg ',
    ' 15833 kg ',
    ' 3625 kg ',
    ' 1300 kg ',
    ' 38161 kg ',
    ' 8878 kg ',
    ' 26190 kg ',
    ' 3093 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 59927 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
});
