import { test, expect } from '@playwright/test';
import {
  assertAllSectionElementsAreVisible,
  assertColumnShowsCorrectValues,
  assertTableShowsCorrectCells,
  gotoHome,
} from './test-helpers';

test('T14 verify calculated values are coherent with selected employees, servers and users', async ({ page }) => {
  await gotoHome(page);
  await assertAllSectionElementsAreVisible(page);

  // Organisation
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('25000');
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 6; i++) {
    await page.getByLabel('What percentage of those').press('ArrowRight');
  }
  await expect(page.getByText('Desktops 80%')).toBeVisible();

  // On Prem Servers
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('500');
  await expect(page.getByLabel('Where are they primarily')).toHaveValue('WORLD');

  // Cloud
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').click();
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('ArrowLeft');
  await expect(page.getByText('Cloud 45%')).toBeVisible();

  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');

  // Users
  await page.getByLabel('Where are your end-users').selectOption('in North America');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('10000000');
  await page.getByLabel('What percentage of your end-users').click();
  for (let i = 0; i < 6; i++) {
    await page.getByLabel('What percentage of your end-users').press('ArrowRight');
  }
  await expect(page.locator('form')).toContainText('Mobile 80%');
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await page.getByLabel("What's the primary purpose of your").selectOption('streaming');

  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T14-apex-chart.png');
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertTableShowsCorrectCells(page);

  const expectedEmissionPercentages = [
    '6%',
    '5%',
    '<1%',
    '<1%',
    '6%',
    '3%',
    '2%',
    '<1%',
    '<1%',
    '<1%',
    '88%',
    '16%',
    '73%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 4186271 kg ',
    ' 3745833 kg ',
    ' 181250 kg ',
    ' 259188 kg ',
    ' 3871387 kg ',
    ' 1980187 kg ',
    ' 1309478 kg ',
    ' 581722 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 61357707 kg ',
    ' 10817286 kg ',
    ' 50540421 kg ',
    ' 69415986 kg ',
  ];
  await assertColumnShowsCorrectValues(page, '2', expectedEmissionKilograms);
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
});
