import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { defaultMicrosoft365Values, Microsoft365 } from '../components/microsoft365-form/microsoft365.constants';
import { SaasFormGroup } from '../components/saas.constants';

export type Saas = {
  microsoft365: Microsoft365;
};

export const defaultSaasValues: Required<Saas> = {
  microsoft365: defaultMicrosoft365Values,
};

@Injectable({
  providedIn: 'root',
})
export class SaasFormService {
  private formBuilder = inject(FormBuilder);

  form: SaasFormGroup = this.createSaasForm();

  createSaasForm(): SaasFormGroup {
    return this.formBuilder.nonNullable.group({
      microsoft365: this.formBuilder.nonNullable.group({
        useMicrosoft365: [defaultSaasValues.microsoft365.useMicrosoft365],
        organisationUserCount: [
          defaultSaasValues.microsoft365.organisationUserCount,
          [Validators.required, Validators.min(1)],
        ],
      }),
    });
  }
}
