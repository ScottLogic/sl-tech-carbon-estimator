import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { OrganisationSection } from '../page-objects/organisation-section';
import { CloudServicesSection } from '../page-objects/cloud-services-section';
import { CustomersSection } from '../page-objects/customers-section';
import { OnPremSection } from '../page-objects/on-prem-section';

export async function assertAllSectionElementsAreVisible(
  organisationSection: OrganisationSection,
  onPremSection: OnPremSection,
  cloudServicesSection: CloudServicesSection,
  customersSection: CustomersSection
) {
  await organisationSection.assertOrganisationSectionVisible();
  await onPremSection.assertOnPremiseSectionVisible();
  await cloudServicesSection.assertDefaultCloudElementVisibility();
  await customersSection.assertCustomersSectionVisible();
}

export const expectNoA11yViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
};

interface EmissionValuesSchema {
  values: {
    version: string;
    upstreamEmissions: {
      employee: number;
      server: number;
      network: number;
      software: number;
      foundationModels: number;
      contentAndData: number;
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
      customer: number;
      networkTransfer: number;
      downstreamInfrastructure: number;
    };
    totalEmissions: number;
  };
}

interface EmissionPercentagesSchema {
  percentages: {
    version: string;
    upstreamEmissions?: {
      employee: number;
      server: number;
      network: number;
      software: number;
    };
    directEmissions?: {
      employee: number;
      server: number;
      network: number;
    };
    indirectEmissions?: {
      cloud: number;
      saas: number;
      managed: number;
    };
    downstreamEmissions?: {
      customer: number;
      networkTransfer: number;
      downstreamInfrastructure: number;
    };
    totalEmissions?: number;
  };
}

interface EmissionInputsSchema {
  input: {
    upstream: {
      headCount: number;
      desktopPercentage: number;
      employeeLocation: string;
    };
    onPremise: {
      estimateServerCount: boolean;
      serverLocation: string;
      numberOfServers: number;
    };
    cloud: {
      noCloudServices: boolean;
      cloudLocation: string;
      cloudPercentage: number;
      monthlyCloudBill: {
        min: number;
        max: number;
      };
    };
    downstream: {
      noDownstream: boolean;
      customerLocation: string;
      monthlyActiveUsers: number;
      mobilePercentage: number;
      purposeOfSite: string;
    };
  };
}

export function createDefaultValuesJsonExport(overrides: Partial<EmissionValuesSchema> = {}): EmissionValuesSchema {
  const defaultValuesJson = {
    values: {
      version: '0.0.0-semantically-released',
      upstreamEmissions: {
        employee: 13708.333333333334,
        server: 3625,
        network: 1300,
        software: 0,
        foundationModels: 0,
        contentAndData: 0,
      },
      directEmissions: {
        employee: 6484.5694,
        server: 26189.56176,
        network: 3093.2690302799997,
      },
      indirectEmissions: {
        cloud: 620.874264,
        saas: 0,
        managed: 0,
      },
      downstreamEmissions: {
        customer: 147.60952776716255,
        networkTransfer: 239.029161520401,
        downstreamInfrastructure: 0,
      },
      totalEmissions: 55408.2464769009,
    },
  };
  return { ...defaultValuesJson, ...overrides };
}

export function createDefaultPercentagesJsonExport(
  overrides: Partial<EmissionPercentagesSchema> = {}
): EmissionPercentagesSchema {
  const defaultPercentagesJson = {
    percentages: {
      version: '0.0.0-semantically-released',
      upstreamEmissions: {
        employee: 24.740601273220566,
        server: 6.542347449149511,
        network: 2.346221154177756,
        software: 0,
        foundationModels: 0,
        contentAndData: 0,
      },
      directEmissions: {
        employee: 11.70325684770289,
        server: 47.26654139996678,
        network: 5.582687103389114,
      },
      indirectEmissions: {
        cloud: 1.1205448709856498,
        saas: 0,
        managed: 0,
      },
      downstreamEmissions: {
        customer: 0.2664035358503889,
        networkTransfer: 0.4313963655573357,
        downstreamInfrastructure: 0,
      },
      totalEmissions: 55408.2464769009,
    },
  };
  return { ...defaultPercentagesJson, ...overrides };
}

export function createDefaultInputJsonExport(overrides: Partial<EmissionInputsSchema> = {}): EmissionInputsSchema {
  const defaultInputJson = {
    input: {
      upstream: {
        headCount: 100,
        desktopPercentage: 50,
        employeeLocation: 'WORLD',
      },
      onPremise: {
        estimateServerCount: false,
        serverLocation: 'WORLD',
        numberOfServers: 10,
      },
      cloud: {
        noCloudServices: false,
        cloudLocation: 'WORLD',
        cloudPercentage: 50,
        monthlyCloudBill: {
          min: 0,
          max: 1000,
        },
      },
      downstream: {
        noDownstream: false,
        customerLocation: 'WORLD',
        monthlyActiveUsers: 100,
        mobilePercentage: 50,
        purposeOfSite: 'average',
      },
    },
  };
  return { ...defaultInputJson, ...overrides };
}
