import { test as base } from '@playwright/test';
import { OrganisationSection } from '../page-objects/organisation-section';
import { OnPremSection } from '../page-objects/on-prem-section';
import { CloudServicesSection } from '../page-objects/cloud-services-section';
import { SaasSection } from '../page-objects/saas-section';
import { CustomersSection } from '../page-objects/customers-section';
import { TcsEstimator } from '../page-objects/tcs-estimator';
import { EstimationsSection } from '../page-objects/estimations-section';
import { TableSection } from '../page-objects/table-section';
import { DiagramSection } from '../page-objects/diagram-section';
import { AllSections } from '../page-objects/all-sections';

type Fixtures = {
  diagramSection: DiagramSection;
  tcsEstimator: TcsEstimator;
  tableSection: TableSection;
  estimationsSection: EstimationsSection;
  organisationSection: OrganisationSection;
  onPremSection: OnPremSection;
  cloudServicesSection: CloudServicesSection;
  saasSection: SaasSection;
  customersSection: CustomersSection;
  allSections: AllSections;
};

export const test = base.extend<Fixtures>({
  tcsEstimator: async ({ page }, use) => {
    await use(new TcsEstimator(page));
  },

  organisationSection: async ({ page }, use) => {
    await use(new OrganisationSection(page));
  },

  onPremSection: async ({ page }, use) => {
    await use(new OnPremSection(page));
  },

  cloudServicesSection: async ({ page }, use) => {
    await use(new CloudServicesSection(page));
  },

  saasSection: async ({ page }, use) => {
    await use(new SaasSection(page));
  },

  customersSection: async ({ page }, use) => {
    await use(new CustomersSection(page));
  },

  estimationsSection: async ({ page }, use) => {
    await use(new EstimationsSection(page));
  },

  tableSection: async ({ page }, use) => {
    await use(new TableSection(page));
  },

  diagramSection: async ({ page }, use) => {
    await use(new DiagramSection(page));
  },

  allSections: async ({ page }, use) => {
    await use(
      new AllSections(
        new OrganisationSection(page),
        new OnPremSection(page),
        new CloudServicesSection(page),
        new SaasSection(page),
        new CustomersSection(page)
      )
    );
  },
});

export { expect } from '@playwright/test';
