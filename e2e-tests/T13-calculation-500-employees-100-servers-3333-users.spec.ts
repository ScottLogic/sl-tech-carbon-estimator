import { test, expect } from '@playwright/test';

test('T13 verify calculated values are coherent with selected employees, servers and users', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();

  // Part 1
  // Organisation
  await expect(page.getByText('How many employees are in the')).toBeVisible();
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('500');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 4; i++) {
    await page.getByLabel('What percentage of those').press('ArrowLeft');
  }
  await expect(page.getByText('Desktops 30%')).toBeVisible();

  // On Prem Servers
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await expect(page.getByText('Number of Servers:')).toBeVisible();
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('100');
  await expect(page.getByText('Where are they primarily')).toBeVisible();
  await expect(page.getByLabel('Where are they primarily')).toHaveValue('WORLD');

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await page.getByLabel("We don't use cloud services").check();
  await expect(page.getByLabel("We don't use cloud services")).toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).not.toBeVisible();

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await page.getByLabel('Where are your end-users').selectOption('in the UK');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('3333');
  await page.getByLabel('What percentage of your end-users').click();
  await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of your end-users').press('ArrowRight');
  }
  await expect(page.locator('form')).toContainText('Mobile 95%');
  await page.getByLabel("What's the primary purpose of your").selectOption('information');

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T13-apex-chart.png');

  // Part 2
  // "Unknown" uses the "Global as default calcs
  // "Change "Global" to "I don't know" and then ensure calcs are the same

  // Cloud
  await expect(page.getByText('Tell us about your cloud')).toBeVisible();
  await page.getByLabel("We don't use cloud services").uncheck();
  await expect(page.getByLabel('Where are your cloud servers')).toBeVisible();
  await page.getByLabel('Where are your cloud servers').selectOption('Globally');
  await page.getByLabel('Where are your cloud servers').selectOption("I don't know");

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T13-apex-chart-1.png');
});
