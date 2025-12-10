import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvalidatedPipe } from '../../../../pipes/invalidated.pipe';

@Component({
  selector: 'microsoft365-form-section',
  templateUrl: './microsoft365-form-section.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, InvalidatedPipe],
})
export class Microsoft365FormSectionComponent {
  form = input.required<FormGroup>();

  public get organisationUserCount() {
    return this.form().get('organisationUserCount');
  }

  public get useMicrosoft365() {
    return this.form().get('useMicrosoft365')?.value;
  }

  public context = {
    toggleLabel: 'Do you use Microsoft 365?',
    userCountLabel: 'On average, how many user do you have?',
  };

  public errorConfig = {
    organisationUserCount: {
      errorMessage: 'The number of users in the organisation must be greater than 0',
    },
  };
}
