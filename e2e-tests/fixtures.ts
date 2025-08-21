import { test as base } from '@playwright/test';
import { OrganisationSection } from './page-objects/organisation-section';
import { OnPremSection } from './page-objects/on-prem-section';
import { CloudServicesSection } from './page-objects/cloud-services-section';

type Fixtures = {
  organisationSection: OrganisationSection;
  onPremSection: OnPremSection;
  cloudServicesSection: CloudServicesSection;
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
});

export { expect } from '@playwright/test';
