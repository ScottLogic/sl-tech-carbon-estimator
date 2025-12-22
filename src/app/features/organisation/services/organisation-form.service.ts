import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorldLocation } from '../../../types/carbon-estimator';

export type Organisation = {
  headCount: number;
  desktopPercentage: number;
  employeeLocation: WorldLocation;
};

export type OrganisationFormGroup = FormGroup<{
  headCount: FormControl<number>;
  desktopPercentage: FormControl<number>;
  employeeLocation: FormControl<WorldLocation>;
}>;

@Injectable({
  providedIn: 'root',
})
export class OrganisationFormService {
  private formBuilder = inject(FormBuilder);

  private defaultValues: Organisation = {
    headCount: 100,
    desktopPercentage: 50,
    employeeLocation: 'WORLD',
  };

  form: OrganisationFormGroup = this.createSaasForm();

  createSaasForm(): OrganisationFormGroup {
    return this.formBuilder.nonNullable.group({
      headCount: [this.defaultValues.headCount, [Validators.required, Validators.min(1)]],
      desktopPercentage: [this.defaultValues.desktopPercentage],
      employeeLocation: [this.defaultValues.employeeLocation],
    });
  }
}
