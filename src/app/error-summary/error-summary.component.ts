import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { ValidationError } from '../carbon-estimator-form/carbon-estimator-form.component';

@Component({
  selector: 'error-summary',
  standalone: true,
  imports: [],
  templateUrl: './error-summary.component.html',
})
export class ErrorSummaryComponent {
  validationErrors = input.required<ValidationError[]>();
  @ViewChild('errorSummary') summary!: ElementRef<HTMLDivElement>;
}
