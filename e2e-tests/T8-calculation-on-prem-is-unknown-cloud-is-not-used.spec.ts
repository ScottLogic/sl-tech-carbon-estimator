import { test, expect } from '@playwright/test';
import { gotoHome, assertAllSectionElementsAreVisible, assertColumnShowsCorrectValues } from './test-helpers';

test('T8 verify calculated values are coherent when on prem is unknown and cloud is not used', async ({ page }) => {
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
  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('Globally');
  await page.getByLabel("What's the primary purpose of").selectOption('socialMedia');
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T8-apex-chart.png');
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
  await assertColumnShowsCorrectValues(page, '3', expectedEmissionPercentages);
});
