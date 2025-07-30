import { test, expect } from '@playwright/test';

test('T14 verify calculated values are coherent with selected employees, servers and users', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();

  // Organisation
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('25000');
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 6; i++) {
    await page.getByLabel('What percentage of those').press('ArrowRight');
  }
  await expect(page.getByText('Desktops 80%')).toBeVisible();

  // On Prem Servers
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('500');
  await expect(page.getByLabel('Where are they primarily')).toHaveValue('WORLD');

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('Tell us about your cloud')).toBeVisible();
  await expect(page.getByText("We don't use cloud services")).toBeVisible();
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).toBeVisible();
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(page.getByText('On-premise 50%')).toBeVisible();
  await expect(page.getByText('Cloud 50%On-premise 50%')).toBeVisible();
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').click();
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('ArrowLeft');
  await expect(page.getByText('Cloud 45%')).toBeVisible();

  await expect(page.getByText('Where are your cloud servers')).toBeVisible();
  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');
  await expect(page.getByText('We have derived a rough')).toBeVisible();
  await expect(page.getByText('What is your monthly cloud')).toBeVisible();
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
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
  await expect(page.locator('foreignobject')).toHaveScreenshot('T14-apex-chart.png');
});
