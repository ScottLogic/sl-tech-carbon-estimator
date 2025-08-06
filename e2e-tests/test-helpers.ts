import { Page, expect } from '@playwright/test';

export async function gotoHome(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
}

export async function organisationVisibility(page: Page) {
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  await expect(page.getByText('To understand the scale of')).toBeVisible();
  await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await expect(page.getByText('Laptops 50%')).toBeVisible();
  await expect(page.getByText('What percentage of those')).toBeVisible();
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
  // await expect(page.getByLabel('What percentage of your')).toBeVisible();
  // await expect(page.getByRole('slider', { name: 'What percentage of your' })).toHaveValue('50');
}
