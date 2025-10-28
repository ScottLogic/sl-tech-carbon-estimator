// import { test, expect } from './fixtures';
import { test, expect } from '../utilities/fixtures';

test('Expansion panel visibility', async ({
  customersSection,
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

  await customersSection.assertCustomersSectionVisible();
  await customersSection.hideCustomersSection.click();
  await expect(customersSection.customersSummary).not.toBeVisible();
  await customersSection.showCustomersSection.click();
  await expect(customersSection.customersSummary).toBeVisible();
});
