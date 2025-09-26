import { CommonModule, JsonPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  input,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstimatorFormValues, EstimatorValues, WorldLocation, locationArray } from '../types/carbon-estimator';
import {
  costRanges,
  defaultValues,
  formContext,
  questionPanelConfig,
  locationDescriptions,
  ValidationError,
  errorConfig,
  ControlState,
  ErrorSummaryState,
} from './carbon-estimator-form.constants';
import { NoteComponent } from '../note/note.component';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';
import { FormatCostRangePipe } from '../pipes/format-cost-range.pipe';
import { InvalidatedPipe } from '../pipes/invalidated.pipe';
import { ErrorSummaryComponent } from '../error-summary/error-summary.component';
import { ExternalLinkDirective } from '../directives/external-link.directive';
import { compareCostRanges } from '../utils/cost-range';
import { FormStateService } from '../services/form-state.service';

@Component({
  selector: 'carbon-estimator-form',
  standalone: true,
  templateUrl: './carbon-estimator-form.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FormsModule,
    CommonModule,
    NoteComponent,
    ExpansionPanelComponent,
    FormatCostRangePipe,
    InvalidatedPipe,
    ErrorSummaryComponent,
    ExternalLinkDirective
],
})
export class CarbonEstimatorFormComponent implements OnInit, OnDestroy {
  public formValue = input<EstimatorValues>();

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

  public formContext = formContext;
  public costRanges = costRanges;

  public desktopPercentage = defaultValues.upstream.desktopPercentage;
  public laptopPercentage: number = 100 - this.desktopPercentage;

  public cloudPercentage = defaultValues.cloud.cloudPercentage;
  public onPremisePercentage: number = 100 - this.cloudPercentage;

  public mobilePercentage = defaultValues.downstream.mobilePercentage;
  public computerPercentage: number = 100 - this.mobilePercentage;

  public estimateServerCount = false;
  public previewServerCount = 0;

  public noCloudServices: boolean = defaultValues.cloud.noCloudServices;
  public noDownstream: boolean = defaultValues.downstream.noDownstream;
  public noAIInference: boolean = defaultValues.aiInference.noAIInference;

  public locationDescriptions = locationArray.map(location => ({
    value: location,
    description: locationDescriptions[location],
  }));

  public questionPanelConfig = questionPanelConfig;

  public errorConfig = errorConfig;
  public errorSummaryState: ErrorSummaryState = {
    showErrorSummary: false,
    validationErrors: [],
  };
  public submitted = false;

  public compareCostRanges = compareCostRanges;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private estimationService: CarbonEstimationService,
    private formStateService: FormStateService
  ) {}

  public ngOnInit() {
    this.estimatorForm = this.formBuilder.nonNullable.group({
      upstream: this.formBuilder.nonNullable.group({
        headCount: [defaultValues.upstream.headCount, [Validators.required, Validators.min(1)]],
        desktopPercentage: [defaultValues.upstream.desktopPercentage],
        employeeLocation: [defaultValues.upstream.employeeLocation],
      }),
      onPremise: this.formBuilder.nonNullable.group({
        estimateServerCount: [defaultValues.onPremise.estimateServerCount],
        serverLocation: [defaultValues.onPremise.serverLocation as WorldLocation | 'unknown'],
        numberOfServers: [defaultValues.onPremise.numberOfServers, [Validators.required, Validators.min(0)]],
      }),
      cloud: this.formBuilder.nonNullable.group({
        noCloudServices: [false],
        cloudLocation: [defaultValues.cloud.cloudLocation as WorldLocation | 'unknown'],
        cloudPercentage: [defaultValues.cloud.cloudPercentage],
        monthlyCloudBill: [defaultValues.cloud.monthlyCloudBill],
      }),
      downstream: this.formBuilder.nonNullable.group({
        noDownstream: [false],
        customerLocation: [defaultValues.downstream.customerLocation],
        monthlyActiveUsers: [defaultValues.downstream.monthlyActiveUsers, [Validators.required, Validators.min(1)]],
        mobilePercentage: [defaultValues.downstream.mobilePercentage],
        purposeOfSite: [defaultValues.downstream.purposeOfSite],
      }),
      aiInference: this.formBuilder.nonNullable.group({
        noAIInference: [defaultValues.aiInference.noAIInference],
        primaryTaskType: [defaultValues.aiInference.primaryTaskType],
        monthlyInferences: [defaultValues.aiInference.monthlyInferences, [Validators.required, Validators.min(1)]],
        aiServiceProvider: [defaultValues.aiInference.aiServiceProvider],
        aiServiceLocation: [defaultValues.aiInference.aiServiceLocation],
      }),
    });

    this.estimatorForm.get('upstream.headCount')?.valueChanges.subscribe(() => {
      this.refreshPreviewServerCount();
    });

    this.estimatorForm.get('upstream.desktopPercentage')?.valueChanges.subscribe(desktopPercentage => {
      this.desktopPercentage = desktopPercentage;
      this.laptopPercentage = 100 - this.desktopPercentage;
    });

    this.estimatorForm.get('onPremise.estimateServerCount')?.valueChanges.subscribe(estimateServerCount => {
      this.estimateServerCount = estimateServerCount;
      this.refreshPreviewServerCount();
      const noServers = this.estimatorForm.get('onPremise.numberOfServers');
      if (this.estimateServerCount) {
        noServers?.disable();
      } else {
        noServers?.enable();
      }
    });

    this.estimatorForm.get('cloud.noCloudServices')?.valueChanges.subscribe(noCloudServices => {
      this.noCloudServices = noCloudServices;
      this.refreshPreviewServerCount();
      this.changeDetector.detectChanges();
    });

    this.estimatorForm.get('downstream.noDownstream')?.valueChanges.subscribe(noDownstream => {
      const monthlyActiveUsers = this.estimatorForm.get('downstream.monthlyActiveUsers');
      if (noDownstream) {
        monthlyActiveUsers?.disable();
      } else {
        monthlyActiveUsers?.enable();
      }
      this.noDownstream = noDownstream;
      this.changeDetector.detectChanges();
    });

    this.estimatorForm.get('aiInference.noAIInference')?.valueChanges.subscribe(noAIInference => {
      const monthlyInferences = this.estimatorForm.get('aiInference.monthlyInferences');
      if (noAIInference) {
        monthlyInferences?.disable();
      } else {
        monthlyInferences?.enable();
      }
      this.noAIInference = noAIInference;
      this.changeDetector.detectChanges();
    });

    this.estimatorForm.get('cloud.cloudPercentage')?.valueChanges.subscribe(cloudPercentage => {
      this.cloudPercentage = cloudPercentage;
      this.onPremisePercentage = 100 - this.cloudPercentage;
      this.refreshPreviewServerCount();
    });

    this.estimatorForm.get('downstream.mobilePercentage')?.valueChanges.subscribe(mobilePercentage => {
      this.mobilePercentage = mobilePercentage;
      this.computerPercentage = 100 - this.mobilePercentage;
    });

    const formValue = this.formValue();
    if (formValue !== undefined) {
      this.estimatorForm.setValue(formValue);
    }

    const storedFormState = this.getStoredFormState();

    if (storedFormState) {
      this.estimatorForm.setValue(storedFormState.formValue);
      this.setControlStates(storedFormState.controlStates);
      if (storedFormState.submitted) {
        this.handleSubmit();
      }
    }
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
    this.estimatorForm.reset();
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

  public get monthlyInferences() {
    return this.estimatorForm.get('aiInference.monthlyInferences');
  }

  private refreshPreviewServerCount() {
    if (this.estimateServerCount) {
      this.previewServerCount = this.estimationService.estimateServerCount(
        this.estimatorForm.getRawValue() as EstimatorValues
      );
    }
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
    if (this.monthlyInferences?.invalid) {
      validationErrors.push(this.errorConfig.monthlyInferences);
    }

    return validationErrors;
  }

  private resetValidationErrors() {
    this.errorSummaryState = {
      showErrorSummary: false,
      validationErrors: [],
    };
  }

  private setControlStates(controlStates: Record<string, ControlState>) {
    this.formStateService.setControlStates(this.estimatorForm, controlStates);
  }

  private storeFormState() {
    this.formStateService.storeFormState(this.estimatorForm, this.submitted);
  }

  private getStoredFormState() {
    return this.formStateService.getStoredFormState();
  }

  private clearStoredFormState() {
    this.formStateService.clearStoredFormState();
  }
}
