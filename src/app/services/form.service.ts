import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultSaasValues, SaasFormService } from '../features/saas/services/saas-form.service';
import { EstimatorFormValues, EstimatorValues } from '../types/carbon-estimator';
import { EstimatorFormRawValue } from '../carbon-estimator-form/carbon-estimator-form.constants';
import { CloudFormService, defaultCloudValues } from '../features/cloud/services/cloud-form.service';
import { OrganisationFormService } from '../features/organisation/services/organisation-form.service';
import { defaultOnPremValues, OnPremiseFormService } from '../features/on-premise/services/on-premise-form.service';
import { CustomerFormService, defaultCustomerValues } from '../features/customers/services/customer-form.service';

export const defaultValues: Required<EstimatorValues> = {
  upstream: {
    headCount: 100,
    desktopPercentage: 50,
    employeeLocation: 'WORLD',
  },
  onPremise: defaultOnPremValues,
  cloud: defaultCloudValues,
  downstream: defaultCustomerValues,
  saas: defaultSaasValues,
};

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private formBuilder = inject(FormBuilder);
  private organisationFormService = inject(OrganisationFormService);
  private saasFormService = inject(SaasFormService);
  private cloudFormService = inject(CloudFormService);
  private onPremFormService = inject(OnPremiseFormService);
  private customerFormService = inject(CustomerFormService);

  estimatorForm: FormGroup<EstimatorFormValues> = this.initialise();

  initialise() {
    return this.formBuilder.nonNullable.group({
      upstream: this.organisationFormService.form,
      onPremise: this.onPremFormService.form,
      cloud: this.cloudFormService.form,
      downstream: this.customerFormService.form,
      saas: this.saasFormService.form,
    });
  }

  load(form: EstimatorValues | EstimatorFormRawValue): void {
    this.estimatorForm.setValue(form);
  }

  reset(): void {
    this.estimatorForm.reset();
  }
}
