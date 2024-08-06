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
  FormState,
} from './carbon-estimator-form.constants';
import { NoteComponent } from '../note/note.component';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';
import { FormatCostRangePipe } from '../pipes/format-cost-range.pipe';
import { InvalidatedPipe } from '../pipes/invalidated.pipe';
import { ErrorSummaryComponent } from '../error-summary/error-summary.component';
import { ExternalLinkDirective } from '../directives/external-link.directive';
import { StorageService } from '../services/storage.service';
import { compareCostRanges } from '../utils/cost-range';

@Component({
  selector: 'carbon-estimator-form',
  standalone: true,
  templateUrl: './carbon-estimator-form.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    JsonPipe,
    FormsModule,
    CommonModule,
    NoteComponent,
    ExpansionPanelComponent,
    FormatCostRangePipe,
    InvalidatedPipe,
    ErrorSummaryComponent,
    ExternalLinkDirective,
  ],
})
export class CarbonEstimatorFormComponent implements OnInit, OnDestroy {
  public formValue = input<EstimatorValues>();

  @Output() public formSubmit: EventEmitter<EstimatorValues> = new EventEmitter<EstimatorValues>();
  @Output() public formReset: EventEmitter<void> = new EventEmitter();

  @ViewChild(ErrorSummaryComponent) errorSummary?: ErrorSummaryComponent;

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(): void {
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

  public locationDescriptions = locationArray.map(location => ({
    value: location,
    description: locationDescriptions[location],
  }));

  public questionPanelConfig = questionPanelConfig;

  public errorConfig = errorConfig;
  public showErrorSummary = false;
  public validationErrors: ValidationError[] = [];

  public compareCostRanges = compareCostRanges;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private estimationService: CarbonEstimationService,
    private storageService: StorageService
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

      for (const [controlKey, controlState] of Object.entries(storedFormState.controlStates)) {
        const control = this.estimatorForm.get(controlKey)!;
        if (controlState.dirty) {
          control.markAsDirty();
        }
        if (controlState.touched) {
          control.markAsTouched();
        }
      }

      this.showErrorSummary = storedFormState.errorSummaryState.showErrorSummary;
      this.validationErrors = storedFormState.errorSummaryState.validationErrors;
    }
  }

  ngOnDestroy(): void {
    this.storeFormState();
  }

  public handleSubmit() {
    if (this.estimatorForm.invalid) {
      this.validationErrors = this.getValidationErrors();
      this.showErrorSummary = true;
      this.changeDetector.detectChanges();
      this.errorSummary?.summary.nativeElement.focus();
      return;
    }
    this.showErrorSummary = false;
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
    this.storeFormState();
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

    return validationErrors;
  }

  private getControlStates() {
    const controlStates: Record<string, ControlState> = {};

    for (const [groupName, formGroup] of Object.entries(this.estimatorForm.controls)) {
      for (const [controlName, control] of Object.entries(formGroup.controls)) {
        if (control.dirty || control.touched) {
          controlStates[`${groupName}.${controlName}`] = {
            dirty: control.dirty,
            touched: control.touched,
          };
        }
      }
    }

    return controlStates;
  }

  private storeFormState() {
    const formValue = this.estimatorForm.getRawValue();
    const controlStates = this.getControlStates();
    const errorSummaryState: ErrorSummaryState = {
      showErrorSummary: this.showErrorSummary,
      validationErrors: this.validationErrors,
    };
    const formState: FormState = {
      formValue,
      controlStates,
      errorSummaryState,
    };
    this.storageService.set('formState', JSON.stringify(formState));
  }

  private getStoredFormState() {
    const storedFormState = this.storageService.get('formState');
    return storedFormState ? (JSON.parse(storedFormState) as FormState) : null;
  }
}
