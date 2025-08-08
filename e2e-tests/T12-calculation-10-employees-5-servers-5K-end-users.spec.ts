import { test, expect } from '@playwright/test';

test('T12 verify calculated values are coherent with selected employees, servers and users', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();

  // Organisation
  await expect(page.getByText('How many employees are in the')).toBeVisible();
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('10');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await expect(page.getByLabel('What percentage of those')).toBeVisible();
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of those').press('ArrowLeft');
  }
  await expect(page.getByText('Desktops 0%')).toBeVisible();

  // On Prem Servers
  await expect(page.getByText('Number of Servers:')).toBeVisible();
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('5');
  await expect(page.getByLabel('Where are they primarily')).toBeVisible();
  await page.getByLabel('Where are they primarily').selectOption({ label: 'in the UK' });

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await page.getByLabel("We don't use cloud services").check();
  await expect(page.getByLabel("We don't use cloud services")).toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).not.toBeVisible();

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await expect(page.getByText('Tell us about your end-users -')).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await page.getByLabel('Where are your end-users').selectOption({ label: 'in the UK' });
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('5000');
  await expect(page.getByText('What percentage of your end-users')).toBeVisible();
  await page.getByLabel('What percentage of your end-users').click();
  await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  for (let i = 0; i < 5; i++) {
    await page.getByLabel('What percentage of your end-users').press('ArrowRight');
  }
  await expect(page.getByText('Mobile 70%')).toBeVisible();
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await page.getByLabel("What's the primary purpose of").selectOption('eCommerce');

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T12-apex-chart.png');
});
