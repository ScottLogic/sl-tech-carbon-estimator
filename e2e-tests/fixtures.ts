import { test as base } from '@playwright/test';
import { OrganisationSection } from './page-objects/organisation-section';
import { OnPremSection } from './page-objects/on-prem-section';

type Fixtures = {
  organisationSection: OrganisationSection,
  onPremSection: OnPremSection
}

export const test = base.extend<Fixtures>({
  organisationSection: async ({ page }, use) => {
    await use(new OrganisationSection(page));
  },

  onPremSection: async ({ page }, use) => {
    await use(new OnPremSection(page));
  },  
});

export { expect } from '@playwright/test';