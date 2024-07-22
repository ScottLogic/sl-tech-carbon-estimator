import { Component, input } from '@angular/core';
import { ValidationError } from '../carbon-estimator-form/carbon-estimator-form.constants';

@Component({
  selector: 'error-summary',
  standalone: true,
  imports: [],
  templateUrl: './error-summary.component.html',
  styleUrl: './error-summary.component.css',
})
export class ErrorSummaryComponent {
  validationErrors = input.required<ValidationError[]>();
}
