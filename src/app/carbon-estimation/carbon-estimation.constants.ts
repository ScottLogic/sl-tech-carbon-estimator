import { ChartOptions } from '../types/carbon-estimator';

export enum EmissionsColours {
  Upstream = '#40798C',
  Direct = '#CB3775',
  Indirect = '#91234C',
  Downstream = '#4B7E56',
}

export const tooltipFormatter = (value: number) => (value < 1 ? '<1%' : `${Math.round(value)}%`);

const customTooltip = ({
  series,
  seriesIndex,
  dataPointIndex,
  w,
}: {
  series: number[][];
  seriesIndex: number;
  dataPointIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  w: any;
}) => {
  return `<div class="p-3">
    <div>${w.globals.initialSeries[seriesIndex].name.split(' -')[0]}:</div>
    <div>${w.globals.initialSeries[seriesIndex].data[dataPointIndex].x} -
    <span class="font-bold">${tooltipFormatter(series[seriesIndex][dataPointIndex])}</span></div>`;
};

export const chartOptions: ChartOptions = {
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
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
    custom: customTooltip,
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

export const estimatorHeights = {
  title: 60,
  padding: 32,
  button: 40,
  chartExtra: 15,
};
