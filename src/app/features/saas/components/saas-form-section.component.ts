import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderComponent } from '../../../components/section-header/section-header.component';
import { formContext } from '../../../carbon-estimator-form/carbon-estimator-form.constants';

@Component({
  selector: 'saas-form-section',
  templateUrl: './saas-form-section.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SectionHeaderComponent],
})
export class SaasFormSectionComponent {
  estimatorForm = input.required<FormGroup>();

  public formContext = formContext;
}
