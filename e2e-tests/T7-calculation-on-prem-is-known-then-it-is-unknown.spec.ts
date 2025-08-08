import { test, expect } from '@playwright/test';
import {
  assertCloudElementVisibility,
  assertAllSectionElementsAreVisible,
  gotoHome,
  assertEndUserElementVisibility,
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
  await expect(page.locator('foreignobject')).toHaveScreenshot('T7-apex-chart.png');

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
  await expect(page.locator('foreignobject')).toHaveScreenshot('T7-apex-chart-1.png');
});
