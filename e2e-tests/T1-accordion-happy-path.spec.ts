import { test, expect } from '@playwright/test';
import { organisationVisibility } from './test-helpers';

test('Expansion panel visibility', async ({ page }) => {
  await page.goto('/');

  // Organisation

  await organisationVisibility(page);

  page.pause();

  await page
    .locator('expansion-panel')
    .filter({ hasText: 'Organisation expand_less To' })
    .getByLabel('Hide details')
    .click();
  await expect(page.getByText('To understand the scale of')).not.toBeVisible();
  await page
    .locator('expansion-panel')
    .filter({ hasText: 'Organisation expand_more To' })
    .getByLabel('Show details')
    .click();
  await expect(page.getByText('To understand the scale of')).toBeVisible();

  // On Prem
  await expect(page.getByRole('heading', { name: 'On-Premise Servers' })).toBeVisible();
  await expect(
    page.locator('expansion-panel').filter({ hasText: 'On-Premise Servers' }).getByLabel('Hide details')
  ).toBeVisible();
  await page.locator('expansion-panel').filter({ hasText: 'On-Premise Servers' }).getByLabel('Hide details').click();
  await expect(page.getByText("We'll use the number of")).not.toBeVisible();
  await page.locator('expansion-panel').filter({ hasText: 'On-Premise Servers' }).getByLabel('Show details').click();
  await expect(page.getByText("We'll use the number of")).toBeVisible();

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(
    page.locator('expansion-panel').filter({ hasText: 'Cloud Services expand_less' }).getByLabel('Hide details')
  ).toBeVisible();
  await page
    .locator('expansion-panel')
    .filter({ hasText: 'Cloud Services expand_less' })
    .getByLabel('Hide details')
    .click();
  await expect(page.getByText('Cloud Services expand_less')).not.toBeVisible();
  await page
    .locator('expansion-panel')
    .filter({ hasText: 'Cloud Services expand_more' })
    .getByLabel('Show details')
    .click();
  await expect(page.getByText('Cloud Services expand_less')).toBeVisible();

  // Users
  await expect(page.getByRole('heading', { name: 'End-Users' })).toBeVisible();
  await expect(
    page.locator('expansion-panel').filter({ hasText: 'End-Users expand_less Tell us' }).getByLabel('Hide details')
  ).toBeVisible();
  await expect(page.getByText('Tell us about your end-users')).toBeVisible();
  await page
    .locator('expansion-panel')
    .filter({ hasText: 'End-Users expand_less Tell us' })
    .getByLabel('Hide details')
    .click();
  await expect(page.getByText('Tell us about your end-users')).not.toBeVisible();
  await page
    .locator('expansion-panel')
    .filter({ hasText: 'End-Users expand_more Tell us' })
    .getByLabel('Show details')
    .click();
  await expect(page.getByText('Tell us about your end-users')).toBeVisible();
});
