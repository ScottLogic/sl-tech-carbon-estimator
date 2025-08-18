import jsPDF from "jspdf";
import { TableItem } from "../carbon-estimation-table/carbon-estimation-table.component";

export default class PdfConstructionService {
  constructor() {}
  public generatePDF = (chartCanvas: HTMLCanvasElement, tableData: TableItem[]):void => {
    console.log('in service');
    const imgWidth = 208;
    const imgheight = (chartCanvas.height * imgWidth) / chartCanvas.width;
    const chartContentDataURL = chartCanvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const position = 0;

    pdf.addImage(chartContentDataURL, 'PNG', position, position, imgWidth, imgheight);

    pdf.save('carbon-estimation.pdf');
  }

}