import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { CarbonEstimationTreemapComponent } from '../carbon-estimation-treemap/carbon-estimation-treemap.component';
import { CarbonEstimationTableComponent } from '../carbon-estimation-table/carbon-estimation-table.component';
import { CarbonEstimation } from '../types/carbon-estimator';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'export-modal',
  templateUrl: './export-modal.component.html',
  imports: [CarbonEstimationTreemapComponent, CarbonEstimationTableComponent, FormsModule],
})
export class ExportModal {
  @Output() close = new EventEmitter<void>();

  public carbonEstimation = input<CarbonEstimation>();
  public chartHeight = input.required<number>();

  // public placeholderText = computed(() => {
  private dateMills = Date.now();
  private date = new Date(this.dateMills);
  private placeHolder = `Carbon Estimation Report - ${this.date.getDate()}-${this.date.getMonth() + 1}-${this.date.getFullYear()}`;

  public reportName = this.placeHolder;

  

  closeModal(): void {
	  this.close.emit();
  }

  public async exportToPDF() {
    const data = document.getElementById('exportMe');
    const canvas = await html2canvas(data!);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 208;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const chartContentDataURL = canvas.toDataURL('image/png');
    pdf.addImage(chartContentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('carbon-estimation.pdf');
  }

}