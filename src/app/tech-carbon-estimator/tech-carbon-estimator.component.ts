import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CarbonEstimatorFormComponent } from '../carbon-estimator-form/carbon-estimator-form.component';
import { CarbonEstimationComponent } from '../carbon-estimation/carbon-estimation.component';
import { CarbonEstimation, EstimatorValues } from '../types/carbon-estimator';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssumptionsAndLimitationComponent } from '../assumptions-and-limitation/assumptions-and-limitation.component';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import { TabsComponent } from '../tab/tabs/tabs.component';
import { TabItemComponent } from '../tab/tab-item/tab-item.component';

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
    TabsComponent,
    TabItemComponent,
  ],
  templateUrl: './tech-carbon-estimator.component.html',
})
export class TechCarbonEstimatorComponent {
  @Input() public extraHeight?: string;

  public formValue: EstimatorValues | undefined;
  public carbonEstimation: CarbonEstimation | null = null;

  @ViewChild('estimations') estimations!: ElementRef;

  constructor(
    private estimationService: CarbonEstimationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  public handleFormSubmit(formValue: EstimatorValues) {
    this.formValue = formValue;
    this.carbonEstimation = this.estimationService.calculateCarbonEstimation(this.formValue);
    this.changeDetector.detectChanges();
    this.estimations.nativeElement.scrollIntoView();
  }

  public handleFormReset() {
    this.carbonEstimation = null;
  }
}
