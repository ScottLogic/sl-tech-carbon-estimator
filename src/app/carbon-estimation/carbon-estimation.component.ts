import { Component, effect, input } from '@angular/core';
import { CarbonEstimation } from '../carbon-estimator';
import { DecimalPipe } from '@angular/common';
import { sumValues } from '../utils/number-object';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexStates,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';

type ChartOptions = {
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  states: ApexStates;
  dataLabels: ApexDataLabels;
};
import { startCase } from 'lodash-es';

@Component({
  selector: 'sl-carbon-estimation',
  standalone: true,
  imports: [DecimalPipe, NgApexchartsModule],
  templateUrl: './carbon-estimation.component.html',
  styleUrls: ['./carbon-estimation.component.css'],
})
export class CarbonEstimationComponent {
  public carbonEstimation = input.required<CarbonEstimation>();

  public emissions: ApexAxisChartSeries = [];

  public chartOptions: ChartOptions = {
    legend: {
      show: true,
      position: 'right',
      fontSize: '20px',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      fontWeight: '400',
      markers: {
        height: 20,
        width: 10,
        radius: 2,
        offsetY: 2,
      },
    },
    chart: {
      height: 700,
      type: 'treemap',
      toolbar: {
        show: false,
      },
      selection: {
        enabled: false,
      },
    },
    plotOptions: {
      treemap: {
        distributed: false,
        enableShades: false,
        borderRadius: 4,
      },
    },
    tooltip: {
      y: { formatter: value => (value < 1 ? '<1%' : `${Math.round(value)}%`) },
    },
    states: {
      active: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    dataLabels: {
      style: {
        fontSize: '16px',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontWeight: '400',
      },
    },
  };

  constructor() {
    effect(() => {
      const carbonEstimation = this.carbonEstimation();
      const upstreamEmissionsPercent = Math.round(sumValues(carbonEstimation.upstreamEmissions));
      const indirectEmissionsPercent = Math.round(sumValues(carbonEstimation.indirectEmissions));
      const directEmissionsPercent = Math.round(sumValues(carbonEstimation.directEmissions));
      const downstreamEmissionsPercent = Math.round(sumValues(carbonEstimation.downstreamEmissions));

      // this.emissions = [
      //   {
      //     data: [
      //       {
      //         x: 'Upstream',
      //         y: this.upstreamEmissionsPercent,
      //         fillColor: '#40798C',
      //       },
      //       {
      //         x: 'Indirect',
      //         y: this.indirectEmissionsPercent,
      //         fillColor: '#CB3775',
      //       },
      //       {
      //         x: 'Direct',
      //         y: this.directEmissionsPercent,
      //         fillColor: '#91234C',
      //       },
      //       {
      //         x: 'Downstream',
      //         y: this.downstreamEmissionsPercent,
      //         fillColor: '#4B7E56',
      //       },
      //     ],
      //   },
      // ];

      this.emissions = [
        {
          name: `Upstream Emissions - ${upstreamEmissionsPercent}%`,
          color: '#40798C',
          data: this.getEmissionPercentages(carbonEstimation.upstreamEmissions),
        },
        {
          name: `Indirect Emissions - ${indirectEmissionsPercent}%`,
          color: '#CB3775',
          data: this.getEmissionPercentages(carbonEstimation.indirectEmissions),
        },
        {
          name: `Direct Emissions - ${directEmissionsPercent}%`,
          color: '#91234C',
          data: this.getEmissionPercentages(carbonEstimation.directEmissions),
        },
        {
          name: `Downstream Emissions - ${downstreamEmissionsPercent}%`,
          color: '#4B7E56',
          data: this.getEmissionPercentages(carbonEstimation.downstreamEmissions),
        },
      ];
    });
  }

  private getEmissionPercentages(emissions: { [key: string]: number }): { x: string; y: number }[] {
    return (
      Object.entries(emissions)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_key, value]) => value !== 0)
        .map(([key, value]) => ({ x: startCase(key), y: value }))
    );
  }
}
