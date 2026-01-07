import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstimatorFormValues, EstimatorValues, locationArray } from '../types/carbon-estimator';
import {
  locationDescriptions,
  ValidationError,
  errorConfig,
  ErrorSummaryState,
} from './carbon-estimator-form.constants';
import { CloudFormSectionComponent } from '../features/cloud/components/cloud-form-section.component';
import { FormStateService } from '../services/form-state.service';
import { SaasFormSectionComponent } from '../features/saas/components/saas-form-section.component';
import { FormService } from '../services/form.service';
import { OrganisationFormSectionComponent } from '../features/organisation/components/organisation-form-section.component';
import { OnPremiseFormSectionComponent } from '../features/on-premise/components/on-premise-form-section.component';
import { CustomerFormSectionComponent } from '../features/customers/components/customer-form-section.component';
import { ErrorSummaryComponent } from '../components/error-summary/error-summary.component';
@Component({
  selector: 'carbon-estimator-form',
  standalone: true,
  templateUrl: './carbon-estimator-form.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FormsModule,
    CommonModule,
    ErrorSummaryComponent,
    CloudFormSectionComponent,
    SaasFormSectionComponent,
    OrganisationFormSectionComponent,
    OnPremiseFormSectionComponent,
    CustomerFormSectionComponent,
  ],
})
export class CarbonEstimatorFormComponent implements OnInit, OnDestroy {
  private formService = inject(FormService);
  private changeDetector = inject(ChangeDetectorRef);
  private formStateService = inject(FormStateService);

  @Output() public formSubmit: EventEmitter<EstimatorValues> = new EventEmitter<EstimatorValues>();
  @Output() public formReset: EventEmitter<void> = new EventEmitter();

  @ViewChild(ErrorSummaryComponent) errorSummary?: ErrorSummaryComponent;

  // The visibilitychange event is fired in several scenarios including when the
  // user navigates away from the page or switches app on mobile.
  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    this.storeFormState();
  }

  public estimatorForm!: FormGroup<EstimatorFormValues>;

  public locationDescriptions = locationArray.map(location => ({
    value: location,
    description: locationDescriptions[location],
  }));

  public errorConfig = errorConfig;
  public errorSummaryState: ErrorSummaryState = {
    showErrorSummary: false,
    validationErrors: [],
  };
  private submitted = false;

  public ngOnInit() {
    this.estimatorForm = this.formService.estimatorForm;

    this.loadStoredFormState();
  }

  ngOnDestroy(): void {
    this.storeFormState();
  }

  public handleSubmit() {
    this.submitted = true;
    if (this.estimatorForm.invalid) {
      this.errorSummaryState = {
        showErrorSummary: true,
        validationErrors: this.getValidationErrors(),
      };
      this.changeDetector.detectChanges();
      this.errorSummary?.summary.nativeElement.focus();
      return;
    }
    this.resetValidationErrors();
    const formValue = this.estimatorForm.getRawValue();
    if (formValue.onPremise.serverLocation === 'unknown') {
      formValue.onPremise.serverLocation = 'WORLD';
    }
    if (formValue.cloud.cloudLocation === 'unknown') {
      formValue.cloud.cloudLocation = 'WORLD';
    }
    if (!formValue.downstream.monthlyActiveUsers) {
      formValue.downstream.monthlyActiveUsers = 0;
    }
    this.formSubmit.emit(formValue as EstimatorValues);
  }

  public resetForm() {
    this.formService.reset();
    this.submitted = false;
    this.resetValidationErrors();
    this.clearStoredFormState();
    this.formReset.emit();
  }

  public get headCount() {
    return this.estimatorForm.get('upstream.headCount');
  }

  public get numberOfServers() {
    return this.estimatorForm.get('onPremise.numberOfServers');
  }

  public get monthlyActiveUsers() {
    return this.estimatorForm.get('downstream.monthlyActiveUsers');
  }

  private getValidationErrors() {
    const validationErrors: ValidationError[] = [];
    if (this.headCount?.invalid) {
      validationErrors.push(this.errorConfig.headCount);
    }
    if (this.numberOfServers?.invalid) {
      validationErrors.push(this.errorConfig.numberOfServers);
    }
    if (this.monthlyActiveUsers?.invalid) {
      validationErrors.push(this.errorConfig.monthlyActiveUsers);
    }

    return validationErrors;
  }

  private resetValidationErrors() {
    this.errorSummaryState = {
      showErrorSummary: false,
      validationErrors: [],
    };
  }

  private storeFormState() {
    this.formStateService.storeFormState(this.estimatorForm, this.submitted);
  }

  private loadStoredFormState() {
    const storedState = this.formStateService.getStoredFormState();
    if (storedState) {
      this.formService.load(storedState.formValue);
      this.formStateService.setControlStates(this.estimatorForm, storedState.controlStates);

      if (storedState.submitted) {
        this.handleSubmit();
      }
    }
  }

  private clearStoredFormState() {
    this.formStateService.clearStoredFormState();
  }
}
