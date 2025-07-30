import { test, expect } from '@playwright/test';

test('T5 verify calculated values are coherent when laptop is 0%', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('heading', { name: 'Carbon Estimator' }).click();

  // Organisation
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  await expect(page.getByText('To understand the scale of')).toBeVisible();
  await expect(page.getByText('How many employees are in the')).toBeVisible();
  await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await page.getByText('Desktops 50%').click();
  await expect(page.getByLabel('What percentage of those')).toHaveValue('50');
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 10; i++) {
    await page.getByLabel('What percentage of those').press('ArrowRight');
  }
  await expect(page.getByText('Laptops 0%')).toBeVisible();

  // On Prem
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(page.getByText("We'll use the number of")).toBeVisible();
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await expect(page.getByLabel("I don't know")).toBeVisible();
  await expect(page.getByLabel("I don't know")).not.toBeChecked();
  await expect(page.getByText('Number of Servers:')).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toHaveValue('10');

  await expect(page.getByText('Where are they primarily')).toBeVisible();
  await page.getByLabel('Where are they primarily located?').press('Enter');
  await page.getByLabel('Where are they primarily located?').selectOption('GBR');
  await page.getByLabel('Where are they primarily located?').selectOption('Globally');

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
  await expect(page.getByText('Tell us about your end-users -')).toBeVisible();
  await expect(page.getByText("We don't have any external")).toBeVisible();
  await expect(page.getByText("What's the primary purpose of")).toBeVisible();
  await expect(page.getByLabel("What's the primary purpose of")).toBeVisible();
  await page.getByLabel("What's the primary purpose of").selectOption('information');
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T5-apex-chart.png');
  // await expect(page.locator('foreignobject')).toContainText('Upstream Emissions - 34%');
  // await expect(page.locator('foreignobject')).toContainText('Direct Emissions - 64%');
  // await expect(page.locator('foreignobject')).toContainText('Indirect Emissions - 1%');
  // await expect(page.locator('foreignobject')).toContainText('Downstream Emissions - <1%');
});
