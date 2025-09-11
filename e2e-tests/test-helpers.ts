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

export interface EmissionsValues {
  version: string;
  upstreamEmissions: {
    employee: number;
    server: number;
    network: number;
    software: number;
  };
  directEmissions: {
    employee: number;
    server: number;
    network: number;
  };
  indirectEmissions: {
    cloud: number;
    saas: number;
    managed: number;
  };
  downstreamEmissions: {
    endUser: number;
    networkTransfer: number;
    downstreamInfrastructure: number;
  };
  totalEmissions: number;
}

export interface EmissionsPercentages {
  version: string;
  upstreamEmissions: {
    employee: number;
    server: number;
    network: number;
    software: number;
  };
  directEmissions: {
    employee: number;
    server: number;
    network: number;
  };
  indirectEmissions: {
    cloud: number;
    saas: number;
    managed: number;
  };
  downstreamEmissions: {
    endUser: number;
    networkTransfer: number;
    downstreamInfrastructure: number;
  };
  totalEmissions: number;
}

export interface EmissionsData {
  values: EmissionsValues;
  percentages: EmissionsPercentages;
}
