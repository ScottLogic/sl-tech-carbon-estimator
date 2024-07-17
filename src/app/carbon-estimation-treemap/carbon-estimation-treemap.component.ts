import { Component, OnInit, ViewChild, effect, input } from '@angular/core';
import { ApexAxisChartSeries, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { CarbonEstimation, ChartOptions } from '../types/carbon-estimator';
import {
  chartOptions,
  tooltipFormatter,
  EmissionsColours,
  EmissionsLabels,
} from '../carbon-estimation/carbon-estimation.constants';
import { NumberObject } from '../utils/number-object';
import { CarbonEstimationUtilService } from '../services/carbon-estimation-util.service';

type ApexChartDataItem = { x: string; y: number; meta: { svg: string; parent: string } };

type ApexChartSeries = {
  name: string;
  color: string;
  data: ApexChartDataItem[];
};

@Component({
  selector: 'carbon-estimation-treemap',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './carbon-estimation-treemap.component.html',
  styleUrl: './carbon-estimation-treemap.component.css',
})
export class CarbonEstimationTreemapComponent implements OnInit {
  public carbonEstimation = input.required<CarbonEstimation>();
  public chartHeight = input.required<number>();

  public emissions: ApexAxisChartSeries = [];
  public emissionAriaLabel = 'Estimations of emissions.';

  public chartOptions: ChartOptions = chartOptions;
  private tooltipFormatter = tooltipFormatter;

  @ViewChild('chart') chart: ChartComponent | undefined;

  constructor(private carbonEstimationUtilService: CarbonEstimationUtilService) {
    effect(() => {
      this.emissions = this.getOverallEmissionPercentages(this.carbonEstimation());
      this.emissionAriaLabel = this.getAriaLabel(this.emissions);
      const chartHeight = this.chartHeight();
      if (chartHeight !== this.chartOptions.chart.height) {
        this.chart?.updateOptions({ chart: { height: chartHeight } });
      }
    });
  }

  public ngOnInit(): void {
    const chartHeight = this.chartHeight();
    if (chartHeight > 0) {
      this.chartOptions.chart.height = chartHeight;
    }
  }

  private getOverallEmissionPercentages(carbonEstimation: CarbonEstimation): ApexAxisChartSeries {
    return [
      {
        name: `${EmissionsLabels.Upstream} - ${this.carbonEstimationUtilService.getOverallPercentageLabel(carbonEstimation.upstreamEmissions)}`,
        color: EmissionsColours.Upstream,
        data: this.getEmissionPercentages(carbonEstimation.upstreamEmissions, EmissionsLabels.Upstream),
      },
      {
        name: `${EmissionsLabels.Direct} - ${this.carbonEstimationUtilService.getOverallPercentageLabel(carbonEstimation.directEmissions)}`,
        color: EmissionsColours.Direct,
        data: this.getEmissionPercentages(carbonEstimation.directEmissions, EmissionsLabels.Direct),
      },
      {
        name: `${EmissionsLabels.Indirect} - ${this.carbonEstimationUtilService.getOverallPercentageLabel(carbonEstimation.indirectEmissions)}`,
        color: EmissionsColours.Indirect,
        data: this.getEmissionPercentages(carbonEstimation.indirectEmissions, EmissionsLabels.Indirect),
      },
      {
        name: `${EmissionsLabels.Downstream} - ${this.carbonEstimationUtilService.getOverallPercentageLabel(carbonEstimation.downstreamEmissions)}`,
        color: EmissionsColours.Downstream,
        data: this.getEmissionPercentages(carbonEstimation.downstreamEmissions, EmissionsLabels.Downstream),
      },
    ].filter(entry => entry.data.length !== 0);
  }

  private getAriaLabel(emission: ApexAxisChartSeries): string {
    return `Estimation of emissions. ${emission.map(entry => this.getAriaLabelForCategory(entry as ApexChartSeries)).join(' ')}`;
  }

  private getAriaLabelForCategory(series: ApexChartSeries): string {
    const category = series.name.replace('-', 'are');
    return `${category}${this.getEmissionMadeUp(series.data)}`;
  }

  private getEmissionMadeUp(emission: ApexChartDataItem[]): string {
    if (emission.length === 0) {
      return '.';
    }
    return `, made up of ${emission.map(item => `${item.x} ${this.tooltipFormatter(item.y)}`).join(', ')}.`;
  }

  private getEmissionPercentages(emissions: NumberObject, parent: string): ApexChartDataItem[] {
    return (
      Object.entries(emissions)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_key, value]) => value !== 0)
        .map(([_key, value]) => this.getDataItem(_key, value, parent))
    );
  }

  private getDataItem(key: string, value: number, parent: string): ApexChartDataItem {
    const { label, svg } = this.carbonEstimationUtilService.getLabelAndSvg(key, parent);
    return this.getDataItemObject(label, value, svg, parent);
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
}
