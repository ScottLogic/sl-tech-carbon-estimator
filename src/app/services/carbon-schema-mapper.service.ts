import { Injectable } from '@angular/core';
import { jsonExport } from '../types/carbon-estimator';
import { CarbonSchemaExtended } from '../types/tech-carbon-standard.schema';

@Injectable({ providedIn: 'root' })
export class CarbonSchemaMapperService {
  private readonly SCHEMA_VERSION = '0.1.0';

  mapEstimationToSchema(jsonExport: jsonExport): CarbonSchemaExtended {
    const estimation = jsonExport.estimate;
    const input = jsonExport.input;

    if (!estimation) {
      throw new Error('Carbon estimation object is undefined');
    }

    const values = estimation.values;
    const percentages = estimation.percentages;

    return {
      schema_version: this.SCHEMA_VERSION,
      upstream_emissions: {
        software: {
          emissions: values.upstreamEmissions.software,
          percentage: percentages.upstreamEmissions.software,
        },
        employee_hardware: {
          emissions: values.upstreamEmissions.employee,
          percentage: percentages.upstreamEmissions.employee,
        },
        network_hardware: {
          emissions: values.upstreamEmissions.network,
          percentage: percentages.upstreamEmissions.network,
        },
        server_hardware: {
          emissions: values.upstreamEmissions.server,
          percentage: percentages.upstreamEmissions.server,
        },
        foundation_models: {
          emissions: values.upstreamEmissions.foundationModels,
          percentage: percentages.upstreamEmissions.foundationModels,
          notes: 'Calculation not currently implemented',
        },
        content_and_data: {
          emissions: values.upstreamEmissions.contentAndData,
          percentage: percentages.upstreamEmissions.contentAndData,
          notes: 'Calculation not currently implemented',
        },
      },
      direct_emissions: {
        onsite_employee_hardware: {
          emissions: values.directEmissions.employee,
          percentage: percentages.directEmissions.employee,
        },
        networking: {
          emissions: values.directEmissions.network,
          percentage: percentages.directEmissions.network,
        },
        servers: {
          emissions: values.directEmissions.server,
          percentage: percentages.directEmissions.server,
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
          emissions: values.indirectEmissions.cloud,
          percentage: percentages.indirectEmissions.cloud,
        },
        saas: {
          emissions: values.indirectEmissions.saas,
          percentage: percentages.indirectEmissions.saas,
        },
        managed_services: {
          emissions: values.indirectEmissions.managed,
          percentage: percentages.indirectEmissions.managed,
        },
      },
      downstream_emissions: {
        customer_devices: {
          emissions: values.downstreamEmissions.customer,
          percentage: percentages.downstreamEmissions.customer,
        },
        network_data_transfer: {
          emissions: values.downstreamEmissions.networkTransfer,
          percentage: percentages.downstreamEmissions.networkTransfer,
        },
        downstream_infrastructure: {
          emissions: values.downstreamEmissions.downstreamInfrastructure,
          percentage: percentages.downstreamEmissions.downstreamInfrastructure,
        },
      },
      total_emissions: {
        value: values.totalEmissions,
      },
      ...(input && {
        input: {
          upstream_emissions: {
            head_count: input.upstream.headCount,
            desktop_percentage: input.upstream.desktopPercentage,
            employee_location: input.upstream.employeeLocation,
          },
          on_premises: {
            estimate_server_count: input.onPremise.estimateServerCount,
            server_location: input.onPremise.serverLocation,
            number_of_servers: input.onPremise.numberOfServers,
          },
          cloud: {
            no_cloud_services: input.cloud.noCloudServices,
            cloud_location: input.cloud.cloudLocation,
            cloud_percentage: input.cloud.cloudPercentage,
            monthly_cloud_bill: {
              min: input.cloud.monthlyCloudBill.min,
              max: input.cloud.monthlyCloudBill.max,
            },
          },
          downstream_emissions: {
            no_downstream: input.downstream.noDownstream,
            customer_location: input.downstream.customerLocation,
            monthly_active_users: input.downstream.monthlyActiveUsers,
            mobile_percentage: input.downstream.mobilePercentage,
            purpose_of_site: input.downstream.purposeOfSite,
          },
          saas: {
            microsoft365: {
              use_microsoft365: input.saas.microsoft365.useMicrosoft365,
              organisation_user_count: input.saas.microsoft365.organisationUserCount,
            },
          },
        },
      }),
    };
  }
}
