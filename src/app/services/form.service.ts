import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defaultSaasValues, SaasFormService } from '../features/saas/services/saas-form.service';
import { EstimatorFormValues, EstimatorValues } from '../types/carbon-estimator';
import { EstimatorFormRawValue } from '../carbon-estimator-form/carbon-estimator-form.constants';
import { CloudFormService, defaultCloudValues } from '../features/cloud/services/cloud-form.service';
import { OrganisationFormService } from '../features/organisation/services/organisation-form.service';
import { OnPremiseFormService } from '../features/on-premise/services/on-premise-form.service';

export const defaultValues: Required<EstimatorValues> = {
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
  cloud: defaultCloudValues,
  downstream: {
    noDownstream: false,
    customerLocation: 'WORLD',
    monthlyActiveUsers: 100,
    mobilePercentage: 50,
    purposeOfSite: 'average',
  },
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

  estimatorForm: FormGroup<EstimatorFormValues> = this.initialise();

  initialise() {
    return this.formBuilder.nonNullable.group({
      upstream: this.organisationFormService.form,
      onPremise: this.onPremFormService.form,
      cloud: this.cloudFormService.form,
      downstream: this.formBuilder.nonNullable.group({
        noDownstream: [false],
        customerLocation: [defaultValues.downstream.customerLocation],
        monthlyActiveUsers: [defaultValues.downstream.monthlyActiveUsers, [Validators.required, Validators.min(1)]],
        mobilePercentage: [defaultValues.downstream.mobilePercentage],
        purposeOfSite: [defaultValues.downstream.purposeOfSite],
      }),
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
