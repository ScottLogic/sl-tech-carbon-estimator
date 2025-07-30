import { test, expect } from '@playwright/test';

//This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
//User checks On Premise "Don't know" checkbox | Only selection made

test('T6 verify calculated values are coherent when on-prem is unknown', async ({ page }) => {
  // page.goto("http://localhost:57056/")
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
  // await page.pause();

  // Organisation
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  await expect(page.getByText('To understand the scale of')).toBeVisible();
  await expect(page.getByText('How many employees are in the')).toBeVisible();
  await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await expect(page.getByText('Laptops 50%')).toBeVisible();

  // On Prem
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(page.getByText("We'll use the number of")).toBeVisible();
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await page.getByLabel("I don't know").check();
  await expect(page.getByText('info', { exact: true })).toBeVisible();
  await expect(page.getByText("We'll make an assumption")).toBeVisible();
  await expect(page.getByText('Number of Servers:')).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toBeDisabled();
  await expect(page.getByText('Where are they primarily')).toBeVisible();
  await page.getByLabel('Where are they primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('in the UK');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('Globally');

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('Tell us about your cloud')).toBeVisible();
  await expect(page.getByText("We don't use cloud services")).toBeVisible();
  await page.pause();
  await expect(page.getByLabel("We don't use cloud services")).toBeVisible();
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await page.getByLabel("We don't use cloud services").check();
  await page.getByLabel("We don't use cloud services").uncheck();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).toBeVisible();
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(page.getByText('On-premise 50%')).toBeVisible();
  // await page.getByLabel("Where are your cloud servers primarily located? helper popup").press("Tab");
  await expect(page.getByLabel('Where are your cloud servers')).toBeVisible();
  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');
  await expect(page.getByText('We have derived a rough')).toBeVisible();
  await expect(page.getByText('What is your monthly cloud')).toBeVisible();
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await expect(page.getByText('Tell us about your end-users -')).toBeVisible();
  // await page.getByLabel("Where are your cloud servers primarily located? helper popup").press("Tab");
  await page.getByLabel('Where are your end-users primarily located?', { exact: true }).selectOption('Globally');
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await expect(page.getByLabel('How many monthly active users')).toHaveValue('100');
  await expect(page.getByText('What percentage of your end-users')).toBeVisible();
  await expect(page.getByText('Mobile 50%')).toBeVisible();
  await expect(page.getByText('Computer 50%')).toBeVisible();
  // await page.getByLabel("What's the purpose of your website helper popup").click();
  // await page.getByLabel("What's the purpose of your website helper popup").press("Tab");
  await expect(page.getByText("What's the primary purpose of")).toBeVisible();
  await page.getByLabel("What's the primary purpose of").selectOption('socialMedia');
  await page.getByLabel("What's the primary purpose of").selectOption('average');
  // await page.getByLabel("What's the purpose of your website?").press("Tab");

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  // await page.pause();
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T6-apex-chart.png');
  // foreign object is currently receiving "" and not actual values. we can subsitute this
  // await expect(page.locator("foreignobject")).toContainText("Upstream Emissions - 41%");
  // await expect(page.locator("foreignobject")).toContainText("Direct Emissions - 57%");
  // await expect(page.locator("foreignobject")).toContainText("Indirect Emissions - 2%");
  // await expect(page.locator("foreignobject")).toContainText("Downstream Emissions - <1%");
});
