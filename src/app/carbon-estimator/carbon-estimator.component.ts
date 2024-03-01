import { Component } from '@angular/core';
import { CarbonEstimatorFormComponent, EstimatorValues } from '../carbon-estimator-form/carbon-estimator-form.component';
import { CarbonEstimationComponent } from '../carbon-estimation/carbon-estimation.component';

export type CarbonEstimation = {
  upstreamEmmisions?: number;
  cloudEmmisions?: number;
  directEmmisions?: number;
  downstreamEmmisions?: number;
}

@Component({
  selector: 'sl-carbon-estimator',
  standalone: true,
  imports: [CarbonEstimatorFormComponent, CarbonEstimationComponent],
  templateUrl: './carbon-estimator.component.html',
})
export class CarbonEstimatorComponent {

  public view: 'form' | 'calculation' = 'form';
  public formValue: EstimatorValues | undefined;
  public carbonEstimation: CarbonEstimation = {} as CarbonEstimation;


  public handleFormSubmit(formValue: EstimatorValues) {
    this.formValue = formValue;
    this.carbonEstimation = this.calculateCarbonEstimation(this.formValue);
    this.view = 'calculation';
  }

  public handleBack() {
    this.view = 'form';
  }


  private calculateCarbonEstimation(formValue: EstimatorValues): CarbonEstimation {
    return {
      upstreamEmmisions: formValue.upstream ? Math.random() : undefined,
      cloudEmmisions: formValue.cloud ? Math.random() : undefined,
      directEmmisions: formValue.onPrem ? Math.random() : undefined,
      downstreamEmmisions: formValue.downstream ? Math.random() : undefined,
    }
  }

}
