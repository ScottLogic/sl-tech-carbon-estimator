export type tcsoutput = {
  schema_version: '0.0.2' & string;
  upstream_emissions?: {
    software?: emissions_def;
    employee_hardware?: emissions_def;
    network_hardware?: emissions_def;
    server_hardware?: emissions_def;
  };
  direct_emissions?: {
    onsite_employee_hardware?: scope_2_emissions_def;
    networking?: scope_2_emissions_def;
    servers?: scope_2_emissions_def;
    generators?: emissions_def;
  };
  indirect_emissions?: {
    offsite_employee_hardware?: emissions_def;
    cloud_services?: emissions_def;
    saas?: emissions_def;
    managed_services?: emissions_def;
  };
  downstream_emissions?: {
    end_user_devices?: emissions_def;
    network_data_transfer?: emissions_def;
    downstream_infrastructure?: emissions_def;
  };
};

export type emissions_def = {
  emissions: number;
  notes?: string;
};
export type scope_2_emissions_def = {
  emissions: number;
  notes?: string;
  method?: 'location-based' | 'market-based' | 'mixed-methods' | 'other';
};
