import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../../components/section-header/section-header.component';
import {
  formContext,
  FormContextSection,
  questionPanelConfig,
} from '../../../carbon-estimator-form/carbon-estimator-form.constants';
import { InvalidatedPipe } from '../../../pipes/invalidated.pipe';
import { LocationInputComponent } from '../../../components/location-input/location-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpansionPanelComponent } from '../../../expansion-panel/expansion-panel.component';
import { CustomerFormGroup, CustomerFormService, defaultCustomerValues } from '../services/customer-form.service';

@Component({
  selector: 'customer-form-section',
  standalone: true,
  templateUrl: './customer-form-section.component.html',
  imports: [
    SectionHeaderComponent,
    InvalidatedPipe,
    LocationInputComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ExpansionPanelComponent,
  ],
})
export class CustomerFormSectionComponent implements OnInit {
  private formService = inject(CustomerFormService);

  public form!: CustomerFormGroup;

  mobilePercentage = signal(defaultCustomerValues.mobilePercentage);
  computerPercentage = computed(() => 100 - this.mobilePercentage());

  public noDownstream: boolean = defaultCustomerValues.noDownstream;

  get monthlyActiveUsers() {
    return this.form.get('monthlyActiveUsers');
  }

  ngOnInit(): void {
    this.form = this.formService.form;

    this.form.get('noDownstream')?.valueChanges.subscribe(noDownstream => {
      const monthlyActiveUsers = this.form.get('monthlyActiveUsers');
      if (noDownstream) {
        monthlyActiveUsers?.disable();
      } else {
        monthlyActiveUsers?.enable();
      }
      this.noDownstream = noDownstream;
    });

    this.form.get('mobilePercentage')?.valueChanges.subscribe(mobilePercentage => {
      this.mobilePercentage.set(mobilePercentage);
    });
  }

  formContext: FormContextSection = formContext.downstream;
  public questionPanelConfig = questionPanelConfig;

  errorConfig = {
    monthlyActiveUsers: {
      inputId: 'monthlyActiveUsers',
      errorMessage: 'The number of monthly active users must be greater than 0',
    },
  };
}
