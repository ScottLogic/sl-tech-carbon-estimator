import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { pdfToPng } from 'pdf-to-png-converter';
import { CarbonSchemaExtended } from '../../src/app/types/tech-carbon-standard.schema';

export const expectNoA11yViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
};

export function createDefaultJsonExport(): CarbonSchemaExtended {
  const defaultJson: CarbonSchemaExtended = {
    schema_version: '0.1.0',
    upstream_emissions: {
      software: {
        emissions: 0,
        percentage: 0,
      },
      employee_hardware: {
        emissions: 13708.333333333334,
        percentage: 24.740467848078058,
      },
      network_hardware: {
        emissions: 1300,
        percentage: 2.3462085010943325,
      },
      server_hardware: {
        emissions: 3625,
        percentage: 6.542312166513042,
      },
      foundation_models: {
        emissions: 0,
        percentage: 0,
        notes: 'Calculation not currently implemented',
      },
      content_and_data: {
        emissions: 0,
        percentage: 0,
        notes: 'Calculation not currently implemented',
      },
    },
    direct_emissions: {
      onsite_employee_hardware: {
        emissions: 6484.5694,
        percentage: 11.70319373247398,
      },
      networking: {
        emissions: 3093.2690302799997,
        percentage: 5.582656996165198,
      },
      servers: {
        emissions: 26189.56176,
        percentage: 47.26628649326696,
      },
      generators: {
        emissions: 0,
        percentage: 0,
        notes: 'Calculation not currently implemented',
      },
    },
    indirect_emissions: {
      offsite_employee_hardware: {
        emissions: 0,
        percentage: 0,
        notes: 'Calculation not currently implemented',
      },
      cloud_services: {
        emissions: 620.874264,
        percentage: 1.1205388279288362,
      },
      saas: {
        emissions: 0,
        percentage: 0,
      },
      managed_services: {
        emissions: 0,
        percentage: 0,
      },
    },
    downstream_emissions: {
      customer_devices: {
        emissions: 147.60952776716255,
        percentage: 0.26640209914602825,
      },
      network_data_transfer: {
        emissions: 239.029161520401,
        percentage: 0.4313940390527809,
      },
      downstream_infrastructure: {
        emissions: 0,
        percentage: 0,
      },
    },
    total_emissions: {
      value: 55408.5452931249,
    },
  };
  return defaultJson;
}

export function createDefaultInputJsonExport(estimate: CarbonSchemaExtended): CarbonSchemaExtended {
  const defaultInputJson: CarbonSchemaExtended = {
    ...estimate,
    input: {
      upstream_emissions: {
        head_count: 100,
        desktop_percentage: 50,
        employee_location: 'WORLD',
      },
      on_premises: {
        estimate_server_count: false,
        server_location: 'WORLD',
        number_of_servers: 10,
      },
      cloud: {
        no_cloud_services: false,
        cloud_location: 'WORLD',
        cloud_percentage: 50,
        monthly_cloud_bill: {
          min: 0,
          max: 1000,
        },
      },
      downstream_emissions: {
        no_downstream: false,
        customer_location: 'WORLD',
        monthly_active_users: 100,
        mobile_percentage: 50,
        purpose_of_site: 'average',
      },
      saas: {
        microsoft365: {
          use_microsoft365: false,
          organisation_user_count: 100,
        },
      },
    },
  };
  return defaultInputJson;
}

export async function pdfComparison(actual_pdf_path: string, expected_pdf_path: string) {
  const convertedPdf = await pdfToPng(actual_pdf_path);
  const expectedPdf = await pdfToPng(expected_pdf_path);
  const pages = convertedPdf.length;
  for (let i = 0; i < pages; i++) {
    expect.soft(convertedPdf[i].content).toMatchSnapshot(expectedPdf[i]);
  }
}
