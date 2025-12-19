import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaasFormService } from '../features/saas/services/saas-form.service';
import { EstimatorFormValues, EstimatorValues, WorldLocation } from '../types/carbon-estimator';
import { defaultValues, EstimatorFormRawValue } from '../carbon-estimator-form/carbon-estimator-form.constants';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private formBuilder = inject(FormBuilder);
  private saasFormService = inject(SaasFormService);

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
      cloud: this.formBuilder.nonNullable.group({
        noCloudServices: [false],
        cloudLocation: [defaultValues.cloud.cloudLocation as WorldLocation | 'unknown'],
        cloudPercentage: [defaultValues.cloud.cloudPercentage],
        monthlyCloudBill: [defaultValues.cloud.monthlyCloudBill],
      }),
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
