import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

  // Protect against style interference by the hosting page
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TechCarbonEstimatorComponent implements OnInit {
  @Input() public extraHeight?: string;
  @Input({ alias: 'assets-base-path' }) public assetsBasePath?: string;

  public formValue: EstimatorValues | undefined;
  public carbonEstimation: CarbonEstimation | null = null;

  @ViewChild('estimations') estimations!: ElementRef;

  constructor(
    private estimationService: CarbonEstimationService,
    private changeDetector: ChangeDetectorRef,
    private ref: ElementRef
  ) {}

  ngOnInit() {
    this.insertShadowStylesLink();
  }

  private insertShadowStylesLink() {
    // Reasons for this approach:
    // 1. Angular global injection would insert the tag in the page root, so we disabled it.
    // 2. Component `styleUrl` wouldn't allow us to vary stylesheets based on build configurations.

    let stylesLink = this.createShadowStylesLink('styles.css');
    let googleFontsLink = this.createShadowStylesLink('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');

    this.ref.nativeElement.shadowRoot.appendChild(googleFontsLink);
    this.ref.nativeElement.shadowRoot.appendChild(stylesLink);
  }

  private createShadowStylesLink(styleHref: string) {

    const isAbsoluteUrl = styleHref.startsWith('http://') || styleHref.startsWith('https://');
    const basePath = this.assetsBasePath && !isAbsoluteUrl ? this.assetsBasePath.replace(/\/?$/, '/')  : '';

    const stylesPath = `${basePath}${styleHref}`;

    let stylesLink = document.createElement('link');
    stylesLink.rel = 'stylesheet';
    stylesLink.type = 'text/css';
    stylesLink.href = stylesPath;
    return stylesLink;
  }

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
