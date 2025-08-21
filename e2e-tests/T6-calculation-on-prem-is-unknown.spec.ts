import { test, expect } from './fixtures';
import {
  assertAllSectionElementsAreVisible,
  assertTableShowsCorrectCells,
  gotoHome,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test('T6 verify calculated values are coherent when on-prem is unknown', async ({ page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);

  // On Prem
  await page.getByLabel("I don't know").check();
  await expect(page.getByLabel('Number of Servers:')).toBeDisabled();
  await page.getByLabel('Where are they primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('in the UK');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('Globally');

  // Cloud
  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');

  // Users
  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('Globally');
  await expect(page.getByLabel('How many monthly active users')).toHaveValue('100');
  await page.getByLabel("What's the primary purpose of").selectOption('socialMedia');
  await page.getByLabel("What's the primary purpose of").selectOption('average');
  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T6-apex-chart-kilograms.png');
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T6-apex-chart-percentages.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissionPercentages = [
    '42%',
    '34%',
    '4%',
    '3%',
    '56%',
    '16%',
    '32%',
    '8%',
    '2%',
    '2%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 16821 kg ',
    ' 13708 kg ',
    ' 1813 kg ',
    ' 1300 kg ',
    ' 22673 kg ',
    ' 6485 kg ',
    ' 13095 kg ',
    ' 3093 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 40501 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
});
