import { test, expect } from '@playwright/test';
import { gotoHome, defaultPageElementVisibility } from './test-helpers';

test('T17 calculations show 80% cloud usage', async ({ page }) => {
  await gotoHome(page);
  await defaultPageElementVisibility(page);
  // Organisation
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  await expect(page.getByText('To understand the scale of')).toBeVisible();
  await expect(page.getByText('How many employees are in the')).toBeVisible();
  await expect(page.getByLabel('How many employees are in the')).toBeVisible();
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('1000');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await expect(page.getByText('Laptops 50%')).toBeVisible();
  await expect(page.getByLabel('What percentage of those')).toBeVisible();

  // On Prem
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(page.getByText("We'll use the number of")).toBeVisible();
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await expect(page.locator('label', { hasText: "I don't know" })).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toBeVisible();
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('10');
  await expect(page.getByText('Where are they primarily')).toBeVisible();
  await expect(page.getByLabel('Where are they primarily')).toBeVisible();
  await page.getByLabel('Where are they primarily').selectOption('WORLD');

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('Tell us about your cloud')).toBeVisible();
  await expect(page.getByText("We don't use cloud services")).toBeVisible();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).toBeVisible();
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(
    page.getByText('What percentage of your servers are cloud services vs on-premise?Cloud 50%On-')
  ).toBeVisible();
  await page.getByText('On-premise 50%').click();
  await expect(page.getByText('Where are your cloud servers')).toBeVisible();
  await expect(page.getByLabel('Where are your cloud servers')).toBeVisible();
  await page.getByLabel('Where are your cloud servers').selectOption('in the UK');
  await expect(page.getByText('We have derived a rough')).toBeVisible();
  await expect(page.getByText('What is your monthly cloud')).toBeVisible();
  await page.getByLabel('What is your monthly cloud').selectOption('10: Object'); // $1m-$2m

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await expect(page.getByText('Tell us about your end-users - ')).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await expect(page.getByLabel('Where are your end-users')).toBeVisible();
  await page.getByLabel('Where are your end-users').selectOption('in the UK');
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await expect(page.getByLabel('How many monthly active users')).toBeVisible();
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('100');
  await expect(page.getByText('What percentage of your end-users')).toBeVisible();
  await expect(page.getByText('Mobile 50%')).toBeVisible();
  await expect(page.getByText('Computer 50%')).toBeVisible();
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await page.getByLabel("What's the primary purpose of your").selectOption('streaming');

  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T17-apex-chart.png');
});
