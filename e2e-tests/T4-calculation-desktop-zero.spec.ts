import { test, expect } from './fixtures';
import {
  assertAllSectionElementsAreVisible,
  assertTableShowsCorrectCells,
  gotoHome,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test('T4 verify calculated values are coherent when desktop is 0%', async ({ organisationSection, page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);

  // Set desktop percentage to 0%
  await page.getByText('Desktops 50%').click();
  await expect(page.getByLabel('What percentage of those')).toHaveValue('50');

  // await page.getByLabel('What percentage of those').click();
  // for (let i = 0; i < 10; i++) {
  //   await page.getByLabel('What percentage of those').press('ArrowLeft');
  // }

  await organisationSection.sliderPercentageSet('ArrowLeft', 10);

  await expect(page.getByText('Desktops 0%')).toBeVisible();

  // Configure On-Prem servers location
  await page.getByLabel('Where are they primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('GBR');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('Globally');

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
  await expect(page.locator('foreignobject')).toHaveScreenshot('T4-apex-chart-kilograms.png');
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T4-apex-chart-percentages.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissionPercentages = [
    '32%',
    '23%',
    '7%',
    '3%',
    '66%',
    '8%',
    '51%',
    '6%',
    '1%',
    '1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 16508 kg ',
    ' 11583 kg ',
    ' 3625 kg ',
    ' 1300 kg ',
    ' 33374 kg ',
    ' 4091 kg ',
    ' 26190 kg ',
    ' 3093 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 50890 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
});
