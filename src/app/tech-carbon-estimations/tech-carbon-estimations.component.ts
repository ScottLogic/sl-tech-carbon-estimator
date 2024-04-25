import { Component, Input, OnInit } from '@angular/core';
import { CarbonEstimation } from '../types/carbon-estimator';
import { CarbonEstimationComponent } from '../carbon-estimation/carbon-estimation.component';

@Component({
  selector: 'tech-carbon-estimations',
  standalone: true,
  imports: [CarbonEstimationComponent],
  templateUrl: './tech-carbon-estimations.component.html',
})
export class TechCarbonEstimationsComponent implements OnInit {
  @Input() public carbonEstimation!: string;

  public estimation!: CarbonEstimation;

  constructor() {}

  public ngOnInit(): void {
    this.estimation = JSON.parse(this.carbonEstimation);
  }
}
