import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CarbonEstimatorFormComponent } from '../carbon-estimator-form/carbon-estimator-form.component';
import { CarbonEstimationComponent } from '../carbon-estimation/carbon-estimation.component';
import { CarbonEstimation, EstimatorValues } from '../types/carbon-estimator';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DisclaimerComponent } from '../components/disclaimer/disclaimer.component';
import { TabsComponent } from '../components/tab/tabs/tabs.component';
import { TabItemComponent } from '../components/tab/tab-item/tab-item.component';
import { ExportModal } from '../components/export-modal/export-modal.component';
import { AssumptionsAndLimitationComponent } from '../components/assumptions-and-limitation/assumptions-and-limitation.component';

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
    ExportModal,
  ],
  templateUrl: './tech-carbon-estimator.component.html',

  // Protect against style interference by the hosting page
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TechCarbonEstimatorComponent implements OnInit {
  @HostBinding('style.position') position = 'relative';

  private estimationService = inject(CarbonEstimationService);
  private changeDetector = inject(ChangeDetectorRef);
  private ref = inject(ElementRef);

  @Input() public extraHeight?: string;
  @Input() public assetsBasePath?: string;

  public formValue: EstimatorValues | undefined;
  public carbonEstimation: CarbonEstimation | null = null;

  @ViewChild('estimations') estimations!: ElementRef;

  public isExportModalVisible = false;
  public modalCarbonEstimation: CarbonEstimation | null = null;
  public modalInputValues: EstimatorValues | undefined;

  public openExportModal(estimation: CarbonEstimation, inputValues: EstimatorValues | undefined) {
    this.modalCarbonEstimation = estimation;
    this.modalInputValues = inputValues;
    this.isExportModalVisible = true;
  }

  public closeExportModal() {
    this.isExportModalVisible = false;
  }

  ngOnInit() {
    this.insertShadowStylesLink();
  }

  private insertShadowStylesLink() {
    // Reasons for this approach:
    // 1. Angular global injection would insert the tag in the page root, so we disabled it.
    // 2. Component `styleUrl` wouldn't allow us to vary stylesheets based on build configurations.

    const stylesLink = this.createShadowStylesLink('styles.css');
    const googleFontsLink = this.createShadowStylesLink(
      'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined'
    );

    this.ref.nativeElement.shadowRoot.appendChild(googleFontsLink);
    this.ref.nativeElement.shadowRoot.appendChild(stylesLink);
  }

  private createShadowStylesLink(styleHref: string) {
    const isAbsoluteUrl = styleHref.startsWith('http://') || styleHref.startsWith('https://');
    const basePath = this.assetsBasePath && !isAbsoluteUrl ? this.assetsBasePath.replace(/\/?$/, '/') : '';

    const stylesPath = `${basePath}${styleHref}`;

    const stylesLink = document.createElement('link');
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
