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
import { CarbonEstimatorFormComponent } from '../components/carbon-estimator-form/carbon-estimator-form.component';
import { CarbonEstimationComponent } from '../components/carbon-estimation/carbon-estimation.component';
import { CarbonEstimation, EstimatorValues } from '../types/carbon-estimator';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DisclaimerComponent } from '../components/disclaimer/disclaimer.component';
import { TabsComponent } from '../components/tab/tabs/tabs.component';
import { TabItemComponent } from '../components/tab/tab-item/tab-item.component';
import { AssumptionsAndLimitationComponent } from '../components/assumptions-and-limitation/assumptions-and-limitation.component';
import { CarbonEstimationTreemapComponent } from '../components/carbon-estimation-treemap/carbon-estimation-treemap.component';
import { CarbonEstimationTableComponent } from '../components/carbon-estimation-table/carbon-estimation-table.component';
import { InputGroupDisplay } from '../components/input-group-display/input-group-display.component';
import { DisclaimerTextComponent } from '../components/disclaimer-text/disclaimer-text.component';

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
    CarbonEstimationTreemapComponent,
    CarbonEstimationTableComponent,
    InputGroupDisplay,
    DisclaimerTextComponent,
  ],
  templateUrl: './tech-carbon-estimator.component.html',
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

  @ViewChild('printPageOne') printPageOne!: ElementRef;
  @ViewChild('printPageTwo') printPageTwo!: ElementRef;

  public reportName = 'Carbon Estimation Report';

  public handlePdfExport(_event: { estimation: CarbonEstimation; inputValues: EstimatorValues | undefined }) {
    const date = new Date();
    this.reportName = `Carbon Estimation Report - ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    this.changeDetector.detectChanges();

    setTimeout(() => {
      this.executePrint();
    }, 100);
  }

  private executePrint() {
    if (!this.printPageOne || !this.printPageTwo) return;

    const page1Html = this.printPageOne.nativeElement.innerHTML;
    const page2Html = this.printPageTwo.nativeElement.innerHTML;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    let stylesHtml = '';
    const shadowRoot = this.ref.nativeElement.shadowRoot;

    shadowRoot.querySelectorAll('style, link[rel="stylesheet"]').forEach((node: { outerHTML: string }) => {
      stylesHtml += node.outerHTML;
    });

    stylesHtml += `
      <style>
        @media print {
          @page { size: A4; margin: 10mm; }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            font-family: ui-sans-serif, system-ui, sans-serif;
          }
          .page-break { page-break-before: always; }
          svg, canvas { max-width: 100% !important; height: auto !important; }
        }
      </style>
    `;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${this.reportName}</title>
          ${stylesHtml}
        </head>
        <body>
          <div class="tce-print-page">
            ${page1Html}
          </div>
          <div class="page-break"></div>
          <div class="tce-print-page">
            ${page2Html}
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }, 500);
  }

  ngOnInit() {
    this.insertShadowStylesLink();
  }

  private insertShadowStylesLink() {
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
