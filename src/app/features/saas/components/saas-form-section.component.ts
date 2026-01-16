import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderComponent } from '../../../components/section-header/section-header.component';
import { Microsoft365FormSectionComponent } from './microsoft365-form/microsoft365-form-section.component';
import { saasContext } from './saas.constants';
import { SaasFormService } from '../services/saas-form.service';

@Component({
  selector: 'saas-form-section',
  templateUrl: './saas-form-section.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SectionHeaderComponent, Microsoft365FormSectionComponent],
})
export class SaasFormSectionComponent {
  private saasFormService = inject(SaasFormService);

  get microsoft365Form() {
    return this.saasFormService.form.get('microsoft365') as FormGroup;
  }

  public formContext = saasContext;
}
