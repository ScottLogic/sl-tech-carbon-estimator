import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CarbonEstimatorFormComponent } from '../carbon-estimator-form/carbon-estimator-form.component';
import { CarbonEstimationComponent } from '../carbon-estimation/carbon-estimation.component';
import { CarbonEstimation, EstimatorValues } from '../types/carbon-estimator';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssumptionsAndLimitationComponent } from '../assumptions-and-limitation/assumptions-and-limitation.component';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';

@Component({
  selector: 'tech-carbon-estimator',
  standalone: true,
  imports: [
    CarbonEstimatorFormComponent,
    CarbonEstimationComponent,
    FormsModule,
    CommonModule,
    AssumptionsAndLimitationComponent,
    DisclaimerComponent,
  ],
  templateUrl: './tech-carbon-estimator.component.html',
})
export class TechCarbonEstimatorComponent implements OnInit {
  @Input() public extraHeight?: string;

  public showPlaceholderEstimation = true;
  public showAssumptionsAndLimitationView = false;
  public formValue: EstimatorValues | undefined;
  public carbonEstimation: CarbonEstimation = {} as CarbonEstimation;

  @ViewChild('assumptionsLimitation', { read: ElementRef }) assumptionsLimitation!: ElementRef;
  @ViewChild('estimations') estimations!: ElementRef;

  constructor(
    private estimationService: CarbonEstimationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carbonEstimation = this.estimationService.getPlaceholderCarbonEstimation();
  }

  public handleFormSubmit(formValue: EstimatorValues) {
    this.formValue = formValue;
    this.carbonEstimation = this.estimationService.calculateCarbonEstimation(this.formValue);
    this.showPlaceholderEstimation = false;
    this.changeDetector.detectChanges();
    this.estimations.nativeElement.scrollIntoView();
  }

  public handleFormReset() {
    this.showPlaceholderEstimation = true;
    this.carbonEstimation = this.estimationService.getPlaceholderCarbonEstimation();
  }

  public showAssumptionsAndLimitation(): void {
    this.showAssumptionsAndLimitationView = true;
    this.changeDetector.detectChanges();
    this.assumptionsLimitation.nativeElement.scrollIntoView();
  }

  public closeAssumptionsAndLimitation(hasFocus: boolean): void {
    this.showAssumptionsAndLimitationView = false;
    this.estimations.nativeElement.scrollIntoView();
    if (hasFocus) {
      this.changeDetector.detectChanges();
      this.estimations.nativeElement.querySelector('button#showAssumptionsAndLimitationButton')?.focus();
    }
  }
}
