import { test, expect } from '@playwright/test';
import { gotoHome, assertAllSectionElementsAreVisible, assertColumnShowsCorrectValues } from './test-helpers';

test('T10 verify calculated values are coherent when on-prem is unknown, cloud is not used, and 100% computers', async ({
  page,
}) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);

  // On Prem Servers
  await page.getByLabel("I don't know").check();
  await expect(page.getByText("We'll make an assumption")).toBeVisible();
  await expect(page.getByText('Number of Servers:')).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toBeDisabled();
  await page.getByLabel('Where are they primarily').selectOption('GBR');
  await page.getByLabel('Where are they primarily').selectOption('WORLD');

  // Cloud
  await page.getByLabel("We don't use cloud services").check();
  await expect(page.getByLabel("We don't use cloud services")).toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).not.toBeVisible();

  // Users

  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('in the UK');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('1000');

  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  }
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T10-apex-chart.png');
  await page.getByRole('tab', { name: 'Table' }).click();

  const expectedEmissionPercentages = [
    '33%',
    '24%',
    '6%',
    '2%',
    '63%',
    '11%',
    '46%',
    '5%',
    '<1%',
    '4%',
    '2%',
    '2%',
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
    ' 2357 kg ',
    ' 1292 kg ',
    ' 1066 kg ',
    ' 56758 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
});
