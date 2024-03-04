import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cloud, Downstream, EstimatorFormValues, EstimatorValues, OnPrem, Upstream } from '../carbon-estimator';

@Component({
  selector: 'sl-carbon-estimator-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, FormsModule],
  templateUrl: './carbon-estimator-form.component.html',
})
export class CarbonEstimatorFormComponent implements OnInit {
  public formValue = input<EstimatorValues>();

  @Output() public formSubmit: EventEmitter<EstimatorValues> = new EventEmitter<EstimatorValues>();

  public estimatorForm!: FormGroup;
  public upstreamSwitch: boolean = true;
  public onPremSwitch: boolean = true;
  public cloudSwitch: boolean = true;
  public downstreamSwitch: boolean = true;

  private defaultValues: EstimatorFormValues = {
    upstream: {
      enabled: true,
      headCount: 100,
      desktopToLaptopPercentage: 50,
    },
    onPrem: {
      enabled: true,
      location: 'global',
      numberOfServers: NaN,
    },
    cloud: {
      enabled: true,
      location: 'global',
      cloudPercentage: 0,
      monthlyCloudBill: '0-200',
    },
    downstream: {
      enabled: true,
      customerLocation: 'global',
      monthlyActiveUsers: 100,
      mobilePercentage: 50,
      purposeOfSite: 'average',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.estimatorForm = this.formBuilder.nonNullable.group({
      upstream: this.formBuilder.nonNullable.group({
        enabled: [true],
        headCount: [100, Validators.required],
        desktopToLaptopPercentage: [50],
      }),
      onPrem: this.formBuilder.nonNullable.group({
        enabled: [true],
        location: ['global'],
        numberOfServers: [''],
      }),
      cloud: this.formBuilder.nonNullable.group({
        enabled: [true],
        location: ['global'],
        cloudPercentage: [50],
        monthlyCloudBill: ['0-200'],
      }),
      downstream: this.formBuilder.nonNullable.group({
        enabled: [true],
        customerLocation: ['global'],
        monthlyActiveUsers: [100],
        mobilePercentage: [50],
        purposeOfSite: ['streaming'],
      }),
    });
    if (this.formValue() !== undefined) {
      const formValue = this.formValue();
      this.estimatorForm.setValue({
        upstream: this.setFormSection(this.defaultValues.upstream, formValue?.upstream),
        onPrem: this.setFormSection(this.defaultValues.onPrem, formValue?.onPrem),
        cloud: this.setFormSection(this.defaultValues.cloud, formValue?.cloud),
        downstream: this.setFormSection(this.defaultValues.downstream, formValue?.downstream),
      });
    }

    this.estimatorForm.get('upstream.enabled')?.valueChanges.subscribe(value => {
      this.upstreamSwitch = value;
      const headCount = this.estimatorForm.get('upstream.headCount');
      if (headCount) {
        headCount.setValidators(this.upstreamSwitch ? [Validators.required] : null);
        headCount.updateValueAndValidity();
      }
      this.changeDetector.detectChanges();
    });

    this.estimatorForm.get('onPrem.enabled')?.valueChanges.subscribe(value => {
      this.onPremSwitch = value;
      this.changeDetector.detectChanges();
    });

    this.estimatorForm.get('cloud.enabled')?.valueChanges.subscribe(value => {
      this.cloudSwitch = value;
      this.changeDetector.detectChanges();
    });

    this.estimatorForm.get('downstream.enabled')?.valueChanges.subscribe(value => {
      this.downstreamSwitch = value;
      this.changeDetector.detectChanges();
    });
  }

  public handleSubmit() {
    const formValue = this.estimatorForm.getRawValue();

    this.formSubmit.emit({
      upstream: this.setSection<Upstream>(formValue.upstream),
      onPrem: this.setSection<OnPrem>(formValue.onPrem),
      cloud: this.setSection<Cloud>(formValue.cloud),
      downstream: this.setSection<Downstream>(formValue.downstream),
    });

    this.formValue;
  }

  public resetForm() {
    this.estimatorForm.reset(this.defaultValues);
  }

  private setSection<T>({ enabled, ...section }: { enabled: boolean } & T): T | undefined {
    return enabled ? (section as T) : undefined;
  }

  private setFormSection<T>(defaultValue: T & { enabled: boolean }, section?: T): T & { enabled: boolean } {
    return section ? { enabled: true, ...section } : (defaultValue as T & { enabled: boolean });
  }
}
