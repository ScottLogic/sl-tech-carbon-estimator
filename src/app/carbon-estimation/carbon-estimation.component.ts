import { ChangeDetectorRef, Component, effect, ElementRef, input, OnDestroy, OnInit, viewChild, ViewChild } from '@angular/core';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';
import { TabsComponent } from '../tab/tabs/tabs.component';
import { TabItemComponent } from '../tab/tab-item/tab-item.component';
import { CarbonEstimationTreemapComponent } from '../carbon-estimation-treemap/carbon-estimation-treemap.component';
import { CarbonEstimation } from '../types/carbon-estimator';
import { sumValues } from '../utils/number-object';
import { estimatorHeights } from './carbon-estimation.constants';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { CarbonEstimationTableComponent } from '../carbon-estimation-table/carbon-estimation-table.component';
import { ExternalLinkDirective } from '../directives/external-link.directive';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'carbon-estimation',
  standalone: true,
  imports: [
    ExpansionPanelComponent,
    TabsComponent,
    TabItemComponent,
    CarbonEstimationTreemapComponent,
    CarbonEstimationTableComponent,
    ExternalLinkDirective,
  ],
  templateUrl: './carbon-estimation.component.html',
  styleUrls: ['./carbon-estimation.component.css'],
})
export class CarbonEstimationComponent implements OnInit, OnDestroy {
  public carbonEstimation = input<CarbonEstimation>();
  public extraHeight = input<string>();

  @ViewChild('detailsPanel', { static: true, read: ElementRef }) detailsPanel!: ElementRef;
  @ViewChild('treemap', { static: true }) treemap!: CarbonEstimationTreemapComponent;

  public chartHeight!: number;

  private estimatorBaseHeight = sumValues(estimatorHeights);
  private resizeSubscription!: Subscription;
  private hasResized = true;
  private hasEstimationUpdated = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    effect(() => {
      this.carbonEstimation();
      this.hasEstimationUpdated = true;
    });
  }

  public ngOnInit(): void {
    this.chartHeight = this.getChartHeight(window.innerHeight, window.innerWidth, window.screen.height);

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .subscribe(() => this.onResize(window.innerHeight, window.innerWidth, window.screen.height));
  }

  public ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  public onResize(innerHeight: number, innerWidth: number, screenHeight: number): void {
    this.hasResized = true;
    this.chartHeight = this.getChartHeight(innerHeight, innerWidth, screenHeight);
  }

  public onExpanded(): void {
    this.changeDetectorRef.detectChanges();
    this.onResize(window.innerHeight, window.innerWidth, window.screen.height);
  }

  public treemapSelected(): void {
    if (this.hasResized || this.hasEstimationUpdated) {
      this.hasResized = false;
      this.hasEstimationUpdated = false;
      this.changeDetectorRef.detectChanges();
      this.treemap.readyChart()?.updateOptions({});
    }
  }

  private getChartHeight(innerHeight: number, innerWidth: number, screenHeight: number): number {
    const expansionPanelHeight = this.detailsPanel.nativeElement.clientHeight;

    // large tailwind responsive design breakpoint https://tailwindcss.com/docs/responsive-design
    const responsiveBreakpoint = 1024;

    const extraHeightString = this.extraHeight();
    const extraHeight = Number(extraHeightString) || 0;

    const calculatedHeight =
      innerWidth < responsiveBreakpoint ?
        innerHeight - this.estimatorBaseHeight - expansionPanelHeight + estimatorHeights.title
      : innerHeight - this.estimatorBaseHeight - extraHeight - expansionPanelHeight;

    // Bound smallest chart height to prevent it becoming squashed when zooming
    // on desktop (zooming decreases innerHeight on most desktop browsers)
    const minChartHeight = 300;

    // Cap chart height based on screen height to prevent issues with the chart
    // becoming stretched when the component is displayed in a tall iFrame
    const maxScreenHeightRatio = 0.75;

    const heightBoundedAbove = Math.min(calculatedHeight, screenHeight * maxScreenHeightRatio);
    const heightBoundedAboveAndBelow = Math.max(heightBoundedAbove, minChartHeight);

    return heightBoundedAboveAndBelow;
  }

  get carbonEstimationDownloadUrl(): string {
    const estimateJson = JSON.stringify(this.carbonEstimation(), null, 2);
    const blob = new Blob([estimateJson], { type: 'application/json' });
    const carbonEstimationJSONUrl = URL.createObjectURL(blob);
    return carbonEstimationJSONUrl;
  }

  @ViewChild(CarbonEstimationTreemapComponent) chart!: CarbonEstimationTreemapComponent;

  public async generatePDF() {
    console.log('Generating PDF...');
    const TreeCanvas = await this.chart.getTreeCanvas();
    const imgWidth = 208;
    const treeImgheight = (TreeCanvas.height * imgWidth) / TreeCanvas.width;
    const treeContentDataURL = TreeCanvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    const position = 0;
    pdf.addImage(treeContentDataURL, 'PNG', position, position, imgWidth, treeImgheight);
    pdf.save('carbon-estimation.pdf');
  }
}
