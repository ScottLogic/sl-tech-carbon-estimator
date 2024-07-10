import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, effect, input } from '@angular/core';
import { CarbonEstimation, ChartOptions } from '../types/carbon-estimator';
import { NumberObject, sumValues } from '../utils/number-object';
import { ApexAxisChartSeries, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

import { startCase } from 'lodash-es';
import {
  EmissionsColours,
  EmissionsLabels,
  SVG,
  getChartOptions,
  estimatorHeights,
  tooltipFormatter,
  placeholderData,
  ApexChartSeriesItem,
  ApexChartDataItem,
} from './carbon-estimation.constants';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';
import { Subscription, debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'carbon-estimation',
  standalone: true,
  imports: [NgApexchartsModule, ExpansionPanelComponent],
  templateUrl: './carbon-estimation.component.html',
  styleUrls: ['./carbon-estimation.component.css'],
})
export class CarbonEstimationComponent implements OnInit, OnDestroy {
  public carbonEstimation = input<CarbonEstimation>();
  public extraHeight = input<string>();

  public chartData: ApexAxisChartSeries = [];
  public emissionAriaLabel!: string;

  public chartOptions: ChartOptions;
  private tooltipFormatter = tooltipFormatter;
  private estimatorBaseHeight = sumValues(estimatorHeights);

  private resizeSubscription!: Subscription;

  @ViewChild('chart') chart: ChartComponent | undefined;
  @ViewChild('detailsPanel', { static: true, read: ElementRef }) detailsPanel!: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.chartOptions = getChartOptions(!this.carbonEstimation());
    effect(() => {
      const estimation = this.carbonEstimation();
      if (estimation) {
        this.chartData = this.getOverallEmissionPercentages(estimation);
        this.chartOptions = getChartOptions(false);
        this.emissionAriaLabel = this.getAriaLabel(this.chartData);
      } else {
        this.chartData = placeholderData;
        this.chartOptions = getChartOptions(true);
        this.emissionAriaLabel = 'Placeholder for estimator of emissions';
      }
    });
  }

  public ngOnInit(): void {
    const chartHeight = this.getChartHeight(window.innerHeight, window.innerWidth, window.screen.height);
    if (chartHeight > 0) {
      this.chartOptions.chart.height = chartHeight;
    }

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .subscribe(() => this.onResize(window.innerHeight, window.innerWidth, window.screen.height));
  }

  public ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  public onExpanded(): void {
    this.changeDetectorRef.detectChanges();
    this.onResize(window.innerHeight, window.innerWidth, window.screen.height);
  }

  onResize(innerHeight: number, innerWidth: number, screenHeight: number): void {
    const chartHeight = this.getChartHeight(innerHeight, innerWidth, screenHeight);
    this.chart?.updateOptions({ chart: { height: chartHeight } });
  }

  private getOverallEmissionPercentages(carbonEstimation: CarbonEstimation): ApexAxisChartSeries {
    return [
      {
        name: `${EmissionsLabels.Upstream} - ${this.getOverallPercentageLabel(carbonEstimation.upstreamEmissions)}`,
        color: EmissionsColours.Upstream,
        data: this.getEmissionPercentages(carbonEstimation.upstreamEmissions, EmissionsLabels.Upstream),
      },
      {
        name: `${EmissionsLabels.Direct} - ${this.getOverallPercentageLabel(carbonEstimation.directEmissions)}`,
        color: EmissionsColours.Direct,
        data: this.getEmissionPercentages(carbonEstimation.directEmissions, EmissionsLabels.Direct),
      },
      {
        name: `${EmissionsLabels.Indirect} - ${this.getOverallPercentageLabel(carbonEstimation.indirectEmissions)}`,
        color: EmissionsColours.Indirect,
        data: this.getEmissionPercentages(carbonEstimation.indirectEmissions, EmissionsLabels.Indirect),
      },
      {
        name: `${EmissionsLabels.Downstream} - ${this.getOverallPercentageLabel(carbonEstimation.downstreamEmissions)}`,
        color: EmissionsColours.Downstream,
        data: this.getEmissionPercentages(carbonEstimation.downstreamEmissions, EmissionsLabels.Downstream),
      },
    ].filter(entry => entry.data.length !== 0);
  }

  private getAriaLabel(emission: ApexAxisChartSeries): string {
    return `Estimation of emissions. ${emission.map(entry => this.getAriaLabelForCategory(entry as ApexChartSeriesItem)).join(' ')}`;
  }

  private getAriaLabelForCategory(series: ApexChartSeriesItem): string {
    const category = series.name.replace('-', 'are');
    return `${category}${this.getEmissionMadeUp(series.data)}`;
  }

  private getEmissionMadeUp(emission: ApexChartDataItem[]): string {
    if (emission.length === 0) {
      return '.';
    }
    return `, made up of ${emission.map(item => `${item.x} ${this.tooltipFormatter(item.y)}`).join(', ')}.`;
  }

  private getOverallPercentageLabel = (emissions: NumberObject): string => {
    const percentage = sumValues(emissions);
    return percentage < 1 ? '<1%' : Math.round(percentage) + '%';
  };

  private getEmissionPercentages(emissions: NumberObject, parent: string): ApexChartDataItem[] {
    return (
      Object.entries(emissions)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_key, value]) => value !== 0)
        .map(([_key, value]) => this.getDataItem(_key, value, parent))
    );
  }

  private getChartHeight(innerHeight: number, innerWidth: number, screenHeight: number): number {
    const expansionPanelHeight = this.detailsPanel.nativeElement.clientHeight;

    // medium tailwind responsive design breakpoint https://tailwindcss.com/docs/responsive-design
    const responsiveBreakpoint = 768;

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

  private getDataItem(key: string, value: number, parent: string): ApexChartDataItem {
    switch (key) {
      case 'software':
        return this.getDataItemObject('Software - Off the Shelf', value, SVG.WEB, parent);
      case 'saas':
        return this.getDataItemObject('SaaS', value, SVG.WEB, parent);
      case 'employee':
        return this.getDataItemObject(this.getEmployeeLabel(parent), value, SVG.DEVICES, parent);
      case 'endUser':
        return this.getDataItemObject('End-User Devices', value, SVG.DEVICES, parent);
      case 'network':
        return this.getDataItemObject(this.getNetworkLabel(parent), value, SVG.ROUTER, parent);
      case 'server':
        return this.getDataItemObject(this.getServerLabel(parent), value, SVG.STORAGE, parent);
      case 'managed':
        return this.getDataItemObject('Managed Services', value, SVG.STORAGE, parent);
      case 'cloud':
        return this.getDataItemObject('Cloud Services', value, SVG.CLOUD, parent);
      case 'networkTransfer':
        return this.getDataItemObject('Network Data Transfer', value, SVG.CELL_TOWER, parent);
      default:
        return this.getDataItemObject(startCase(key), value, '', parent);
    }
  }

  private getDataItemObject(x: string, y: number, svg: string, parent: string): ApexChartDataItem {
    return {
      x,
      y,
      meta: {
        svg,
        parent,
      },
    };
  }

  private getEmployeeLabel(key: string): string {
    switch (key) {
      case 'Upstream Emissions':
        return 'Employee Hardware';
      case 'Direct Emissions':
        return 'Employee Devices';
      default:
        return startCase(key);
    }
  }

  private getNetworkLabel(key: string): string {
    switch (key) {
      case 'Upstream Emissions':
        return 'Networking and Infrastructure Hardware';
      case 'Direct Emissions':
        return 'Networking and Infrastructure';
      default:
        return startCase(key);
    }
  }

  private getServerLabel(key: string): string {
    switch (key) {
      case 'Upstream Emissions':
        return 'Servers and Storage Hardware';
      case 'Direct Emissions':
        return 'Servers and Storage';
      default:
        return startCase(key);
    }
  }
}
