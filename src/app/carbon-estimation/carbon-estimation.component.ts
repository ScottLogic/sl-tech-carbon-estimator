import { Component, input } from '@angular/core';
import { CarbonEstimation } from '../carbon-estimator/carbon-estimator.component';

@Component({
  selector: 'sl-carbon-estimation',
  standalone: true,
  imports: [],
  templateUrl: './carbon-estimation.component.html',
})
export class CarbonEstimationComponent {  
  public carbonEstimation = input.required<CarbonEstimation>();

  public upstreamEmmisionsHeight: number = 0;
  public cloudEmmisionsHeight: number = 0;
  public directEmmisionsHeight: number = 0;
  public downstreamEmmisionsHeight: number = 0;

  constructor() {}

  ngOnInit() {
    const carbonEstimation = this.carbonEstimation();
    const total = (carbonEstimation.upstreamEmmisions ?? 0) + (carbonEstimation.cloudEmmisions ?? 0) + (carbonEstimation.directEmmisions ?? 0) + (carbonEstimation.downstreamEmmisions ?? 0);
    this.upstreamEmmisionsHeight = carbonEstimation.upstreamEmmisions ? carbonEstimation.upstreamEmmisions / total * 400 : 0;
    this.cloudEmmisionsHeight = carbonEstimation.cloudEmmisions ? carbonEstimation.cloudEmmisions / total * 400 : 0 ;
    this.directEmmisionsHeight = carbonEstimation.directEmmisions ? carbonEstimation.directEmmisions / total * 400 : 0;
    this.downstreamEmmisionsHeight = carbonEstimation.downstreamEmmisions ? carbonEstimation.downstreamEmmisions / total * 400 : 0;
  }

}
