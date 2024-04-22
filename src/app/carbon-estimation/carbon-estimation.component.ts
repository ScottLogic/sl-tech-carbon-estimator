import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  effect,
  input,
} from '@angular/core';
import { CarbonEstimation, ChartOptions } from '../types/carbon-estimator';
import { NumberObject, sumValues } from '../utils/number-object';
import { ApexAxisChartSeries, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

import { startCase } from 'lodash-es';
import { EmissionsColours, chartOptions, estimatorHeights, tooltipFormatter } from './carbon-estimation.constants';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';

type ApexChartDataItem = { x: string; y: number };

@Component({
  selector: 'carbon-estimation',
  standalone: true,
  imports: [NgApexchartsModule, ExpansionPanelComponent],
  templateUrl: './carbon-estimation.component.html',
  styleUrls: ['./carbon-estimation.component.css'],
})
export class CarbonEstimationComponent implements OnInit {
  public carbonEstimation = input.required<CarbonEstimation>();
  public extraHeight = input<string>();

  public emissions: ApexAxisChartSeries = [];
  public emissionAriaLabel = 'Estimations of emissions.';

  public chartOptions: ChartOptions = chartOptions;
  private tooltipFormatter = tooltipFormatter;
  private estimatorBaseHeight = sumValues(estimatorHeights);

  @ViewChild('chart') chart: ChartComponent | undefined;
  @ViewChild('detailsPanel', { static: true, read: ElementRef }) detailsPanel!: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    effect(() => {
      this.emissions = this.getOverallEmissionPercentages(this.carbonEstimation());
      this.emissionAriaLabel = this.getAriaLabel(this.carbonEstimation());
    });
  }

  public ngOnInit(): void {
    const chartHeight = this.getChartHeight(window.innerHeight, window.innerWidth);
    if (chartHeight > 0) {
      this.chartOptions.chart.height = chartHeight;
    }
  }

  public onExpanded(): void {
    this.changeDetectorRef.detectChanges();
    this.onResize(window.innerHeight, window.innerWidth);
  }

  @HostListener('window:resize', ['$event.target.innerHeight', '$event.target.innerWidth'])
  onResize(innerHeight: number, innerWidth: number): void {
    const chartHeight = this.getChartHeight(innerHeight, innerWidth);
    if (chartHeight > 0) {
      this.chart?.updateOptions({ chart: { height: chartHeight } });
    }
  }

  private getOverallEmissionPercentages(carbonEstimation: CarbonEstimation): ApexAxisChartSeries {
    return [
      {
        name: `Upstream Emissions - ${this.getOverallPercentageLabel(carbonEstimation.upstreamEmissions)}`,
        color: EmissionsColours.Upstream,
        data: this.getEmissionPercentages(carbonEstimation.upstreamEmissions, this.getUpstreamLabel),
      },
      {
        name: `Direct Emissions - ${this.getOverallPercentageLabel(carbonEstimation.directEmissions)}`,
        color: EmissionsColours.Direct,
        data: this.getEmissionPercentages(carbonEstimation.directEmissions, this.getDirectLabel),
      },
      {
        name: `Indirect Emissions - ${this.getOverallPercentageLabel(carbonEstimation.indirectEmissions)}`,
        color: EmissionsColours.Indirect,
        data: this.getEmissionPercentages(carbonEstimation.indirectEmissions, this.getIndirectLabel),
      },
      {
        name: `Downstream Emissions - ${this.getOverallPercentageLabel(carbonEstimation.downstreamEmissions)}`,
        color: EmissionsColours.Downstream,
        data: this.getEmissionPercentages(carbonEstimation.downstreamEmissions, this.getDownstreamLabel),
      },
    ].filter(entry => entry.data.length !== 0);
  }

  private getAriaLabel(carbonEstimation: CarbonEstimation): string {
    return `Estimation of emissions. ${this.getAriaLabelForCategory('Upstream', carbonEstimation.upstreamEmissions, this.getUpstreamLabel)}
    ${this.getAriaLabelForCategory('Direct', carbonEstimation.directEmissions, this.getDirectLabel)}
    ${this.getAriaLabelForCategory('Indirect', carbonEstimation.indirectEmissions, this.getIndirectLabel)}
    ${this.getAriaLabelForCategory('Downstream', carbonEstimation.downstreamEmissions, this.getDownstreamLabel)}`;
  }

  private getAriaLabelForCategory(
    category: string,
    emissions: NumberObject,
    labelFunction: (key: string) => string
  ): string {
    return `${category} emissions are ${this.getOverallPercentageLabel(emissions)}${this.getEmissionMadeUp(this.getEmissionPercentages(emissions, labelFunction))}`;
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

  private getEmissionPercentages(emissions: NumberObject, labelFunction: (key: string) => string): ApexChartDataItem[] {
    return (
      Object.entries(emissions)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_key, value]) => value !== 0)
        .map(([key, value]) => ({ x: labelFunction(key), y: value }))
    );
  }

  private getUpstreamLabel(key: string): string {
    switch (key) {
      case 'software':
        return 'Software';
      case 'user':
        return 'User';
      case 'network':
        return 'Network Hardware';
      case 'server':
        return 'Server Hardware';
      default:
        return startCase(key);
    }
  }

  private getDirectLabel(key: string): string {
    switch (key) {
      case 'user':
        return 'Employee Devices';
      case 'network':
        return 'Network Devices';
      case 'server':
        return 'Servers and Storage';
      default:
        return startCase(key);
    }
  }

  private getIndirectLabel(key: string): string {
    switch (key) {
      case 'cloud':
        return 'Cloud Services';
      case 'saas':
        return 'SaaS';
      case 'managed':
        return 'Managed Services';
      default:
        return startCase(key);
    }
  }

  private getDownstreamLabel(key: string): string {
    switch (key) {
      case 'endUser':
        return 'End User Devices';
      case 'network':
        return 'Network Data Transfer';
      default:
        return startCase(key);
    }
  }

  private getChartHeight(innerHeight: number, innerWidth: number): number {
    const expansionPanelHeight = this.detailsPanel.nativeElement.clientHeight;

    // medium tailwind responsive design breakpoint https://tailwindcss.com/docs/responsive-design
    if (innerWidth < 768) {
      return innerHeight - this.estimatorBaseHeight - expansionPanelHeight + estimatorHeights.title;
    }

    const extraHeightString = this.extraHeight();
    const extraHeight = Number(extraHeightString) || 0;
    return innerHeight - this.estimatorBaseHeight - extraHeight - expansionPanelHeight;
  }
}
