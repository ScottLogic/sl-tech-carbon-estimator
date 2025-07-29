import { test, expect } from '@playwright/test';

test('T7 happy path', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();

  // Organisation
  await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await expect(page.getByText('Laptops 50%')).toBeVisible();

  // On Prem Servers
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(page.getByText("We'll use the number of")).toBeVisible();
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await expect(page.locator('label', { hasText: "I don't know" })).toBeVisible();
  // Check "I don't know"
  await page.getByLabel("I don't know").check();
  await expect(page.getByText("We'll make an assumption")).toBeVisible();
  await expect(page.getByText('Number of Servers:')).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toBeDisabled();
  await page.getByLabel('Where are they primarily').selectOption('GBR');
  await page.getByLabel('Where are they primarily').selectOption('WORLD');

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('Tell us about your cloud')).toBeVisible();
  await expect(page.getByText("We don't use cloud services")).toBeVisible();
  // Check "We don't use cloud services"
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await page.getByLabel("We don't use cloud services").check();
  await expect(page.getByLabel("We don't use cloud services")).toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).not.toBeVisible();

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await expect(page.getByText('Tell us about your end-users -')).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('Globally');
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await expect(page.getByLabel('How many monthly active users')).toHaveValue('100');
  await expect(page.getByText('What percentage of your end-users')).toBeVisible();
  await expect(page.getByText('Mobile 50%')).toBeVisible();
  await expect(page.getByText('Computer 50%')).toBeVisible();
  await expect(page.getByText("What's the primary purpose of")).toBeVisible();
  await page.getByLabel("What's the primary purpose of").selectOption('socialMedia');
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T8-apex-chart.png');
  // await expect(page.locator('foreignobject')).toContainText('Upstream Emissions - 33%');
  // await expect(page.locator('foreignobject')).toContainText('Direct Emissions - 66%');
  // await expect(page.locator('foreignobject')).toContainText('Downstream Emissions - <1%');
});
