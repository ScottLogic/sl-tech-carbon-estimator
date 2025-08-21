import { Component, ViewChild, computed, effect, input, signal } from '@angular/core';
import { ApexAxisChartSeries, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { CarbonEstimation, CarbonEstimationPercentages, CarbonEstimationValues } from '../types/carbon-estimator';
import {
  tooltipFormatter,
  percentageTooltipFormatter,
  EmissionsColours,
  EmissionsLabels,
  getBaseChartOptions,
  placeholderData,
} from '../carbon-estimation/carbon-estimation.constants';
import { NumberObject } from '../utils/number-object';
import { CarbonEstimationUtilService } from '../services/carbon-estimation-util.service';
import html2canvas from 'html2canvas-pro';
import { CommonModule } from '@angular/common';

type ApexChartDataItem = { x: string; y: number; meta: { svg: string; parent: string } };

type ApexChartSeries = {
  name: string;
  color: string;
  data: ApexChartDataItem[];
};

@Component({
  selector: 'carbon-estimation-treemap',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './carbon-estimation-treemap.component.html',
})
export class CarbonEstimationTreemapComponent {
  public carbonEstimation = input<CarbonEstimation>();
  public chartHeight = input.required<number>();
  public shouldShowUnitsSwitch = input.required<boolean>();

  public chartData = computed(() => this.getChartData(this.carbonEstimation()));
  public emissionAriaLabel = computed(() => this.getAriaLabel(this.chartData(), !this.carbonEstimation()));

  public isMass = signal(true);

  public chartOptions = computed(() => this.getChartOptions(!this.carbonEstimation()));

  // private tooltipFormatter = tooltipFormatter;
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

  public totalEmissions = computed(() => {
    const estimation = this.carbonEstimation();
    return estimation ? this.carbonEstimationUtilService.getAbsoluteValueLabel(estimation.values.totalEmissions) : '';
  });

  public toggleMassPercentages = () => {
    this.isMass.update(value => !value);
    // this.getChartData(this.carbonEstimation());
  };

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
    const chartOptions = getBaseChartOptions(isPlaceholder, this.isMass());
    chartOptions.chart.height = this.chartHeight();
    return chartOptions;
  }

  private getChartData(estimation?: CarbonEstimation): ApexAxisChartSeries {
    if (!estimation) return placeholderData;
    return this.isMass() ?
        this.getOverallEmissionFigures(estimation.values)
      : this.getOverallEmissionFigures(estimation.percentages);
  }

  private getOverallLabel(emissions: NumberObject): string {
    return this.isMass() ?
        this.carbonEstimationUtilService.getOverallAbsoluteValueLabel(emissions)
      : this.carbonEstimationUtilService.getOverallPercentageLabel(emissions);
  }

  private getOverallEmissionFigures(carbonEstimationPart: CarbonEstimationValues|CarbonEstimationPercentages): ApexAxisChartSeries {
    return [
      {
        name: `${EmissionsLabels.Upstream} - ${this.getOverallLabel(carbonEstimationPart.upstreamEmissions)}`,
        color: EmissionsColours.Upstream,
        data: this.getEmissionFigures(carbonEstimationPart.upstreamEmissions, EmissionsLabels.Upstream),
      },
      {
        name: `${EmissionsLabels.Direct} - ${this.getOverallLabel(carbonEstimationPart.directEmissions)}`,
        color: EmissionsColours.Direct,
        data: this.getEmissionFigures(carbonEstimationPart.directEmissions, EmissionsLabels.Direct),
      },
      {
        name: `${EmissionsLabels.Indirect} - ${this.getOverallLabel(carbonEstimationPart.indirectEmissions)}`,
        color: EmissionsColours.Indirect,
        data: this.getEmissionFigures(carbonEstimationPart.indirectEmissions, EmissionsLabels.Indirect),
      },
      {
        name: `${EmissionsLabels.Downstream} - ${this.getOverallLabel(carbonEstimationPart.downstreamEmissions)}`,
        color: EmissionsColours.Downstream,
        data: this.getEmissionFigures(carbonEstimationPart.downstreamEmissions, EmissionsLabels.Downstream),
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

  private formatEmissionValue(value: number): string {
    return this.isMass() ? tooltipFormatter(value) : percentageTooltipFormatter(value);
  }

  private getEmissionMadeUp(emission: ApexChartDataItem[]): string {
    if (emission.length === 0) {
      return '.';
    }
    return `, made up of ${emission.map(item => `${item.x} ${this.formatEmissionValue(item.y)}`).join(', ')}.`;
  }

  private getEmissionFigures(emissions: NumberObject, parent: string): ApexChartDataItem[] {
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

   public getTreeCanvas() {
    const data = document.getElementById('tce-tree-chart');
    return html2canvas(data!).then(canvas => {
      const imgWidth = 208;
      const imgheight = (canvas.height * imgWidth) / canvas.width;

      return canvas; 
    })
  }
}
