import { on } from 'events';
import { test, expect } from './fixtures';

test('Expansion panel visibility', async ({
  page,
  endUsersSection,
  organisationSection,
  onPremSection,
  cloudServicesSection,
}) => {
  await page.goto('/');

  // Organisation
  await organisationSection.assertOrganisationSectionVisible();
  await organisationSection.hideOrganisationSection.click();
  await expect(organisationSection.organisationSectionInfo).not.toBeVisible();
  await organisationSection.showOrganisationSection.click();
  await expect(organisationSection.organisationSectionInfo).toBeVisible();

  // On Prem
  await onPremSection.assertOnPremiseSectionVisible();
  await onPremSection.hideOnPremSection.click();
  await expect(onPremSection.onPremSectionSummary).not.toBeVisible();
  await onPremSection.showOnPremSection.click();
  await expect(onPremSection.onPremSectionSummary).toBeVisible();

  // Cloud
  await cloudServicesSection.assertDefaultCloudElementVisibility();
  await cloudServicesSection.hideCloudSection.click();
  await expect(cloudServicesSection.cloudServicesSummary).not.toBeVisible();
  await cloudServicesSection.showCloudSection.click();
  await expect(cloudServicesSection.cloudServicesSummary).toBeVisible();

  // Users
  await endUsersSection.assertEndUserSectionVisible();
  await endUsersSection.hideEndUsersSection.click();
  await expect(endUsersSection.endUsersSummary).not.toBeVisible();
  await endUsersSection.showEndUsersSection.click();
  await expect(endUsersSection.endUsersSummary).toBeVisible();
});
