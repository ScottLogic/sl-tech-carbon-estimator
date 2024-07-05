import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
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
export class TechCarbonEstimatorComponent {
  @Input() public extraHeight?: string;

  public showEstimation = false;
  public showAssumptionsAndLimitationView = false;
  public formValue: EstimatorValues | undefined;
  public carbonEstimation: CarbonEstimation = {} as CarbonEstimation;

  @ViewChild('assumptionsLimitation', { read: ElementRef }) assumptionsLimitation!: ElementRef;
  @ViewChild('estimations') estimations!: ElementRef;
  @ViewChild('showAssumptionsLimitationButton') showAssumptionsLimitationButton!: ElementRef<HTMLButtonElement>;

  constructor(
    private estimationService: CarbonEstimationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  public handleFormSubmit(formValue: EstimatorValues) {
    this.formValue = formValue;
    this.carbonEstimation = this.estimationService.calculateCarbonEstimation(this.formValue);
    this.showEstimation = true;
    this.changeDetector.detectChanges();
    this.estimations.nativeElement.scrollIntoView();
  }

  public handleFormReset() {
    this.showEstimation = false;
  }

  public showAssumptionsAndLimitation(): void {
    this.showAssumptionsAndLimitationView = true;
  }

  public closeAssumptionsAndLimitation(hasFocus: boolean): void {
    this.showAssumptionsAndLimitationView = false;
    this.changeDetector.detectChanges();
    const openButton = this.showAssumptionsLimitationButton.nativeElement;
    if (hasFocus) {
      openButton.focus();
    }
  }
}
