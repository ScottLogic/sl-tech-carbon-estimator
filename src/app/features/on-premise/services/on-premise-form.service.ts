import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorldLocation } from '../../../types/carbon-estimator';

export type OnPremise = {
  estimateServerCount: boolean;
  serverLocation: WorldLocation;
  numberOfServers: number;
};

export type OnPremiseFormGroup = FormGroup<{
  estimateServerCount: FormControl<boolean>;
  serverLocation: FormControl<WorldLocation | 'unknown'>;
  numberOfServers: FormControl<number>;
}>;

export const defaultOnPremValues: Required<OnPremise> = {
  estimateServerCount: false,
  serverLocation: 'WORLD',
  numberOfServers: 10,
};

@Injectable({
  providedIn: 'root',
})
export class OnPremiseFormService {
  private formBuilder = inject(FormBuilder);

  form: OnPremiseFormGroup = this.createForm();

  createForm(): OnPremiseFormGroup {
    return this.formBuilder.nonNullable.group({
      estimateServerCount: [false],
      serverLocation: [defaultOnPremValues.serverLocation as WorldLocation | 'unknown'],
      numberOfServers: [defaultOnPremValues.numberOfServers, [Validators.required, Validators.min(0)]],
    });
  }
}
