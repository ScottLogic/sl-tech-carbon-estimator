import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defaultSaasValues, SaasFormService } from '../features/saas/services/saas-form.service';
import { EstimatorFormValues, EstimatorValues, WorldLocation } from '../types/carbon-estimator';
import { EstimatorFormRawValue } from '../carbon-estimator-form/carbon-estimator-form.constants';
import { CloudFormService, defaultCloudValues } from '../features/cloud/services/cloud-form.service';

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
  private saasFormService = inject(SaasFormService);
  private cloudFormService = inject(CloudFormService);

  estimatorForm: FormGroup<EstimatorFormValues> = this.initialise();

  initialise() {
    return this.formBuilder.nonNullable.group({
      upstream: this.formBuilder.nonNullable.group({
        headCount: [defaultValues.upstream.headCount, [Validators.required, Validators.min(1)]],
        desktopPercentage: [defaultValues.upstream.desktopPercentage],
        employeeLocation: [defaultValues.upstream.employeeLocation],
      }),
      onPremise: this.formBuilder.nonNullable.group({
        estimateServerCount: [defaultValues.onPremise.estimateServerCount],
        serverLocation: [defaultValues.onPremise.serverLocation as WorldLocation | 'unknown'],
        numberOfServers: [defaultValues.onPremise.numberOfServers, [Validators.required, Validators.min(0)]],
      }),
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
