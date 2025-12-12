import { test, expect } from '../utilities/fixtures';

test('Expansion panel visibility', async ({
  customersSection,
  organisationSection,
  onPremSection,
  cloudServicesSection,
  saasSection,
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

  await saasSection.assertSaasSectionVisible();
  await saasSection.sectionHideExpansion.click();
  await expect(saasSection.saasSummary).not.toBeVisible();
  await saasSection.sectionShowExpansion.click();
  await expect(saasSection.saasSummary).toBeVisible();

  await customersSection.assertCustomersSectionVisible();
  await customersSection.hideCustomersSection.click();
  await expect(customersSection.customersSummary).not.toBeVisible();
  await customersSection.showCustomersSection.click();
  await expect(customersSection.customersSummary).toBeVisible();
});
