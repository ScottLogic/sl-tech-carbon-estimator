import { ChangeDetectorRef, Component, computed, effect, ElementRef, input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';
import { TabsComponent } from '../tab/tabs/tabs.component';
import { TabItemComponent } from '../tab/tab-item/tab-item.component';
import { CarbonEstimationTreemapComponent } from '../carbon-estimation-treemap/carbon-estimation-treemap.component';
import { CarbonEstimation, CarbonEstimationPercentages, CarbonEstimationValues, DirectEstimation, DownstreamEstimation, EstimatorValues, IndirectEstimation, jsonExport, UpstreamEstimation } from '../types/carbon-estimator';
import { sumValues } from '../utils/number-object';
import { estimatorHeights } from './carbon-estimation.constants';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { CarbonEstimationTableComponent } from '../carbon-estimation-table/carbon-estimation-table.component';
import { ExternalLinkDirective } from '../directives/external-link.directive';
import { ExportModal } from '../export-modal/export-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'carbon-estimation',
  standalone: true,
  imports: [
    CommonModule,
    ExpansionPanelComponent,
    TabsComponent,
    TabItemComponent,
    CarbonEstimationTreemapComponent,
    CarbonEstimationTableComponent,
    ExternalLinkDirective,
    ExportModal,
  ],
  templateUrl: './carbon-estimation.component.html',
  styleUrls: ['./carbon-estimation.component.css'],
})
export class CarbonEstimationComponent implements OnInit, OnDestroy {
  public carbonEstimation = input<CarbonEstimation>();
  public extraHeight = input<string>();
  public inputValues = input<EstimatorValues | undefined>();

  public diagramActive = signal(true);

  public monthlyCarbonEstimation = computed(() => this.getMonthlyEstimate());

  @ViewChild('detailsPanel', { static: true, read: ElementRef }) detailsPanel!: ElementRef;

  public chartHeight!: number;

  private estimatorBaseHeight = sumValues(estimatorHeights);
  private resizeSubscription!: Subscription;
  private hasResized = true;
  private hasEstimationUpdated = false;

  public isAnnual = signal(true);
  public estimate = computed(() => this.isAnnual() ? this.carbonEstimation() : this.monthlyCarbonEstimation());

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    effect(() => {
      this.carbonEstimation();
      this.hasEstimationUpdated = true;
    });
  }

  public isModalVisible = false;

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
    const exportObject = this.estimate();
    return this.getJSONExportUrl(exportObject);
  }

  get carbonEstimationWithInputDownloadUrl(): string {
    const exportObject = {estimate: this.estimate(), input: this.inputValues()};
    return this.getJSONExportUrl(exportObject);
  }

  private getJSONExportUrl(exportObject: CarbonEstimation|jsonExport|undefined): string {
    if (typeof exportObject === 'undefined') {
      return '';
    }

    const estimateJson = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([estimateJson], { type: 'application/json' });
    const carbonEstimationJSONUrl = URL.createObjectURL(blob);
    return carbonEstimationJSONUrl;
  }

  public showModal() {
    this.isModalVisible = true;
  }

  public hideModal() {
	  this.isModalVisible = false;
  }

  public isExportMenuOpen = false;

  public toggleExportMenu() {
    this.isExportMenuOpen = !this.isExportMenuOpen;
  }

  public handlePDFClick() {
    this.toggleExportMenu();
    this.showModal();
  }

  private getMonthlyEstimate(): CarbonEstimation | undefined {
    // for our purposes monthly estimate is just the annual divided equally
    // beteween 12 months

    const copy = JSON.parse(JSON.stringify(this.carbonEstimation()));

    copy.values.totalEmissions = copy.values.totalEmissions/12;

    // loop over values only - percentages are the same regardless of time period
    for ( const estimateKey of Object.keys(copy.values)) {

      if (estimateKey === 'version' || estimateKey === 'totalEstimate') continue;

      const estimate = copy.values[estimateKey];

      for (const valueKey of Object.keys(estimate)) {
        const value = estimate[valueKey];

        copy.values[estimateKey][valueKey] = value/12;
      }
    }

    return copy;

  }
}
