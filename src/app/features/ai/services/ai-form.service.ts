import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorldLocation } from '../../../types/carbon-estimator';
import { AiInference, AiProvider } from '../types/ai-types';
import { AiTaskType } from '../types/ai-energy-data';

export type AiInferenceFormGroup = FormGroup<{
  noAiInference: FormControl<boolean>;
  primaryTaskType: FormControl<AiTaskType>;
  monthlyInferences: FormControl<number>;
  aiServiceProvider: FormControl<AiProvider>;
  aiServiceLocation: FormControl<WorldLocation>;
}>;

export const defaultAiValues: AiInference = {
  noAiInference: false,
  primaryTaskType: 'text-generation',
  monthlyInferences: 1000,
  aiServiceProvider: 'openai',
  aiServiceLocation: 'WORLD',
};

@Injectable({
  providedIn: 'root',
})
export class AiFormService {
  private formBuilder = inject(FormBuilder);

  form: AiInferenceFormGroup = this.createForm();

  createForm(): AiInferenceFormGroup {
    return this.formBuilder.nonNullable.group({
      noAiInference: [defaultAiValues.noAiInference],
      primaryTaskType: [defaultAiValues.primaryTaskType],
      monthlyInferences: [defaultAiValues.monthlyInferences, [Validators.required, Validators.min(1)]],
      aiServiceProvider: [defaultAiValues.aiServiceProvider],
      aiServiceLocation: [defaultAiValues.aiServiceLocation as WorldLocation],
    });
  }
}
