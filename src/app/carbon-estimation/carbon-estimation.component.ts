import { Component, OnInit, input } from '@angular/core';
import { CarbonEstimation } from '../carbon-estimator';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'sl-carbon-estimation',
  standalone: true,
  imports: [DecimalPipe],
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
    this.upstreamEmissionsHeight = carbonEstimation.upstreamEmissions * 4;
    this.cloudEmissionsHeight = carbonEstimation.cloudEmissions * 4;
    this.directEmissionsHeight = carbonEstimation.directEmissions * 4;
    this.downstreamEmissionsHeight = carbonEstimation.downstreamEmissions * 4;
  }
}
