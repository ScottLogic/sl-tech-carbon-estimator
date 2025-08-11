import { test, expect } from '@playwright/test';
import { gotoHome, assertAllSectionElementsAreVisible } from './test-helpers';

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
  await expect(page.locator('foreignobject')).toHaveScreenshot('T10-apex-chart.png');
});
