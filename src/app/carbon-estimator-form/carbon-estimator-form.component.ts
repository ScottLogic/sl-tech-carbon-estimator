import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstimatorFormValues, EstimatorValues, WorldLocation } from '../carbon-estimator';
import { defaultValues, formContext, helperTextStrings } from './constants';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { NoteComponent } from '../note/note.component';
import { CarbonEstimationService } from '../services/carbon-estimation.service';

@Component({
  selector: 'sl-carbon-estimator-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, FormsModule, CommonModule, SatPopoverModule, NoteComponent],
  templateUrl: './carbon-estimator-form.component.html',
  styles: ['input.ng-touched.ng-invalid { border-color: red; }'],
})
export class CarbonEstimatorFormComponent implements OnInit {
  public formValue = input<EstimatorValues>();

  @Output() public formSubmit: EventEmitter<EstimatorValues> = new EventEmitter<EstimatorValues>();

  public estimatorForm!: FormGroup<EstimatorFormValues>;

  public formContext = formContext;

  public helperText = helperTextStrings;

  public desktopPercentage = defaultValues.upstream.desktopPercentage;
  public laptopPercentage: number = 100 - this.desktopPercentage;

  public cloudPercentage = defaultValues.cloud.cloudPercentage;
  public onPremisePercentage: number = 100 - this.cloudPercentage;

  public mobilePercentage = defaultValues.downstream.mobilePercentage;
  public computerPercentage: number = 100 - this.mobilePercentage;

  public previewServerCount = 0;

  public get headCount(): number {
    return this.estimatorForm.get('upstream.headCount')?.value ?? defaultValues.upstream.headCount;
  }

  public get estimateServerCount(): boolean {
    return (
      this.estimatorForm.get('onPremise.estimateServerCount')?.value ?? defaultValues.onPremise.estimateServerCount
    );
  }

  public noCloudServices: boolean = defaultValues.cloud.noCloudServices;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private estimationService: CarbonEstimationService
  ) {}

  public ngOnInit() {
    this.estimatorForm = this.formBuilder.nonNullable.group({
      upstream: this.formBuilder.nonNullable.group({
        headCount: [defaultValues.upstream.headCount, Validators.required],
        desktopPercentage: [defaultValues.upstream.desktopPercentage],
      }),
      onPremise: this.formBuilder.nonNullable.group({
        estimateServerCount: [defaultValues.onPremise.estimateServerCount],
        serverLocation: [defaultValues.onPremise.serverLocation as WorldLocation | 'unknown'],
        numberOfServers: [defaultValues.onPremise.numberOfServers, Validators.required],
      }),
      cloud: this.formBuilder.nonNullable.group({
        noCloudServices: [false],
        cloudLocation: [defaultValues.cloud.cloudLocation as WorldLocation | 'unknown'],
        cloudPercentage: [defaultValues.cloud.cloudPercentage],
        monthlyCloudBill: [defaultValues.cloud.monthlyCloudBill],
      }),
      downstream: this.formBuilder.nonNullable.group({
        customerLocation: [defaultValues.downstream.customerLocation],
        monthlyActiveUsers: [defaultValues.downstream.monthlyActiveUsers],
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

    this.estimatorForm.get('cloud.noCloudServices')?.valueChanges.subscribe(noCloudServices => {
      this.noCloudServices = noCloudServices;
      this.refreshPreviewServerCount();
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
  }

  public handleSubmit() {
    const formValue = this.estimatorForm.getRawValue();
    if (formValue.onPremise.serverLocation === 'unknown') {
      formValue.onPremise.serverLocation = 'global';
    }
    if (formValue.cloud.cloudLocation === 'unknown') {
      formValue.cloud.cloudLocation = 'global';
    }
    this.formSubmit.emit(formValue as EstimatorValues);
  }

  public resetForm() {
    this.estimatorForm.reset();
    this.previewServerCount = 0;
    this.estimateServerCountChange();
  }

  public estimateServerCountChange() {
    const noServers = this.estimatorForm.get('onPremise.numberOfServers');
    if (this.estimateServerCount) {
      this.refreshPreviewServerCount();
      noServers?.disable();
    } else {
      noServers?.enable();
    }
  }

  private refreshPreviewServerCount() {
    this.previewServerCount = this.estimationService.estimateServerCount(
      this.estimatorForm.getRawValue() as EstimatorValues
    );
  }
}
