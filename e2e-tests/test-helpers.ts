import AxeBuilder from '@axe-core/playwright';
import { Page, expect } from '@playwright/test';

export const expectNoA11yViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
};

export async function gotoHome(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();
}

export async function expansionPanelClick(page: Page, panelName: string, action: 'Show details' | 'Hide details') {
  await page.locator('expansion-panel').filter({ hasText: panelName }).getByLabel(action).click();
}

export async function assertAllSectionElementsAreVisible(page: Page) {
  await assertOrganisationElementVisiblity(page);
  await assertOnPremiseElementVisiblity(page);
  await assertCloudElementVisibility(page);
  await assertEndUserElementVisibility(page);
}

export async function assertOrganisationElementVisiblity(page: Page) {
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
  await expect(page.getByText('To understand the scale of')).toBeVisible();
  await expect(page.getByLabel('How many employees are in the')).toHaveValue('100');
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await expect(page.getByText('Laptops 50%')).toBeVisible();
  await expect(page.getByText('What percentage of those')).toBeVisible();
  await expect(page.getByRole('slider', { name: 'What percentage of those' })).toBeVisible();
}

export async function assertOnPremiseElementVisiblity(page: Page) {
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(page.getByLabel('Number of Servers:')).toHaveValue('10');
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await expect(page.getByRole('checkbox', { name: "I don't know" })).toBeVisible();
  await expect(page.getByLabel("I don't know")).not.toBeChecked();
  await expect(page.locator('label').filter({ hasText: "I don't know" })).toBeVisible();
  await expect(page.getByLabel('Where are they primarily')).toBeVisible();
  await expect(page.getByText('Where are they primarily located? expand_more')).toBeVisible();
}

export async function assertCloudElementVisibility(page: Page) {
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('Cloud 50%')).toBeVisible();
  await expect(page.getByText('On-premise 50%')).toBeVisible();
  await expect(page.getByLabel('Where are your cloud servers')).toHaveValue('WORLD');
  await expect(page.getByLabel('What is your monthly cloud')).toHaveValue('0: Object');
  await expect(page.getByText("We don't use cloud services")).toBeVisible();
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await expect(
    page.getByRole('slider', { name: 'What percentage of your servers are cloud services vs on-premise?' })
  ).toBeVisible();
  await expect(page.getByRole('checkbox', { name: "We don't use cloud services" })).toBeVisible;
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).toBeVisible();
  await expect(page.getByText('We have derived a rough')).toBeVisible;
  await expect(
    page.getByRole('slider', { name: 'What percentage of your servers are cloud services vs on-premise?' })
  ).toBeVisible();
}

export async function assertEndUserElementVisibility(page: Page) {
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await expect(page.getByLabel('Where are your end-users')).toHaveValue('WORLD');
  await expect(page.getByText('How many monthly active users')).toBeVisible();
  await expect(page.getByLabel('How many monthly active users')).toHaveValue('100');
  await expect(page.getByText('Mobile 50%')).toBeVisible();
  await expect(page.getByText('Computer 50%')).toBeVisible();
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await expect(page.getByLabel("What's the primary purpose of your")).toHaveValue('average');
  await expect(page.getByText('Tell us about your end-users - ')).toBeVisible();
  await expect(page.getByText("We don't have any external")).toBeVisible();
  await expect(page.getByRole('checkbox', { name: "We don't have any external" })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'What percentage of your end-' })).toBeVisible();
}
