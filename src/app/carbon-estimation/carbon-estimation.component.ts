import { Component, effect, input } from '@angular/core';
import { CarbonEstimation, ChartOptions } from '../types/carbon-estimator';
import { sumValues } from '../utils/number-object';
import { ApexAxisChartSeries, NgApexchartsModule } from 'ng-apexcharts';

import { startCase } from 'lodash-es';
import { EmissionsColours, chartOptions } from './carbon-estimation.constants';

@Component({
  selector: 'sl-carbon-estimation',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './carbon-estimation.component.html',
  styleUrls: ['./carbon-estimation.component.css'],
})
export class CarbonEstimationComponent {
  public carbonEstimation = input.required<CarbonEstimation>();

  public emissions: ApexAxisChartSeries = [];

  public chartOptions: ChartOptions = chartOptions;

  constructor() {
    effect(() => {
      this.emissions = this.getOverallEmissionPercentages(this.carbonEstimation());
    });
  }

  private getOverallEmissionPercentages(carbonEstimation: CarbonEstimation): ApexAxisChartSeries {
    return [
      {
        name: `Upstream Emissions - ${Math.round(sumValues(carbonEstimation.upstreamEmissions))}%`,
        color: EmissionsColours.Upstream,
        data: this.getEmissionPercentages(carbonEstimation.upstreamEmissions, this.getUpstreamLabel),
      },
      {
        name: `Direct Emissions - ${Math.round(sumValues(carbonEstimation.directEmissions))}%`,
        color: EmissionsColours.Direct,
        data: this.getEmissionPercentages(carbonEstimation.directEmissions, this.getDirectLabel),
      },
      {
        name: `Indirect Emissions - ${Math.round(sumValues(carbonEstimation.indirectEmissions))}%`,
        color: EmissionsColours.Indirect,
        data: this.getEmissionPercentages(carbonEstimation.indirectEmissions, this.getIndirectLabel),
      },
      {
        name: `Downstream Emissions - ${Math.round(sumValues(carbonEstimation.downstreamEmissions))}%`,
        color: EmissionsColours.Downstream,
        data: this.getEmissionPercentages(carbonEstimation.downstreamEmissions, this.getDownstreamLabel),
      },
    ];
  }

  private getEmissionPercentages(
    emissions: { [key: string]: number },
    labelFunction: (key: string) => string
  ): { x: string; y: number }[] {
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
        return 'Saas';
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
}
