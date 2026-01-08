import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CostRange, WorldLocation } from '../../../types/carbon-estimator';
import { costRanges } from '../../../components/carbon-estimator-form/carbon-estimator-form.constants';

export type Cloud = {
  noCloudServices: boolean;
  cloudLocation: WorldLocation;
  cloudPercentage: number;
  monthlyCloudBill: CostRange;
};

export type CloudFormGroup = FormGroup<{
  noCloudServices: FormControl<boolean>;
  cloudLocation: FormControl<WorldLocation | 'unknown'>;
  cloudPercentage: FormControl<number>;
  monthlyCloudBill: FormControl<CostRange>;
}>;

export const defaultCloudValues: Required<Cloud> = {
  noCloudServices: false,
  cloudLocation: 'WORLD',
  cloudPercentage: 50,
  monthlyCloudBill: costRanges[0],
};

@Injectable({
  providedIn: 'root',
})
export class CloudFormService {
  private formBuilder = inject(FormBuilder);

  form: CloudFormGroup = this.createCloudForm();

  createCloudForm(): CloudFormGroup {
    return this.formBuilder.nonNullable.group({
      noCloudServices: [false],
      cloudLocation: [defaultCloudValues.cloudLocation as WorldLocation | 'unknown'],
      cloudPercentage: [defaultCloudValues.cloudPercentage],
      monthlyCloudBill: [defaultCloudValues.monthlyCloudBill],
    });
  }
}
