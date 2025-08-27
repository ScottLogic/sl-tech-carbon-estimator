import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { CarbonEstimationTreemapComponent } from '../carbon-estimation-treemap/carbon-estimation-treemap.component';
import { CarbonEstimationTableComponent } from '../carbon-estimation-table/carbon-estimation-table.component';
import { CarbonEstimation, Cloud, Downstream, EstimatorValues, OnPremise, Upstream } from '../types/carbon-estimator';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { FormsModule } from '@angular/forms';
import { pairwise } from 'rxjs';
import { InputGroupDisplay } from '../input-group-display/input-group-display.component';

@Component({
  selector: 'export-modal',
  templateUrl: './export-modal.component.html',
  imports: [CarbonEstimationTreemapComponent, CarbonEstimationTableComponent, FormsModule, InputGroupDisplay],
})
export class ExportModal {
  @Output() close = new EventEmitter<void>();

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
	  this.close.emit();
  }

  public async exportToPDF() {
    const page1 = document.getElementById('tceExportPageOne');
    const page1Canvas = await html2canvas(page1!);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 208;
    const imgHeight = (page1Canvas.height * imgWidth) / page1Canvas.width;
    const chartContentDataURL = page1Canvas.toDataURL('image/png');
    pdf.addImage(chartContentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.addPage();
    const page2 = document.getElementById('tceExportPageTwo');
    const page2Canvas = await html2canvas(page2!);
    const imgHeight2 = (page2Canvas.height * imgWidth) / page2Canvas.width;
    const inputGroupsURL = page2Canvas.toDataURL('image/png');
    pdf.addImage(inputGroupsURL, 'PNG', 0, 0, imgWidth, imgHeight2);
    pdf.save(`${this.reportName}.pdf`);
  }

  
}

// now have 2 pages, need to screen grab separetly and add to pdf one by one