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

export const defaultValues: Organisation = {
  headCount: 100,
  desktopPercentage: 50,
  employeeLocation: 'WORLD',
};

@Injectable({
  providedIn: 'root',
})
export class OrganisationFormService {
  private formBuilder = inject(FormBuilder);

  form: OrganisationFormGroup = this.createOrganisationForm();

  private createOrganisationForm(): OrganisationFormGroup {
    return this.formBuilder.nonNullable.group({
      headCount: [defaultValues.headCount, [Validators.required, Validators.min(1)]],
      desktopPercentage: [defaultValues.desktopPercentage],
      employeeLocation: [defaultValues.employeeLocation],
    });
  }
}
