import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Cloud,
  Downstream,
  EstimatorFormValues,
  EstimatorValues,
  FormSection,
  OnPrem,
  Upstream,
} from '../carbon-estimator';
import { defaultValues } from './constants';

@Component({
  selector: 'sl-carbon-estimator-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, FormsModule],
  templateUrl: './carbon-estimator-form.component.html',
})
export class CarbonEstimatorFormComponent implements OnInit {
  public formValue = input<EstimatorValues>();

  @Output() public formSubmit: EventEmitter<EstimatorValues> = new EventEmitter<EstimatorValues>();

  public estimatorForm!: FormGroup<EstimatorFormValues>;
  public upstreamSwitch: boolean = true;
  public onPremSwitch: boolean = true;
  public cloudSwitch: boolean = true;
  public downstreamSwitch: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.estimatorForm = this.formBuilder.nonNullable.group({
      upstream: this.formBuilder.nonNullable.group({
        enabled: [true],
        headCount: [defaultValues.upstream.headCount, Validators.required],
        desktopToLaptopPercentage: [defaultValues.upstream.desktopToLaptopPercentage],
      }),
      onPrem: this.formBuilder.nonNullable.group({
        enabled: [true],
        location: [defaultValues.onPrem.location],
        numberOfServers: [defaultValues.onPrem.numberOfServers],
      }),
      cloud: this.formBuilder.nonNullable.group({
        enabled: [true],
        location: [defaultValues.cloud.location],
        cloudPercentage: [defaultValues.cloud.cloudPercentage],
        monthlyCloudBill: [defaultValues.cloud.monthlyCloudBill],
      }),
      downstream: this.formBuilder.nonNullable.group({
        enabled: [true],
        customerLocation: [defaultValues.downstream.customerLocation],
        monthlyActiveUsers: [defaultValues.downstream.monthlyActiveUsers],
        mobilePercentage: [defaultValues.downstream.mobilePercentage],
        purposeOfSite: [defaultValues.downstream.purposeOfSite],
      }),
    });

    if (this.formValue() !== undefined) {
      const formValue = this.formValue();
      this.estimatorForm.setValue({
        upstream: this.setFormSection(defaultValues.upstream, formValue?.upstream),
        onPrem: this.setFormSection(defaultValues.onPrem, formValue?.onPrem),
        cloud: this.setFormSection(defaultValues.cloud, formValue?.cloud),
        downstream: this.setFormSection(defaultValues.downstream, formValue?.downstream),
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
    this.estimatorForm.reset();
  }

  private setSection<T>({ enabled, ...section }: FormSection<T>): T | undefined {
    return enabled ? (section as T) : undefined;
  }

  private setFormSection<T>(defaultValue: T, section?: T): FormSection<T> {
    return {
      ...(section ?? defaultValue),
      enabled: true,
    };
  }
}
