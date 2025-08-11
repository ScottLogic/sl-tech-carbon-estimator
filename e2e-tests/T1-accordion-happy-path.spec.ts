import { test, expect } from '@playwright/test';
import {
  assertOrganisationElementVisiblity,
  expansionPanelClick,
  assertOnPremiseElementVisiblity,
  assertCloudElementVisibility,
  assertEndUserElementVisibility,
} from './test-helpers';

test('Expansion panel visibility', async ({ page }) => {
  await page.goto('/');

  // Organisation
  await assertOrganisationElementVisiblity(page);
  await expansionPanelClick(page, 'Organisation expand_less To', 'Hide details');
  await expect(page.getByText('To understand the scale of')).not.toBeVisible();
  await expansionPanelClick(page, 'Organisation expand_more To', 'Show details');
  await expect(page.getByText('To understand the scale of')).toBeVisible();

  // On Prem
  await assertOnPremiseElementVisiblity(page);
  await expansionPanelClick(page, 'On-Premise Servers', 'Hide details');
  await expect(page.getByText("We'll use the number of")).not.toBeVisible();
  await expansionPanelClick(page, 'On-Premise Servers', 'Show details');
  await expect(page.getByText("We'll use the number of")).toBeVisible();

  // Cloud
  await assertCloudElementVisibility(page);
  await expansionPanelClick(page, 'Cloud Services expand_less', 'Hide details');
  await expect(page.getByText('Tell us about your cloud')).not.toBeVisible();
  await expansionPanelClick(page, 'Cloud Services expand_more', 'Show details');
  await expect(page.getByText('Tell us about your cloud')).toBeVisible();

  // Users
  await assertEndUserElementVisibility(page);
  await expansionPanelClick(page, 'End-Users expand_less Tell us', 'Hide details');
  await expect(page.getByText('Tell us about your end-users')).not.toBeVisible();
  await expansionPanelClick(page, 'End-Users expand_more Tell us', 'Show details');
  await expect(page.getByText('Tell us about your end-users')).toBeVisible();
});
