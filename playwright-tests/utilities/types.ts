export interface EmissionValuesSchema {
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

export interface EmissionPercentagesSchema {
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

export interface EmissionInputsSchema {
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
    saas: {
      microsoft365: {
        useMicrosoft365: boolean;
        organisationUserCount: number;
      };
    };
  };
}

export interface InputValues {
  employees: string;
  hardware_percentage: string;
  employees_location: string;
  unknown_servers: boolean;
  number_of_servers: string;
  server_location: string;
  no_cloud: boolean;
  cloud_percentage?: string;
  cloud_location: string;
  monthly_cloud_cost: string;
  uses_m365: boolean;
  m365_users: string;
  no_downstream: boolean;
  downstream_type: string;
  downstream_location: string;
  downstream_users: string;
  downstream_mobile_percentage: string;
}
