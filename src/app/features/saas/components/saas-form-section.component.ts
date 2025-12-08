import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionHeaderComponent } from '../../../components/section-header/section-header.component';
import { errorConfig, formContext } from '../../../carbon-estimator-form/carbon-estimator-form.constants';
import { InvalidatedPipe } from '../../../pipes/invalidated.pipe';

@Component({
  selector: 'saas-form-section',
  templateUrl: './saas-form-section.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SectionHeaderComponent, InvalidatedPipe],
})
export class SaasFormSectionComponent {
  estimatorForm = input.required<FormGroup>();

  public get organisationUserCount() {
    return this.estimatorForm().get('saas.microsoft365.organisationUserCount');
  }
  public formContext = formContext;
  public errorConfig = errorConfig;
}
