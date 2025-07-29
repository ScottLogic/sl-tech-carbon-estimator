import { test, expect } from '@playwright/test';

test('T7 happy path', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();

  // Organisation
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('6000');
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 6; i++) {
    await page.getByLabel('What percentage of those').press('ArrowRight');
  }
  await expect(page.getByText('Desktops 80%')).toBeVisible();

  // On Prem Servers
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('479');
  await page.getByLabel('Where are they primarily').selectOption('Globally');

  // Cloud
  await expect(page.getByText('Tell us about your cloud')).toBeVisible();
  await page.getByText('Cloud 50%').click();
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(page.getByLabel('What percentage of your servers are cloud services vs on-premise?')).toBeVisible();
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').click();
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('ArrowLeft');
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').fill('50');
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').click();
  for (let i = 0; i < 6; i++) {
    await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('ArrowRight');
  }
  await expect(page.getByText('Cloud 80%')).toBeVisible();
  await expect(page.getByLabel('Where are your cloud servers')).toHaveValue('WORLD');
  await expect(page.getByText('What is your monthly cloud')).toBeVisible();
  await page.getByLabel('What is your monthly cloud').selectOption('7: Object');

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await page.getByLabel('Where are your end-users').selectOption('in Europe');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('650000');
  await page.getByLabel('What percentage of your end-users').click();
  await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  await expect(page.locator('form')).toContainText('Mobile 45%');
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await page.getByLabel("What's the primary purpose of your").selectOption('eCommerce');

  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T15-apex-chart.png');
  // await expect(page.locator("foreignobject")).toContainText("Upstream Emissions - 35%");
  // await expect(page.locator("foreignobject")).toContainText("Direct Emissions - 59%");
  // await expect(page.locator("foreignobject")).toContainText("Indirect Emissions - 6%");
  // await expect(page.locator("foreignobject")).toContainText("Downstream Emissions - <1%");
});
