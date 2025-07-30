import { test, expect } from '@playwright/test';

//This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads
//Enter number into “Number of Servers”
//Ensure calcs are match spreadsheet
//User checks On Premise "Don't know" checkbox
//Ensure calcs are match spreadsheet

test('T7 verify calculated values are coherent when on-prem is known then recalulated when unknown ', async ({
  page,
}) => {
  await page.goto('/');

  expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
  // Organisation
  await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await expect(page.getByText('Laptops 50%')).toBeVisible();

  // On Prem
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(page.getByText("We'll use the number of")).toBeVisible();
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await expect(page.locator('label', { hasText: "I don't know" })).toBeVisible();
  await expect(page.getByLabel("I don't know")).not.toBeChecked();
  await expect(page.getByText('Number of Servers:')).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toHaveValue('10');
  await page.getByLabel('Number of Servers:').click();
  // Enter number into “Number of Servers”
  await page.getByLabel('Number of Servers:').fill('555');
  // Then keep all remaining input at default
  await page.getByLabel('Where are they primarily').selectOption('GBR');
  await page.getByLabel('Where are they primarily').selectOption('WORLD');

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('Tell us about your cloud')).toBeVisible();
  await expect(page.getByText("We don't use cloud services")).toBeVisible();
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).toBeVisible();
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(page.getByText('On-premise 50%')).toBeVisible();
  await expect(page.getByLabel('Where are your cloud servers')).toBeVisible();
  await page.getByLabel('Where are your cloud servers').selectOption('GBR');
  await page.getByLabel('Where are your cloud servers').selectOption('WORLD');
  await expect(page.getByText('We have derived a rough')).toBeVisible();
  await expect(page.getByText('What is your monthly cloud')).toBeVisible();
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');

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
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T7-apex-chart.png');
  // await expect(page.locator('foreignobject')).toContainText('Upstream Emissions - 13%');
  // await expect(page.locator('foreignobject')).toContainText('Direct Emissions - 87%');
  // await expect(page.locator('foreignobject')).toContainText('Indirect Emissions - <1%');
  // await expect(page.locator('foreignobject')).toContainText('Downstream Emissions - <1%');

  //////////////////////////////////////////////////////////////////////////////

  // On Prem
  // Then for "Number of Servers:" click “I don’t know”
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
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).toBeVisible();
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(page.getByText('On-premise 50%')).toBeVisible();
  await expect(page.getByText('Where are your cloud servers')).toBeVisible();
  await expect(page.getByLabel('Where are your cloud servers')).toHaveValue('WORLD');
  await expect(page.getByText('We have derived a rough')).toBeVisible();
  await expect(page.getByText('What is your monthly cloud')).toBeVisible();
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');

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
  await page.getByLabel("What's the primary purpose of").selectOption('information');
  await page.getByLabel("What's the primary purpose of").selectOption('average');

  // Calculate
  // Calculate outcome and make sure it matches spreadsheet
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T7-apex-chart-1.png');
  // foreign object is currently receiving "" and not actual values. we can subsitute this
  // await expect(page.locator('foreignobject')).toContainText('Upstream Emissions - 41%');
  // await expect(page.locator('foreignobject')).toContainText('Direct Emissions - 57%');
  // await expect(page.locator('foreignobject')).toContainText('Indirect Emissions - 2%');
  // await expect(page.locator('foreignobject')).toContainText('Downstream Emissions - <1%');
});
