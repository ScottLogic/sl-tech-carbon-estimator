import { Component, HostListener, OnInit, ViewChild, effect, input } from '@angular/core';
import { CarbonEstimation, ChartOptions } from '../types/carbon-estimator';
import { NumberObject, sumValues } from '../utils/number-object';
import { ApexAxisChartSeries, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

import { startCase } from 'lodash-es';
import { EmissionsColours, chartOptions, estimatorBaseHeight, tooltipFormatter } from './carbon-estimation.constants';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';

type ApexChartDataItem = { x: string; y: number };

@Component({
  selector: 'sl-carbon-estimation',
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

  @ViewChild('chart') chart: ChartComponent | undefined;

  constructor() {
    effect(() => {
      this.emissions = this.getOverallEmissionPercentages(this.carbonEstimation());
      this.emissionAriaLabel = this.getAriaLabel(this.carbonEstimation());
    });
  }

  public ngOnInit(): void {
    const chartHeight = this.getChartHeight(window.innerHeight);
    if (chartHeight > 0) {
      this.chartOptions.chart.height = chartHeight;
    }
  }

  @HostListener('window:resize', ['$event.target.innerHeight'])
  onResize(innerHeight: number) {
    const chartHeight = this.getChartHeight(innerHeight);
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
    ];
  }

  private getAriaLabel(carbonEstimation: CarbonEstimation): string {
    return `Estimation of emissions. Upstream emissions are ${this.getOverallPercentageLabel(carbonEstimation.upstreamEmissions)}, made up of ${this.getEmissionMadeUp(this.emissions[0].data as ApexChartDataItem[])}.
    Direct emissions are ${this.getOverallPercentageLabel(carbonEstimation.directEmissions)}, made up of ${this.getEmissionMadeUp(this.emissions[1].data as ApexChartDataItem[])}.
    Indirect emissions are ${this.getOverallPercentageLabel(carbonEstimation.indirectEmissions)}, made up of ${this.getEmissionMadeUp(this.emissions[2].data as ApexChartDataItem[])}.
    Downstream emissions are ${this.getOverallPercentageLabel(carbonEstimation.downstreamEmissions)}, made up of ${this.getEmissionMadeUp(this.emissions[3].data as ApexChartDataItem[])}.`;
  }

  private getEmissionMadeUp(emission: ApexChartDataItem[]): string {
    return emission.map(item => `${item.x} ${this.tooltipFormatter(item.y)}`).join(', ');
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

  private getChartHeight(innerHeight: number): number {
    const extraHeightString = this.extraHeight();
    const extraHeight = Number(extraHeightString) || 0;
    return innerHeight - estimatorBaseHeight - extraHeight;
  }
}
