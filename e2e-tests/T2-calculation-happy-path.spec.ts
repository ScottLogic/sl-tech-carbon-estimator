import { test, expect } from './fixtures';
import {
  gotoHome,
  assertAllSectionElementsAreVisible,
  assertTableShowsCorrectCells,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test('T2 verify calculated values are coherent with selected options', async ({
  organisationSection,
  onPremSection,
  page,
}) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);
  // Organisation
  await organisationSection.selectNumberOfEmployess('100');

  // On Prem
  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('in the UK');
  await onPremSection.selectLocationOfServers('Globally');

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
  await expect(page.locator('foreignobject')).toHaveScreenshot('T2-apex-chart-kilograms.png');
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T2-apex-chart-percentages.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissionPercentages = [
    '34%',
    '25%',
    '7%',
    '2%',
    '65%',
    '12%',
    '47%',
    '6%',
    '1%',
    '1%',
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
    ' 621 kg ',
    ' 621 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 55408 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
});
