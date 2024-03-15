import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstimatorFormValues, EstimatorValues } from '../carbon-estimator';
import { defaultValues, formContext, helperTextStrings } from './constants';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { NoteComponent } from '../note/note.component';

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

  public directUnknown = false;

  public get headCount(): number {
    return this.estimatorForm.get('upstream.headCount')?.value ?? defaultValues.upstream.headCount;
  }

  public noCloudServices: boolean = defaultValues.cloud.noCloudServices;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.estimatorForm = this.formBuilder.nonNullable.group({
      upstream: this.formBuilder.nonNullable.group({
        headCount: [defaultValues.upstream.headCount, Validators.required],
        desktopPercentage: [defaultValues.upstream.desktopPercentage],
      }),
      onPremise: this.formBuilder.nonNullable.group({
        serverLocation: [defaultValues.onPremise.serverLocation],
        numberOfServers: [defaultValues.onPremise.numberOfServers],
      }),
      cloud: this.formBuilder.nonNullable.group({
        noCloudServices: [false],
        cloudLocation: [defaultValues.cloud.cloudLocation],
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

    this.estimatorForm.get('upstream.desktopPercentage')?.valueChanges.subscribe(desktopPercentage => {
      this.desktopPercentage = desktopPercentage;
      this.laptopPercentage = 100 - this.desktopPercentage;
    });

    this.estimatorForm.get('cloud.noCloudServices')?.valueChanges.subscribe(noCloudServices => {
      this.noCloudServices = noCloudServices;
      this.changeDetector.detectChanges();
    });

    this.estimatorForm.get('cloud.cloudPercentage')?.valueChanges.subscribe(cloudPercentage => {
      this.cloudPercentage = cloudPercentage;
      this.onPremisePercentage = 100 - this.cloudPercentage;
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
    this.directUnknown = false;
    this.directUnknownChange();
  }

  public directUnknownChange() {
    const noServers = this.estimatorForm.get('onPremise.numberOfServers');
    if (this.directUnknown) {
      noServers?.setValue(this.headCount * 0.1);
      noServers?.disable();
    } else {
      noServers?.enable();
    }
  }
}
