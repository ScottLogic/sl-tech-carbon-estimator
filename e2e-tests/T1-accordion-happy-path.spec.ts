import { test, expect } from './fixtures';

test('Expansion panel visibility', async ({
  endUsersSection,
  organisationSection,
  onPremSection,
  cloudServicesSection,
  tcsEstimator,
}) => {
  await tcsEstimator.gotoHome();
  await organisationSection.assertOrganisationSectionVisible();
  await organisationSection.hideOrganisationSection.click();
  await expect(organisationSection.organisationSectionInfo).not.toBeVisible();
  await organisationSection.showOrganisationSection.click();
  await expect(organisationSection.organisationSectionInfo).toBeVisible();

  await onPremSection.assertOnPremiseSectionVisible();
  await onPremSection.hideOnPremSection.click();
  await expect(onPremSection.onPremSectionSummary).not.toBeVisible();
  await onPremSection.showOnPremSection.click();
  await expect(onPremSection.onPremSectionSummary).toBeVisible();

  await cloudServicesSection.assertDefaultCloudElementVisibility();
  await cloudServicesSection.hideCloudSection.click();
  await expect(cloudServicesSection.cloudServicesSummary).not.toBeVisible();
  await cloudServicesSection.showCloudSection.click();
  await expect(cloudServicesSection.cloudServicesSummary).toBeVisible();

  await endUsersSection.assertEndUserSectionVisible();
  await endUsersSection.hideEndUsersSection.click();
  await expect(endUsersSection.endUsersSummary).not.toBeVisible();
  await endUsersSection.showEndUsersSection.click();
  await expect(endUsersSection.endUsersSummary).toBeVisible();
});
