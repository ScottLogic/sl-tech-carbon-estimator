import { test as base } from '@playwright/test';
import { OrganisationSection } from './page-objects/organisation-section';
import { OnPremSection } from './page-objects/on-prem-section';
import { CloudServicesSection } from './page-objects/cloud-services-section';
import { EndUsersSection } from './page-objects/end-users-section'; // Assuming EndUsersSection is defined similarly to the others

type Fixtures = {
  organisationSection: OrganisationSection;
  onPremSection: OnPremSection;
  cloudServicesSection: CloudServicesSection;
  endUsersSection: EndUsersSection; // Assuming EndUsersSection is defined similarly to the others
};

export const test = base.extend<Fixtures>({
  organisationSection: async ({ page }, use) => {
    await use(new OrganisationSection(page));
  },

  onPremSection: async ({ page }, use) => {
    await use(new OnPremSection(page));
  },

  cloudServicesSection: async ({ page }, use) => {
    await use(new CloudServicesSection(page));
  },

  endUsersSection: async ({ page }, use) => {
    await use(new EndUsersSection(page)); // Assuming EndUsersSection is defined similarly to the others
  },
});

export { expect } from '@playwright/test';
