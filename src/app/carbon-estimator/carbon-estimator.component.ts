import { Component, ElementRef, ViewChild } from '@angular/core';
import { CarbonEstimatorFormComponent } from '../carbon-estimator-form/carbon-estimator-form.component';
import { CarbonEstimationComponent } from '../carbon-estimation/carbon-estimation.component';
import { CarbonEstimation, EstimatorValues } from '../carbon-estimator';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssumptionsAndLimitationComponent } from '../assumptions-and-limitation/assumptions-and-limitation.component';

@Component({
  selector: 'sl-carbon-estimator',
  standalone: true,
  imports: [
    CarbonEstimatorFormComponent,
    CarbonEstimationComponent,
    FormsModule,
    CommonModule,
    AssumptionsAndLimitationComponent,
  ],
  templateUrl: './carbon-estimator.component.html',
})
export class CarbonEstimatorComponent {
  public showEstimation = false;
  public showAssumptionsAndLimitationView = false;
  public formValue: EstimatorValues | undefined;
  public carbonEstimation: CarbonEstimation = {} as CarbonEstimation;

  @ViewChild('content') content!: ElementRef;

  constructor(private estimationService: CarbonEstimationService) {}

  public handleFormSubmit(formValue: EstimatorValues) {
    this.formValue = formValue;
    this.carbonEstimation = this.estimationService.calculateCarbonEstimation(this.formValue);
    this.showEstimation = true;
  }

  public showAssumptionsAndLimitation(): void {
    this.showAssumptionsAndLimitationView = true;
    this.content.nativeElement.scrollIntoView({ behavior: 'instant' });
  }

  public closeAssumptionsAndLimitation(): void {
    this.showAssumptionsAndLimitationView = false;
    this.content.nativeElement.scrollIntoView({ behavior: 'instant' });
  }
}
