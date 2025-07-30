import { test, expect } from '@playwright/test';

test('T11 verify calculated values are coherent with selected employees, servers and users', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
  // Organisation
  await page.getByLabel('How many employees are in the').fill('1000000');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of those').press('ArrowRight');
  }
  await expect(page.getByText('Desktops 100%')).toBeVisible();
  await expect(page.getByText('Laptops 0%')).toBeVisible();

  // On Prem Servers
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('100');
  await page.getByLabel('Where are they primarily').selectOption('unknown');

  // Cloud
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').click();
  for (let i = 0; i < 7; i++) {
    await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('ArrowLeft');
  }
  await expect(page.getByText('Cloud 15%')).toBeVisible();
  await page.getByLabel('What is your monthly cloud').selectOption('4: Object');

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await expect(page.getByText('Tell us about your end-users -')).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('Globally');
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('800000');
  await expect(page.getByText('What percentage of your end-users')).toBeVisible();
  await page.getByLabel('What percentage of your end-users').click();
  await page.getByLabel('What percentage of your end-users').click();
  for (let i = 0; i < 7; i++) {
    await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  }
  await page.getByLabel("What's the primary purpose of ").selectOption('socialMedia');
  await page.getByText('Mobile 15%').click();

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T11-apex-chart.png');
});
