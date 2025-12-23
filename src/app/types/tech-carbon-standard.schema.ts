export interface Emission {
  emissions: number;
  percentage: number;
  notes?: string;
  method?: string;
}

export interface CarbonSchemaExtended {
  schema_version: string;
  upstream_emissions: {
    software: Emission;
    employee_hardware: Emission;
    network_hardware: Emission;
    server_hardware: Emission;
    foundation_models: Emission;
    content_and_data: Emission;
  };
  direct_emissions: {
    onsite_employee_hardware: Emission;
    networking: Emission;
    servers: Emission;
    generators: Emission;
  };
  indirect_emissions: {
    offsite_employee_hardware: Emission;
    cloud_services: Emission;
    saas: Emission;
    managed_services: Emission;
  };
  downstream_emissions: {
    customer_devices: Emission;
    network_data_transfer: Emission;
    downstream_infrastructure: Emission;
  };
  total_emissions: {
    value: number;
  };
  input?: {
    upstream_emissions: {
      head_count: number;
      desktop_percentage: number;
      employee_location: string;
    };
    on_premises: {
      estimate_server_count: boolean;
      server_location: string;
      number_of_servers: number;
    };
    cloud: {
      no_cloud_services: boolean;
      cloud_location: string;
      cloud_percentage: number;
      monthly_cloud_bill: {
        min: number;
        max: number;
      };
    };
    downstream_emissions: {
      no_downstream: boolean;
      customer_location: string;
      monthly_active_users: number;
      mobile_percentage: number;
      purpose_of_site: string;
    };
    saas: {
      microsoft365: {
        use_microsoft365: boolean;
        organisation_user_count: number;
      };
    };
  };
}
