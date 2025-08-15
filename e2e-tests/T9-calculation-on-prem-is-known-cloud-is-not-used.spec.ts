import { test, expect } from '@playwright/test';
import { gotoHome, assertAllSectionElementsAreVisible, assertColumnShowsCorrectValues } from './test-helpers';

test('T9 verify calculated values are coherent when on-prem is known and cloud is not used', async ({ page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);

  // On Prem Servers
  await page.getByLabel('Where are they primarily').selectOption('GBR');
  await page.getByLabel('Where are they primarily').selectOption('WORLD');

  // Cloud
  await page.getByLabel("We don't use cloud services").check();
  await expect(page.getByLabel("We don't use cloud services")).toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).not.toBeVisible();

  // Users
  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('Globally');
  await page.getByLabel("What's the primary purpose of").selectOption('socialMedia');
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T9-apex-chart-kilograms.png');
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T9-apex-chart-percentages.png');
  await page.getByRole('tab', { name: 'Table' }).click();

  const expectedEmissionPercentages = [
    '34%',
    '25%',
    '7%',
    '2%',
    '65%',
    '12%',
    '48%',
    '6%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 18633 kg ',
    ' 13708 kg ',
    ' 3625 kg ',
    ' 1300 kg ',
    ' 35767 kg ',
    ' 6485 kg ',
    ' 26190 kg ',
    ' 3093 kg ',
    ' <1 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 54787 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
});
