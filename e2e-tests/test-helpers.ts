import AxeBuilder from '@axe-core/playwright';
import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { OrganisationSection } from './page-objects/organisation-section';
import { CloudServicesSection } from './page-objects/cloud-services-section';
import { EndUsersSection } from './page-objects/end-users-section';
import { OnPremSection } from './page-objects/on-prem-section';
import * as fs from 'fs';

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

export async function exportJsonContent(page: Page, exportType: 'Export JSON' | 'Export JSON with Inputs') {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export ▼' }).click(),
    page.getByRole('link', { name: exportType, exact: true }).click(),
  ]);

  const path = await download.path();
  if (!path) throw new Error('Download failed');

  return path;
}

export async function readJsonFileContent(path: string) {
  const fileContent = fs.readFileSync(path, 'utf-8');
  const json = JSON.parse(fileContent);

  return json;
}

interface EmissionValuesSchema {
  values: {
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
      endUser: number;
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

// export interface EmissionsData {
//   values: EmissionsValues;
//   percentages: EmissionsPercentages;
//   input?: InputData;
// }

export function createDefaultValuesJsonExport(overrides: Partial<EmissionValuesSchema> = {}): EmissionValuesSchema {
  const defaultValuesJson = {
    values: {
      version: '0.0.0-semantically-released',
      upstreamEmissions: {
        employee: 13708.333333333334,
        server: 3625,
        network: 1300,
        software: 0,
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
        endUser: 147.60952776716255,
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
        endUser: 0.2664035358503889,
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
