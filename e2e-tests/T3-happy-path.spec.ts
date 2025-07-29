import { test, expect } from '@playwright/test';

test('Default page screenshot assertion,elements are visible and apex chart displays expected values', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
  // Organisation
  // await page.pause();
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  await expect(page.getByText('To understand the scale of')).toBeVisible();
  await expect(page.getByText('How many employees are in the')).toBeVisible();
  await expect(page.getByLabel('How many employees are in the')).toBeVisible();
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('100');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await expect(page.getByText('Laptops 50%')).toBeVisible();

  // On Prem
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(page.getByText("We'll use the number of")).toBeVisible();
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await expect(page.locator('label').filter({ hasText: "I don't know" })).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toBeVisible();
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('10');

  // await page.getByLabel("Where are they primarily located? helper popup").press("Tab");
  await page.getByLabel('Where are they primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('in the UK');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('Globally');

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
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('Tab');
  // await page.getByLabel("Where are your cloud servers primarily located? helper popup").press("Tab");
  await expect(page.getByLabel('Where are your cloud servers')).toBeVisible();
  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');
  await expect(page.getByText('We have derived a rough')).toBeVisible();
  await expect(page.getByText('What is your monthly cloud')).toBeVisible();
  await page.getByLabel('What is your monthly cloud').selectOption('5: Object'); //$20-$50k

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await expect(page.getByText('Tell us about your end-users - ')).toBeVisible();
  // await page.pause();
  // await page.getByLabel("Where are your cloud servers primarily located? helper popup").press("Tab");
  await expect(page.getByText("We don't have any external")).toBeVisible();

  await expect(page.getByText("What's the primary purpose of")).toBeVisible();
  await page.getByText("What's the primary purpose of").click();
  await page.getByLabel("What's the primary purpose of").selectOption('socialMedia');
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await page.getByLabel('Where are your end-users').selectOption('GBR');
  await page.getByLabel('Where are your end-users').selectOption('WORLD');
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('100');
  await expect(page.getByText('What percentage of your end-')).toBeVisible();
  await expect(page.getByText('Mobile 50%')).toBeVisible();

  // await page.getByRole("button", { name: "Calculate" }).click();
  // await page.getByRole("button", { name: "Calculate" }).press("Enter");
  // await expect(page.getByText("Upstream Emissions:")).toBeVisible();
  // await expect(page.getByText("32%")).toBeVisible();
  // await expect(page.getByText("Indirect Emissions:")).toBeVisible();
  // await expect(page.getByText("0%", { exact: true })).toBeVisible();
  // await expect(page.getByText("Direct Emissions:", { exact: true })).toBeVisible();
  // await expect(page.getByText("67%")).toBeVisible();
  // await expect(page.getByText("Downstream Emissions:")).toBeVisible();
  // await expect(page.getByText("1%", { exact: true })).toBeVisible();
  // await page.getByRole("button", { name: "Reset" }).click();
  // await expect(page.getByRole("heading", { name: "Carbon Estimator" })).toBeVisible();

  // await page.getByRole("button", { name: "Reset" }).press("Enter");
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  await expect(page.locator('label').filter({ hasText: "I don't know" })).toBeVisible();
  await expect(page.getByLabel("I don't know")).toBeVisible();
  await expect(page.getByLabel("I don't know")).not.toBeChecked();
  await expect(page.getByText('Number of Servers:')).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toHaveValue('10');
  // await page.getByLabel("Where are they primarily located? helper popup").press("Tab");
  await page.getByLabel('Where are they primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('GBR');
  await page.getByLabel('Where are they primarily located?', { exact: true }).selectOption('Globally');

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText("We don't use cloud services")).toBeVisible();
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).toBeVisible();
  await page.getByLabel('What percentage of your servers are cloud services vs on-premise?').press('Tab');
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(page.getByText('On-premise 50%')).toBeVisible();
  // await page.getByLabel("Where are your cloud servers primarily located? helper popup").press("Tab");
  await page.getByLabel('Where are your cloud servers primarily located?', { exact: true }).press('Enter');
  await page.getByLabel('Where are your cloud servers primarily located?', { exact: true }).press('Tab');
  await expect(page.getByText('We have derived a rough')).toBeVisible();
  await expect(page.getByText('What is your monthly cloud')).toBeVisible();
  // await expect(page.getByLabel("What is your monthly cloud")).toHaveValue("0: Object");
  await page.getByLabel('What is your monthly cloud').selectOption('1: Object');
  await page.getByLabel('What is your monthly cloud').selectOption('0: Object');

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
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T3-apex-chart.png');

  // await expect(page.locator('foreignobject')).toContainText('Upstream Emissions - 33%');
  // await expect(page.locator('foreignobject')).toContainText('Direct Emissions - 65%');
  // await expect(page.locator('foreignobject')).toContainText('Indirect Emissions - 1%');
  // await expect(page.locator('foreignobject')).toContainText('Downstream Emissions - <1%');

  //////////////////////////////////////////////////////////////////////////////
});
