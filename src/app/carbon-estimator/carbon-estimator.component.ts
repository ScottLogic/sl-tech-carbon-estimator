import { Component } from '@angular/core';
import { CarbonEstimatorFormComponent } from '../carbon-estimator-form/carbon-estimator-form.component';
import { CarbonEstimationComponent } from '../carbon-estimation/carbon-estimation.component';
import { CarbonEstimation, EstimatorValues } from '../carbon-estimator';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sl-carbon-estimator',
  standalone: true,
  imports: [CarbonEstimatorFormComponent, CarbonEstimationComponent, FormsModule, CommonModule],
  templateUrl: './carbon-estimator.component.html',
})
export class CarbonEstimatorComponent {
  public showEstimation = false;
  public formValue: EstimatorValues | undefined;
  public carbonEstimation: CarbonEstimation = {} as CarbonEstimation;

  constructor(private estimationService: CarbonEstimationService) {}

  public handleFormSubmit(formValue: EstimatorValues) {
    this.formValue = formValue;
    this.carbonEstimation = this.estimationService.calculateCarbonEstimation(this.formValue);
    this.showEstimation = true;
  }
}
