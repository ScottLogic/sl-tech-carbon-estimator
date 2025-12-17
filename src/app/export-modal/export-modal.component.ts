import { Component, computed, ElementRef, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { CarbonEstimationTreemapComponent } from '../carbon-estimation-treemap/carbon-estimation-treemap.component';
import { CarbonEstimationTableComponent } from '../carbon-estimation-table/carbon-estimation-table.component';
import { CarbonEstimation, EstimatorValues } from '../types/carbon-estimator';
import { FormsModule } from '@angular/forms';
import { InputGroupDisplay } from '../input-group-display/input-group-display.component';
import { DisclaimerTextComponent } from '../disclaimer-text/disclaimer-text.component';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'export-modal',
  templateUrl: './export-modal.component.html',
  imports: [
    CarbonEstimationTreemapComponent,
    CarbonEstimationTableComponent,
    FormsModule,
    InputGroupDisplay,
    DisclaimerTextComponent,
    A11yModule,
  ],
})
export class ExportModal {
  @Output() closePreview = new EventEmitter<void>();
  @ViewChild('pageOne', { static: false }) pageOne!: ElementRef;
  @ViewChild('pageTwo', { static: false }) pageTwo!: ElementRef;

  public carbonEstimation = input<CarbonEstimation>();
  public chartHeight = 734;
  public inputValues = input.required<EstimatorValues | undefined>();

  public upstream = computed(() => this.inputValues()?.upstream ?? {});
  public onPremise = computed(() => this.inputValues()?.onPremise ?? {});
  public downstream = computed(() => this.inputValues()?.downstream ?? {});
  public cloud = computed(() => this.inputValues()?.cloud ?? {});

  private dateMills = Date.now();
  private date = new Date(this.dateMills);
  private placeHolder = `Carbon Estimation Report - ${this.date.getDate()}-${this.date.getMonth() + 1}-${this.date.getFullYear()}`;

  public reportName = this.placeHolder;

  closeModal(): void {
    this.closePreview.emit();
  }

  public async exportToPDF() {
    const { jsPDF } = await import('jspdf');
    const html2canvasModule = await import('html2canvas-pro');
    const html2canvas = html2canvasModule.default;

    const page1 = this.pageOne?.nativeElement;
    const page2 = this.pageTwo?.nativeElement;

    if (!page1) {
      console.error('Page 1 element not found');
      return;
    }

    if (!page2) {
      console.error('Page 2 element not found');
      return;
    }

    const page1Canvas = await html2canvas(page1!);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 208;
    const imgHeight = (page1Canvas.height * imgWidth) / page1Canvas.width;
    const page1URL = page1Canvas.toDataURL('image/png');

    pdf.addImage(page1URL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.addPage();

    const page2Canvas = await html2canvas(page2!);
    const imgHeight2 = (page2Canvas.height * imgWidth) / page2Canvas.width;
    const page2URL = page2Canvas.toDataURL('image/png');

    pdf.addImage(page2URL, 'PNG', 0, 0, imgWidth, imgHeight2);
    pdf.save(`${this.reportName}.pdf`);
  }
}
