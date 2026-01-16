import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PurposeOfSite, WorldLocation } from '../../../types/carbon-estimator';

export type Customer = {
  noDownstream: boolean;
  customerLocation: WorldLocation;
  monthlyActiveUsers: number;
  mobilePercentage: number;
  purposeOfSite: PurposeOfSite;
};

export type CustomerFormGroup = FormGroup<{
  noDownstream: FormControl<boolean>;
  customerLocation: FormControl<WorldLocation>;
  monthlyActiveUsers: FormControl<number>;
  mobilePercentage: FormControl<number>;
  purposeOfSite: FormControl<PurposeOfSite>;
}>;

export const defaultCustomerValues: Required<Customer> = {
  noDownstream: false,
  customerLocation: 'WORLD',
  monthlyActiveUsers: 100,
  mobilePercentage: 50,
  purposeOfSite: 'average',
};

@Injectable({
  providedIn: 'root',
})
export class CustomerFormService {
  private formBuilder = inject(FormBuilder);

  form: CustomerFormGroup = this.createForm();

  createForm(): CustomerFormGroup {
    return this.formBuilder.nonNullable.group({
      noDownstream: [false],
      customerLocation: [defaultCustomerValues.customerLocation],
      monthlyActiveUsers: [defaultCustomerValues.monthlyActiveUsers, [Validators.required, Validators.min(1)]],
      mobilePercentage: [defaultCustomerValues.mobilePercentage],
      purposeOfSite: [defaultCustomerValues.purposeOfSite],
    });
  }
}
