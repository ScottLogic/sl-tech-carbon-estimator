import { OrganisationSection } from '../page-objects/organisation-section';
import { CloudServicesSection } from '../page-objects/cloud-services-section';
import { SaasSection } from '../page-objects/saas-section';
import { CustomersSection } from '../page-objects/customers-section';
import { OnPremSection } from '../page-objects/on-prem-section';
import { InputValues } from '../utilities/types';

export class AllSections {
  constructor(
    public organisationSection: OrganisationSection,
    public onPremSection: OnPremSection,
    public cloudServicesSection: CloudServicesSection,
    public saasSection: SaasSection,
    public customersSection: CustomersSection
  ) {}

  async assertAllSectionElementsAreVisible() {
    await this.organisationSection.assertOrganisationSectionVisible();
    await this.onPremSection.assertOnPremiseSectionVisible();
    await this.cloudServicesSection.assertDefaultCloudElementVisibility();
    await this.customersSection.assertCustomersSectionVisible();
    await this.saasSection.assertSaasSectionVisible();
  }

  async fillAllSections(input_values: InputValues) {
    await this.organisationSection.organisationInputs(
      input_values.employees,
      input_values.hardware_percentage,
      input_values.employees_location
    );
    await this.onPremSection.onPremInputs(
      input_values.unknown_servers,
      input_values.number_of_servers,
      input_values.server_location
    );
    await this.cloudServicesSection.cloudInputs(
      input_values.no_cloud,
      input_values.cloud_location,
      input_values.monthly_cloud_cost,
      input_values.cloud_percentage
    );
    await this.saasSection.saasInputs(input_values.uses_m365, input_values.m365_users);
    await this.customersSection.customerInputs(
      input_values.no_downstream,
      input_values.downstream_type,
      input_values.downstream_location,
      input_values.downstream_users,
      input_values.downstream_mobile_percentage
    );
  }
}
