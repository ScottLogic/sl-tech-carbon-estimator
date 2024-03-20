import { Component, effect, input } from '@angular/core';
import { CarbonEstimation } from '../carbon-estimator';
import { DecimalPipe } from '@angular/common';
import { sumValues } from '../utils/number-object';

@Component({
  selector: 'sl-carbon-estimation',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './carbon-estimation.component.html',
})
export class CarbonEstimationComponent {
  public carbonEstimation = input.required<CarbonEstimation>();

  public upstreamEmissionsPercent: number = 0;
  public indirectEmissionsPercent: number = 0;
  public directEmissionsPercent: number = 0;
  public downstreamEmissionsPercent: number = 0;

  public upstreamEmissionsHeight: number = 0;
  public indirectEmissionsHeight: number = 0;
  public directEmissionsHeight: number = 0;
  public downstreamEmissionsHeight: number = 0;

  constructor() {
    effect(() => {
      const carbonEstimation = this.carbonEstimation();
      this.upstreamEmissionsPercent = sumValues(carbonEstimation.upstreamEmissions);
      this.indirectEmissionsPercent = sumValues(carbonEstimation.indirectEmissions);
      this.directEmissionsPercent = sumValues(carbonEstimation.directEmissions);
      this.downstreamEmissionsPercent = sumValues(carbonEstimation.downstreamEmissions);

      this.upstreamEmissionsHeight = this.upstreamEmissionsPercent * 4;
      this.indirectEmissionsHeight = this.indirectEmissionsPercent * 4;
      this.directEmissionsHeight = this.directEmissionsPercent * 4;
      this.downstreamEmissionsHeight = this.downstreamEmissionsPercent * 4;
    });
  }
}
