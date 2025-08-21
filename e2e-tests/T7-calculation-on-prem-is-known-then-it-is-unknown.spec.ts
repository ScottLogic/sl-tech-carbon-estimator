import { test, expect } from './fixtures';
import {
  assertCloudElementVisibility,
  assertAllSectionElementsAreVisible,
  gotoHome,
  assertEndUserElementVisibility,
  assertTableShowsCorrectCells,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test('T7 verify calculated values are coherent when on-prem is known then recalulated when unknown ', async ({
  page,
}) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);

  // On Prem
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('555');
  await page.getByLabel('Where are they primarily').selectOption('GBR');
  await page.getByLabel('Where are they primarily').selectOption('WORLD');

  // Cloud
  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');

  // Users
  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('Globally');
  await page.getByLabel("What's the primary purpose of").selectOption('socialMedia');
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T7-apex-chart-kilograms.png');
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T7-apex-chart-percentages.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissionPercentages = [
    '13%',
    '<1%',
    '12%',
    '<1%',
    '87%',
    '<1%',
    '85%',
    '1%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 221721 kg ',
    ' 13708 kg ',
    ' 201188 kg ',
    ' 6825 kg ',
    ' 1482466 kg ',
    ' 6485 kg ',
    ' 1453521 kg ',
    ' 22460 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 1705194 kg ',
  ];

  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
  await page.getByRole('tab', { name: 'Diagram' }).click();

  // On Prem
  await page.getByLabel("I don't know").check();
  await page.getByLabel('Where are they primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('in the UK');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('Globally');

  // Cloud
  await assertCloudElementVisibility(page);

  // Users
  await assertEndUserElementVisibility(page);
  await page.getByLabel("What's the primary purpose of").selectOption('information');
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await page.getByText('kg', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T7-apex-chart-kilograms-1.png');
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T7-apex-chart-percentages-1.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissionPercentages1 = [
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
  const expectedEmissionKilograms1 = [
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
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms1);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages1);
});
