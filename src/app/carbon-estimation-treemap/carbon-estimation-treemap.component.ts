import { Component, ViewChild, computed, effect, input } from '@angular/core';
import { ApexAxisChartSeries, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { CarbonEstimation } from '../types/carbon-estimator';
import {
  tooltipFormatter,
  EmissionsColours,
  EmissionsLabels,
  getBaseChartOptions,
  placeholderData,
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
})
export class CarbonEstimationTreemapComponent {
  public carbonEstimation = input<CarbonEstimation>();
  public chartHeight = input.required<number>();

  public chartData = computed(() => this.getChartData(this.carbonEstimation()));
  public emissionAriaLabel = computed(() => this.getAriaLabel(this.chartData(), !this.carbonEstimation()));

  public chartOptions = computed(() => this.getChartOptions(!this.carbonEstimation()));
  private tooltipFormatter = tooltipFormatter;
  private chartReady = false;

  @ViewChild('chart') private chart: ChartComponent | undefined;

  constructor(private carbonEstimationUtilService: CarbonEstimationUtilService) {
    effect(() => {
      const chartHeight = this.chartHeight();
      if (chartHeight !== this.chartOptions().chart.height) {
        this.chart?.updateOptions({ chart: { height: chartHeight } });
      }
    });
  }

  public onChartReady() {
    this.chartReady = true;
  }

  public readyChart(): ChartComponent | undefined {
    if (this.chartReady) {
      return this.chart;
    }

    return undefined;
  }

  private getChartOptions(isPlaceholder: boolean) {
    const chartOptions = getBaseChartOptions(isPlaceholder);
    chartOptions.chart.height = this.chartHeight();
    return chartOptions;
  }

  private getChartData(estimation?: CarbonEstimation): ApexAxisChartSeries {
    return estimation ? this.getOverallEmissionPercentages(estimation) : placeholderData;
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

  private getAriaLabel(chartData: ApexAxisChartSeries, isPlaceholder: boolean) {
    return isPlaceholder ? 'Placeholder for estimation of emissions' : this.getEmissionAriaLabel(chartData);
  }

  private getEmissionAriaLabel(emission: ApexAxisChartSeries): string {
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
