import { Page, expect } from '@playwright/test';

export async function gotoHome(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
}

export async function expansionPanelClick(page: Page, panelName: string, action: 'Show details' | 'Hide details') {
  await expect(page.locator('expansion-panel').filter({ hasText: panelName }).getByLabel(action)).toBeVisible();
  await page.locator('expansion-panel').filter({ hasText: panelName }).getByLabel(action).click();
  // await page.locator('expansion-panel').filter({ hasText: 'Where are your employees' }).getByLabel('Show details').click();
  // await page.locator('expansion-panel').filter({ hasText: 'Where are they primarily' }).getByLabel('Show details').click();
  // await page.locator('expansion-panel').filter({ hasText: 'Cloud Services expand_less' }).getByLabel('Show details').click();
  // await page.locator('expansion-panel').filter({ hasText: 'Where are your cloud servers' }).getByLabel('Show details').click();
  // await page.locator('expansion-panel').filter({ hasText: 'End-Users expand_less Tell us' }).getByLabel('Show details').click();
  // await page.locator('expansion-panel').filter({ hasText: 'What\'s the primary purpose of' }).getByLabel('Show details').click();
  // await page.locator('expansion-panel').filter({ hasText: 'Where are your end-users' }).getByLabel('Show details').click();
  // await page.locator('expansion-panel').filter({ hasText: 'What percentage of your end-' }).getByLabel('Show details').click();
}

export async function organisationVisibility(page: Page) {
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  await expect(page.getByText('To understand the scale of')).toBeVisible();
  await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await expect(page.getByText('Laptops 50%')).toBeVisible();
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await expect(
    page.locator('expansion-panel').filter({ hasText: 'Organisation expand_less To' }).getByLabel('Hide details')
  ).toBeVisible();
}

export async function onPremiseVisibility(page: Page) {
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toHaveValue('10');
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await expect(page.getByRole('checkbox', { name: "I don't know" })).toBeVisible();
  await expect(page.locator('label').filter({ hasText: "I don't know" })).toBeVisible();
  await expect(page.getByLabel('Where are they primarily')).toBeVisible();
  await expect(page.getByText('Where are they primarily located? expand_more')).toBeVisible();
  // await expect(page.getByLabel('Where are they primarily')).toHaveValue('WORLD');
}

export async function cloudVisibility(page: Page) {
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(page.getByText('On-premise 50%')).toBeVisible();
  await expect(page.getByLabel('Where are your cloud servers')).toHaveValue('WORLD');
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');
  await expect(page.getByRole('checkbox', { name: "We don't use cloud services" })).toBeVisible;
  // await expect(page.getByText('What percentage of your')).toBeVisible();
  // await expect(page.getByRole('slider', { name: 'What percentage of your' })).toHaveValue('50');
}

export async function endUserVisibility(page: Page) {
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await expect(page.getByLabel('Where are your end-users')).toHaveValue('WORLD');
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await expect(page.getByLabel('How many monthly active users')).toHaveValue('100');
  await expect(page.getByText('Mobile 50%')).toBeVisible();
  await expect(page.getByText('Computer 50%')).toBeVisible();
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await expect(page.getByLabel("What's the primary purpose of your")).toHaveValue('average');
}
