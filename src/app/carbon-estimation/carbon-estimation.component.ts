import { Component, OnInit, input } from '@angular/core';
import { CarbonEstimation } from '../carbon-estimator';

@Component({
  selector: 'sl-carbon-estimation',
  standalone: true,
  imports: [],
  templateUrl: './carbon-estimation.component.html',
})
export class CarbonEstimationComponent implements OnInit {
  public carbonEstimation = input.required<CarbonEstimation>();

  public upstreamEmissionsHeight: number = 0;
  public cloudEmissionsHeight: number = 0;
  public directEmissionsHeight: number = 0;
  public downstreamEmissionsHeight: number = 0;

  constructor() {}

  ngOnInit() {
    const carbonEstimation = this.carbonEstimation();
    const total =
      (carbonEstimation.upstreamEmissions ?? 0) +
      (carbonEstimation.cloudEmissions ?? 0) +
      (carbonEstimation.directEmissions ?? 0) +
      (carbonEstimation.downstreamEmissions ?? 0);
    this.upstreamEmissionsHeight =
      carbonEstimation.upstreamEmissions ? (carbonEstimation.upstreamEmissions / total) * 400 : 0;
    this.cloudEmissionsHeight = carbonEstimation.cloudEmissions ? (carbonEstimation.cloudEmissions / total) * 400 : 0;
    this.directEmissionsHeight =
      carbonEstimation.directEmissions ? (carbonEstimation.directEmissions / total) * 400 : 0;
    this.downstreamEmissionsHeight =
      carbonEstimation.downstreamEmissions ? (carbonEstimation.downstreamEmissions / total) * 400 : 0;
  }
}
