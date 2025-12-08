import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderComponent } from '../../../components/section-header/section-header.component';
import { Microsoft365FormSectionComponent } from './microsoft365-form.component.html/microsoft365-form-section.component';
import { saasContext } from './saas.constants';

@Component({
  selector: 'saas-form-section',
  templateUrl: './saas-form-section.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SectionHeaderComponent, Microsoft365FormSectionComponent],
})
export class SaasFormSectionComponent {
  estimatorForm = input.required<FormGroup>();

  get microsoft365Form() {
    return this.estimatorForm().get('saas.microsoft365') as FormGroup;
  }

  public formContext = saasContext;
}
