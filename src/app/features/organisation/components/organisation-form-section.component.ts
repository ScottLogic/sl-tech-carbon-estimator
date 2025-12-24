import { Component, computed, inject, OnInit, Signal, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../../components/section-header/section-header.component';
import { formContext, FormContextSection } from '../../../carbon-estimator-form/carbon-estimator-form.constants';
import { defaultValues, OrganisationFormGroup, OrganisationFormService } from '../services/organisation-form.service';
import { InvalidatedPipe } from '../../../pipes/invalidated.pipe';
import { LocationInputComponent } from '../../../components/location-input/location-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'organisation-form-section',
  standalone: true,
  templateUrl: './organisation-form-section.component.html',
  imports: [
    SectionHeaderComponent,
    InvalidatedPipe,
    LocationInputComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class OrganisationFormSectionComponent implements OnInit {
  private formService = inject(OrganisationFormService);

  public form!: OrganisationFormGroup;

  ngOnInit(): void {
    this.form = this.formService.form;
    this.form.get('desktopPercentage')?.valueChanges.subscribe(desktopPercentage => {
      this.desktopPercentage.set(desktopPercentage);
    });
  }

  formContext: FormContextSection = formContext.upstream;

  public desktopPercentage = signal<number>(defaultValues.desktopPercentage);
  public laptopPercentage: Signal<number> = computed(() => 100 - this.desktopPercentage());

  public get headCount() {
    return this.form.get('headCount');
  }

  errorConfig = {
    headCount: {
      inputId: 'headCount',
      errorMessage: 'The number of employees must be greater than 0',
    },
  };
}
