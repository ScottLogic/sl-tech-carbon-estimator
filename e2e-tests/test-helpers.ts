import AxeBuilder from '@axe-core/playwright';
import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { OrganisationSection } from './page-objects/organisation-section';
import { CloudServicesSection } from './page-objects/cloud-services-section';
import { EndUsersSection } from './page-objects/end-users-section';
import { OnPremSection } from './page-objects/on-prem-section';

export async function assertAllSectionElementsAreVisible(
  organisationSection: OrganisationSection,
  onPremSection: OnPremSection,
  cloudServicesSection: CloudServicesSection,
  endUsersSection: EndUsersSection
) {
  await organisationSection.assertOrganisationSectionVisible();
  await onPremSection.assertOnPremiseSectionVisible();
  await cloudServicesSection.assertDefaultCloudElementVisibility();
  await endUsersSection.assertEndUserSectionVisible();
}

export const expectNoA11yViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
};
