import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AiFormService, AiInferenceFormGroup } from '../services/ai-form.service';
import {
  errorConfig,
  formContext,
  FormContextSection,
  questionPanelConfig,
} from '../../../components/carbon-estimator-form/carbon-estimator-form.constants';
import { ExpansionPanelComponent } from '../../../components/expansion-panel/expansion-panel.component';
import { InvalidatedPipe } from '../../../pipes/invalidated.pipe';
import { SectionHeaderComponent } from '../../../components/section-header/section-header.component';
import { LocationInputComponent } from '../../../components/location-input/location-input.component';

@Component({
  selector: 'ai-form-section',
  templateUrl: './ai-form-section.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ExpansionPanelComponent,
    InvalidatedPipe,
    SectionHeaderComponent,
    LocationInputComponent,
  ],
})
export class AiFormSectionComponent implements OnInit {
  private formService = inject(AiFormService);
  aiInferenceForm!: AiInferenceFormGroup;

  questionPanelConfig = questionPanelConfig;
  errorConfig = errorConfig;
  formContext: FormContextSection = formContext.aiInference;

  get monthlyInferences() {
    return this.aiInferenceForm.get('monthlyInferences');
  }

  get noAiInference() {
    return this.aiInferenceForm.get('noAiInference')?.value ?? false;
  }

  public ngOnInit() {
    this.aiInferenceForm = this.formService.form;
  }
}
