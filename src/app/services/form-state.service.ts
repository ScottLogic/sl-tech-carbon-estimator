import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { FormGroup } from '@angular/forms';
import { ControlState, ErrorSummaryState, FormState } from '../carbon-estimator-form/carbon-estimator-form.constants';
import { EstimatorFormValues } from '../types/carbon-estimator';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  constructor(private storageService: StorageService) {}

  getControlStates(estimatorForm: FormGroup<EstimatorFormValues>) {
    const controlStates: Record<string, ControlState> = {};

    for (const [groupName, formGroup] of Object.entries(estimatorForm.controls)) {
      for (const [controlName, control] of Object.entries(formGroup.controls)) {
        if (control.dirty || control.touched) {
          controlStates[`${groupName}.${controlName}`] = {
            dirty: control.dirty,
            touched: control.touched,
          };
        }
      }
    }

    return controlStates;
  }

  setControlStates(estimatorForm: FormGroup<EstimatorFormValues>, controlStates: Record<string, ControlState>) {
    for (const [controlKey, controlState] of Object.entries(controlStates)) {
      const control = estimatorForm.get(controlKey);
      if (controlState.dirty) {
        control?.markAsDirty();
      }
      if (controlState.touched) {
        control?.markAsTouched();
      }
    }
  }

  storeFormState(estimatorForm: FormGroup<EstimatorFormValues>, errorSummaryState: ErrorSummaryState) {
    const formState: FormState = {
      formValue: estimatorForm.getRawValue(),
      controlStates: this.getControlStates(estimatorForm),
      errorSummaryState,
    };
    this.storageService.set('formState', JSON.stringify(formState));
  }

  getStoredFormState() {
    const storedFormState = this.storageService.get('formState');
    return storedFormState ? (JSON.parse(storedFormState) as FormState) : null;
  }

  clearStoredFormState() {
    this.storageService.removeItem('formState');
  }
}
